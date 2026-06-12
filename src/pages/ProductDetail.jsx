import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StarRating from "../components/StarRating";
import api from "../utils/api";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data.data || res.data))
      .catch(() => setError("Could not load product"));
  }, [id]);

  const addToCart = async () => {
    try {
      await api.post("/cart", { productId: id, quantity: qty });
      setMessage("Added to cart");
    } catch {
      setMessage("Please log in to add to cart");
    }
  };

  const buyNow = async () => {
    setBuying(true);
    try {
      await api.post("/cart", { productId: id, quantity: qty });
      navigate("/cart");
    } catch {
      setMessage("Please log in to buy this product");
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="bg-orange-50/30 min-h-screen">
      <Navbar />
      <div className="px-6 md:px-12 py-10">
        {error && <p className="text-red-500">{error}</p>}
        {!product && !error && <p className="text-gray-500">Loading...</p>}

        {product && (
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto bg-white rounded-3xl p-8 shadow-sm">
            <div className="bg-orange-100 rounded-2xl h-72 flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
              ) : (
                <span className="text-6xl">🪑</span>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>
              <p className="text-sm text-gray-500 mb-2">
                {typeof product.category === "object" && product.category !== null
                  ? product.category.name
                  : product.category}
              </p>
              <StarRating rating={product.rating} />
              <p className="text-orange-500 text-2xl font-bold mt-3">₹{product.price}</p>
              <p className="text-gray-500 mt-3 leading-relaxed">{product.description}</p>
              <p className="text-sm text-gray-500 mt-2">In stock: {product.stock}</p>

              <div className="flex items-center gap-3 mt-5">
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="w-20 px-3 py-2 rounded-xl border border-gray-200"
                />
                <button
                  onClick={addToCart}
                  className="px-6 py-3 bg-white border border-orange-400 text-orange-600 font-medium rounded-full hover:bg-orange-50 transition"
                >
                  Add to cart
                </button>
                <button
                  onClick={buyNow}
                  disabled={buying}
                  className="px-6 py-3 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 transition disabled:opacity-60"
                >
                  {buying ? "Processing..." : "Buy now"}
                </button>
              </div>

              {message && <p className="text-sm text-gray-600 mt-3">{message}</p>}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}