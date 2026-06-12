import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";

const RAZORPAY_KEY_ID = "rzp_test_T0FNBRLOck5CC6";

const STATUS_STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];

const STATUS_COLOR = {
  pending:    "bg-yellow-100 text-yellow-700",
  confirmed:  "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped:    "bg-indigo-100 text-indigo-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
};

export default function MyOrders() {
  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selectedOrder, setSelected]  = useState(null);
  const [cancelling, setCancelling]   = useState(null);
  const [payingId, setPayingId]       = useState(null);
  const [toast, setToast]             = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/my");
      setOrders(res.data.data || res.data || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // ── Cancel ────────────────────────────────────────────────
  const cancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    setCancelling(orderId);
    try {
      await api.patch(`/orders/${orderId}/cancel`);
      // Remove cancelled order from list immediately — don't show it
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      if (selectedOrder?._id === orderId) setSelected(null);
      showToast("Order cancelled successfully.");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to cancel order.");
    } finally {
      setCancelling(null);
    }
  };

  // ── Pay Now (from MyOrders for pending orders) ───────────
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const payNow = async (order) => {
    setPayingId(order._id);
    try {
      const ok = await loadRazorpayScript();
      if (!ok) { showToast("Razorpay failed to load."); return; }

      const { data } = await api.post(`/orders/${order._id}/razorpay/create`);
      const { razorpayOrderId, amount, currency, orderId } = data.data;

      const options = {
        key: RAZORPAY_KEY_ID,
        amount,
        currency: currency || "INR",
        name: "Furniture Store",
        description: `Order #${order.orderNumber}`,
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            await api.post("/orders/razorpay/verify", {
              orderId,
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            showToast("Payment successful! Order confirmed 🎉");
            fetchOrders();
            if (selectedOrder?._id === order._id) setSelected(null);
          } catch {
            showToast("Payment verification failed. Contact support.");
          }
        },
        prefill: { contact: order.shippingAddress?.phone || "" },
        theme: { color: "#f97316" },
        modal: {
          ondismiss: () => {
            setPayingId(null);
            showToast("Payment cancelled.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        showToast("Payment failed. Please try again.");
        setPayingId(null);
      });
      rzp.open();
    } catch (err) {
      showToast(err.response?.data?.message || "Payment initiation failed.");
      setPayingId(null);
    }
  };

  // ── Helpers ───────────────────────────────────────────────
  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const canCancel = (o) => ["pending", "confirmed"].includes(o.orderStatus);
  const isPending = (o) => o.paymentStatus === "pending" && o.orderStatus !== "cancelled";

  // ── Detail Modal ──────────────────────────────────────────
  const OrderModal = ({ order, onClose }) => {
    const stepIdx = STATUS_STEPS.indexOf(order.orderStatus);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Order</p>
              <p className="font-bold text-gray-900">#{order.orderNumber || order._id.slice(-8).toUpperCase()}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
          </div>

          <div className="px-6 py-5 space-y-6">
            {/* Status badge */}
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLOR[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>
              {order.orderStatus}
            </span>

            {/* Progress tracker — only for non-cancelled */}
            {order.orderStatus !== "cancelled" && (
              <div className="relative flex items-center justify-between">
                <div className="absolute left-0 right-0 top-3 h-0.5 bg-gray-200" />
                <div
                  className="absolute left-0 top-3 h-0.5 bg-orange-400 transition-all"
                  style={{ width: `${(stepIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
                />
                {STATUS_STEPS.map((s, i) => (
                  <div key={s} className="relative flex flex-col items-center gap-1 z-10">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold
                      ${i <= stepIdx ? "bg-orange-500 border-orange-500 text-white" : "bg-white border-gray-300 text-gray-400"}`}>
                      {i < stepIdx ? "✓" : i + 1}
                    </div>
                    <span className="text-[10px] text-gray-500 capitalize">{s}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Items */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Items</p>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80"}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="bg-orange-50 rounded-xl p-4 text-sm space-y-1">
              <div className="flex justify-between text-gray-600"><span>Items</span><span>₹{order.itemsPrice?.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{order.shippingPrice === 0 ? "Free" : `₹${order.shippingPrice}`}</span></div>
              <div className="flex justify-between text-gray-600"><span>Tax</span><span>₹{order.taxPrice?.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-gray-900 border-t border-orange-200 pt-2 mt-2">
                <span>Total</span><span>₹{order.totalPrice?.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment info */}
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium text-gray-700">Payment: </span>
                <span className={`font-semibold ${order.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"}`}>
                  {order.paymentStatus}
                </span>
              </p>
              {order.paymentId && <p><span className="font-medium text-gray-700">Payment ID: </span>{order.paymentId}</p>}
            </div>

            {/* Shipping address */}
            <div className="text-sm text-gray-600">
              <p className="font-semibold text-gray-700 mb-1">Shipping Address</p>
              <p>{order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
              <p>{order.shippingAddress?.state} — {order.shippingAddress?.pincode}</p>
              <p>📞 {order.shippingAddress?.phone}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              {isPending(order) && (
                <button
                  onClick={() => { onClose(); payNow(order); }}
                  disabled={payingId === order._id}
                  className="flex-1 py-2.5 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition disabled:opacity-60 text-sm"
                >
                  {payingId === order._id ? "Opening..." : "Pay Now"}
                </button>
              )}
              {canCancel(order) && (
                <button
                  onClick={() => cancelOrder(order._id)}
                  disabled={cancelling === order._id}
                  className="flex-1 py-2.5 border border-red-300 text-red-500 rounded-full font-medium hover:bg-red-50 transition disabled:opacity-60 text-sm"
                >
                  {cancelling === order._id ? "Cancelling..." : "Cancel Order"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="bg-orange-50/30 min-h-screen">
      <Navbar />

      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-3 rounded-full text-sm shadow-lg">
          {toast}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">My Orders</h1>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-lg">No orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Order</p>
                    <p className="font-bold text-gray-900">
                      #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{fmtDate(order.createdAt)}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLOR[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>
                      {order.orderStatus}
                    </span>
                    {isPending(order) && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                        Payment Pending
                      </span>
                    )}
                  </div>
                </div>

                {/* Preview items */}
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {order.items.slice(0, 3).map((item, i) => (
                    <img
                      key={i}
                      src={item.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80"}
                      alt={item.name}
                      title={item.name}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                    />
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center text-xs text-orange-500 font-medium flex-shrink-0">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                  <p className="font-bold text-gray-900">₹{order.totalPrice?.toFixed(2)}</p>

                  <div className="flex gap-2 flex-wrap">
                    {/* Pay Now — for pending payment orders */}
                    {isPending(order) && (
                      <button
                        onClick={() => payNow(order)}
                        disabled={payingId === order._id}
                        className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-full hover:bg-orange-600 transition disabled:opacity-60"
                      >
                        {payingId === order._id ? "Opening..." : "Pay Now"}
                      </button>
                    )}

                    {/* Cancel */}
                    {canCancel(order) && (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        disabled={cancelling === order._id}
                        className="px-4 py-2 border border-red-300 text-red-500 text-sm font-medium rounded-full hover:bg-red-50 transition disabled:opacity-60"
                      >
                        {cancelling === order._id ? "Cancelling..." : "Cancel"}
                      </button>
                    )}

                    {/* View Details */}
                    <button
                      onClick={() => setSelected(order)}
                      className="px-4 py-2 border border-orange-300 text-orange-500 text-sm font-medium rounded-full hover:bg-orange-50 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={() => setSelected(null)} />
      )}

      <Footer />
    </div>
  );
}