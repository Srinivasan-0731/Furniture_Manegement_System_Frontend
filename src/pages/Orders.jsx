import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const STATUS_COLORS = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  processing: "#8b5cf6",
  shipped: "#06b6d4",
  delivered: "#10b981",
  cancelled: "#ef4444",
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/my");
      setOrders(res.data.data);
    } catch (err) {
      toast.error("Orders load failed");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await api.patch(`/orders/${orderId}/status`, {
        status: "cancelled",
        cancelReason: "Customer requested",
      });
      toast.success("Order cancelled!");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancel failed");
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading orders...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>My Orders ({orders.length})</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 15,
              marginBottom: 15,
            }}
          >
            {/* Order Header */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <p style={{ margin: 0, fontWeight: "bold" }}>Order ID: {order._id}</p>
                <p style={{ margin: 0, color: "#666", fontSize: 13 }}>
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
              <span
                style={{
                  background: STATUS_COLORS[order.status] || "#999",
                  color: "#fff",
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 13,
                  height: "fit-content",
                }}
              >
                {order.status.toUpperCase()}
              </span>
            </div>

            {/* Order Items */}
            {order.items.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px 0",
                  borderTop: "1px solid #eee",
                }}
              >
                <span>{item.name}</span>
                <span>x{item.quantity} — ₹{item.price * item.quantity}</span>
              </div>
            ))}

            {/* Order Footer */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
              <div>
                <p style={{ margin: 0, fontWeight: "bold" }}>Total: ₹{order.totalAmount}</p>
                <p style={{ margin: 0, color: "#666", fontSize: 13 }}>
                  Payment: {order.paymentMethod.toUpperCase()}
                </p>
              </div>
              {order.status === "pending" && (
                <button
                  onClick={() => cancelOrder(order._id)}
                  style={{
                    padding: "6px 16px",
                    background: "#ef4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;