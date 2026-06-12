import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/admin/products", label: "Products", icon: "🛋️" },
  { to: "/dashboard/orders", label: "Orders", icon: "📦" },
  { to: "/dashboard/categories", label: "Categories", icon: "🗂️" },
  { to: "/dashboard/customers", label: "Customers", icon: "👥" },
  { to: "/dashboard/reviews", label: "Reviews", icon: "⭐" },
  { to: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-white min-h-screen border-r border-orange-50 flex flex-col px-4 py-6">
      <Link to="/" className="flex items-center gap-2 mb-8 px-2">
        <span className="text-2xl">🛋️</span>
        <span className="font-semibold text-orange-500 text-lg">Furniture</span>
      </Link>

      <nav className="flex-1 space-y-1">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
              location.pathname === link.to
                ? "bg-orange-500 text-white"
                : "text-gray-600 hover:bg-orange-50"
            }`}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={() => {
          logout();
          navigate("/");
        }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition"
      >
        🚪 Logout
      </button>
    </aside>
  );
}