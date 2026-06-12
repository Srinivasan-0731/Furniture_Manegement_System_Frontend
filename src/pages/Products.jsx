import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data.data || res.data))
      .catch(() => setError("Could not load products"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-orange-50/30 min-h-screen">
      <Navbar />
      <div className="px-6 md:px-12 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Our <span className="text-orange-500 underline">Products</span>
        </h1>

        {loading && <p className="text-gray-500">Loading products...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <Link
              to={`/products/${p._id}`}
              key={p._id}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="bg-orange-100 rounded-xl h-40 mb-3 flex items-center justify-center overflow-hidden">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="object-cover w-full h-full" />
                ) : (
                  <span className="text-4xl">🪑</span>
                )}
              </div>
              <h3 className="font-medium text-gray-900">{p.name}</h3>
              <p className="text-sm text-gray-500">
                {typeof p.category === "object" && p.category !== null
                  ? p.category.name
                  : p.category}
              </p>
              <p className="text-orange-500 font-semibold mt-1">₹{p.price}</p>
            </Link>
          ))}
        </div>

        {!loading && products.length === 0 && !error && (
          <p className="text-gray-500">No products found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}