import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../utils/api";

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, revenue: 0 });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/dashboard/stats").then((res) => setStats(res.data.data || res.data)).catch(() => {});
    api.get("/orders").then((res) => {
      const data = res.data.data || res.data;
      setOrders(Array.isArray(data) ? data.slice(0, 4) : []);
    }).catch(() => {});
    api.get("/products").then((res) => {
      const data = res.data.data || res.data;
      setProducts(Array.isArray(data) ? data.slice(0, 4) : []);
    }).catch(() => {});
  }, []);

  const toCount = (val) => {
    if (typeof val === "number") return val;
    if (Array.isArray(val)) return val.length;
    if (val && typeof val === "object") return val.count ?? Object.keys(val).length;
    return val ?? 0;
  };

  const statCards = [
    { label: "Total Users", value: toCount(stats.users), icon: "👥" },
    { label: "Products", value: toCount(stats.products), icon: "🛋️" },
    { label: "Orders", value: toCount(stats.orders), icon: "📦" },
    { label: "Revenue", value: `₹${toCount(stats.revenue)}`, icon: "💰" },
  ];

  const statusColor = {
    Delivered: "bg-green-100 text-green-600",
    Shipped: "bg-blue-100 text-blue-600",
    Pending: "bg-yellow-100 text-yellow-600",
    Cancelled: "bg-red-100 text-red-600",
  };

  return (
    <div className="flex bg-orange-50/30 min-h-screen">
      <Sidebar />
      <main className="flex-1 px-8 py-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="text-2xl mb-2">{card.icon}</div>
              <p className="text-xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Recent Orders</h2>
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order._id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-800">#{order._id?.slice(-6)}</p>
                    <p className="text-gray-500">
                      {typeof order.user === "object" && order.user !== null
                        ? order.user.name
                        : typeof order.customerName === "object"
                        ? order.customerName?.name
                        : order.customerName || "Guest"}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[order.status] || "bg-gray-100 text-gray-600"}`}>
                    {order.status}
                  </span>
                  <span className="font-semibold text-gray-900">₹{order.totalAmount}</span>
                </div>
              ))}
              {orders.length === 0 && <p className="text-gray-400 text-sm">No orders yet</p>}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Top Products</h2>
            <div className="space-y-3">
              {products.map((p) => (
                <div key={p._id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>🪑</span>
                    <div>
                      <p className="font-medium text-gray-800">{p.name}</p>
                      <p className="text-gray-500">
                        {typeof p.category === "object" && p.category !== null
                          ? p.category.name
                          : p.category}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900">₹{p.price}</span>
                  <span className="text-gray-500">Stock: {p.stock}</span>
                </div>
              ))}
              {products.length === 0 && <p className="text-gray-400 text-sm">No products yet</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}