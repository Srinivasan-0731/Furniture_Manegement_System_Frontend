import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";
import { Link, useNavigate } from "react-router-dom";

const RAZORPAY_KEY_ID = "rzp_test_T0FNBRLOck5CC6";

export default function Cart() {
  const [cart, setCart]                   = useState(null);
  const [loading, setLoading]             = useState(true);
  const [placing, setPlacing]             = useState(false);
  const [payLaterPlacing, setPayLaterPlacing] = useState(false);
  const [success, setSuccess]             = useState(false);
  const [successMsg, setSuccessMsg]       = useState("");
  const [orderError, setOrderError]       = useState("");
  const [showCheckout, setShowCheckout]   = useState(false);
  const [address, setAddress]             = useState({
    street: "", city: "", state: "", pincode: "", phone: "",
  });
  const navigate = useNavigate();

  // ── Fetch cart ──────────────────────────────────────────────
  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data.data || res.data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  // ── Quantity update / remove ────────────────────────────────
  const updateQty = async (productId, quantity) => {
    if (quantity < 1) return removeItem(productId);
    try {
      await api.put("/cart", { productId, quantity });
      fetchCart();
    } catch {}
  };

  const removeItem = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`);
      fetchCart();
    } catch {}
  };

  // ── Address ─────────────────────────────────────────────────
  const handleAddrChange = (e) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  const validateAddress = () => {
    const { street, city, state, pincode, phone } = address;
    if (!street || !city || !state || !pincode || !phone) {
      setOrderError("Please fill in all shipping address fields.");
      return false;
    }
    return true;
  };

  // ── Load Razorpay script dynamically ────────────────────────
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload  = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  // ── PAY NOW ─────────────────────────────────────────────────
  const placeOrder = async () => {
    if (!validateAddress()) return;
    setPlacing(true);
    setOrderError("");
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setOrderError("Razorpay failed to load. Check your internet connection.");
        setPlacing(false);
        return;
      }

      const { data } = await api.post("/orders/razorpay/create", {
        shippingAddress: address,
        amount: total,
      });

      const { razorpayOrderId, amount: orderAmount, currency, orderId } = data.data;

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency: currency || "INR",
        name: "Furniture Store",
        description: "Furniture Order Payment",
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            await api.post("/orders/razorpay/verify", {
              orderId,
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            setSuccessMsg("Payment Successful! Order Confirmed 🎉");
            setSuccess(true);
            setTimeout(() => navigate("/orders"), 2000);
          } catch {
            setOrderError("Payment verification failed. Please contact support.");
            setPlacing(false);
          }
        },
        prefill: { contact: address.phone },
        theme: { color: "#f97316" },
        modal: {
          ondismiss: function () {
            setPlacing(false);
            setOrderError("Payment cancelled. Please try again.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        setOrderError("Payment failed. Please try again.");
        setPlacing(false);
      });
      rzp.open();
    } catch (err) {
      setOrderError(err.response?.data?.message || "Order failed. Please try again.");
      setPlacing(false);
    }
  };

  // ── PAY LATER ────────────────────────────────────────────────
  const payLater = async () => {
    if (!validateAddress()) return;
    setPayLaterPlacing(true);
    setOrderError("");
    try {
      await api.post("/orders/pay-later", { shippingAddress: address });
      setSuccessMsg("Order saved! Pay when you're ready 📦");
      setSuccess(true);
      setTimeout(() => navigate("/orders"), 2000);
    } catch (err) {
      setOrderError(err.response?.data?.message || "Failed to save order. Please try again.");
    } finally {
      setPayLaterPlacing(false);
    }
  };

  // ── Price calculations ───────────────────────────────────────
  const items       = cart?.items || [];
  const itemsPrice  = items.reduce(
    (sum, i) => sum + (i.price || i.product?.price || 0) * i.quantity, 0
  );
  const shipping    = itemsPrice > 5000 ? 0 : 199;
  const tax         = parseFloat((itemsPrice * 0.18).toFixed(2));
  const total       = parseFloat((itemsPrice + shipping + tax).toFixed(2));

  // ── Loading state ────────────────────────────────────────────
  if (loading) return (
    <div className="bg-orange-50/30 min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  // ── Success state ─────────────────────────────────────────────
  if (success) return (
    <div className="bg-orange-50/30 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900">{successMsg}</h2>
        <p className="text-gray-500 mt-2">Redirecting to your orders...</p>
      </div>
    </div>
  );

  // ── Main render ──────────────────────────────────────────────
  return (
    <div className="bg-orange-50/30 min-h-screen">
      <Navbar />
      <div className="px-6 md:px-12 py-10 max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🛒</p>
            <p className="text-gray-400 text-lg mb-6">Your cart is empty</p>
            <Link
              to="/products"
              className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-medium"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── Cart Items ─────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const product = item.product || {};
                const name    = item.name || product.name || "Product";
                const image   = product.images?.[0] ||
                  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80";
                const price   = item.price || product.price || 0;
                const pid     = product._id;

                return (
                  <div
                    key={item._id || pid}
                    className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 items-center"
                  >
                    <img
                      src={image}
                      alt={name}
                      className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{name}</p>
                      <p className="text-orange-500 font-semibold mt-1">₹{price.toLocaleString("en-IN")}</p>
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(pid, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-200 text-gray-600 hover:bg-orange-50 transition flex items-center justify-center font-medium"
                      >−</button>
                      <span className="w-6 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(pid, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-200 text-gray-600 hover:bg-orange-50 transition flex items-center justify-center font-medium"
                      >+</button>
                    </div>

                    <p className="font-semibold text-gray-900 w-24 text-right">
                      ₹{(price * item.quantity).toLocaleString("en-IN")}
                    </p>
                    <button
                      onClick={() => removeItem(pid)}
                      className="text-red-400 hover:text-red-600 ml-2 text-lg leading-none"
                    >✕</button>
                  </div>
                );
              })}
            </div>

            {/* ── Summary + Checkout ─────────────────────────── */}
            <div className="space-y-4">

              {/* Order Summary card */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Items</span>
                    <span>₹{itemsPrice.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18%)</span>
                    <span>₹{tax.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-3 mt-1 text-base">
                    <span>Total</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {!showCheckout && (
                  <button
                    onClick={() => { setShowCheckout(true); setOrderError(""); }}
                    className="mt-5 w-full py-3 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 transition"
                  >
                    Proceed to Checkout
                  </button>
                )}
              </div>

              {/* Shipping Address + Payment Buttons */}
              {showCheckout && (
                <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
                  <h2 className="font-semibold text-gray-900 mb-1">Shipping Address</h2>

                  {[
                    { name: "street",  placeholder: "Street / House No." },
                    { name: "city",    placeholder: "City" },
                    { name: "state",   placeholder: "State" },
                    { name: "pincode", placeholder: "Pincode" },
                    { name: "phone",   placeholder: "Phone Number" },
                  ].map((f) => (
                    <input
                      key={f.name}
                      name={f.name}
                      value={address[f.name]}
                      onChange={handleAddrChange}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  ))}

                  {/* Razorpay badge */}
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-orange-200 bg-orange-50">
                    <img
                      src="https://razorpay.com/favicon.png"
                      alt="Razorpay"
                      className="w-5 h-5"
                    />
                    <span className="text-sm text-orange-700 font-medium">
                      Pay securely with Razorpay
                    </span>
                  </div>

                  {/* Error */}
                  {orderError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                      ⚠️ {orderError}
                    </div>
                  )}

                  {/* Pay Now */}
                  <button
                    onClick={() => { setOrderError(""); placeOrder(); }}
                    disabled={placing || payLaterPlacing}
                    className="w-full py-3 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 transition disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {placing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Opening Payment...
                      </>
                    ) : (
                      `Pay Now ₹${total.toLocaleString("en-IN")}`
                    )}
                  </button>

                  {/* Pay Later */}
                  <button
                    onClick={() => { setOrderError(""); payLater(); }}
                    disabled={placing || payLaterPlacing}
                    className="w-full py-3 bg-white text-orange-500 font-medium rounded-full border border-orange-400 hover:bg-orange-50 transition disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {payLaterPlacing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                        Saving Order...
                      </>
                    ) : (
                      "Pay Later"
                    )}
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    Pay Later — order saved, pay anytime from My Orders
                  </p>

                  {/* Back button */}
                  <button
                    onClick={() => { setShowCheckout(false); setOrderError(""); }}
                    className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition"
                  >
                    ← Back to cart
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}