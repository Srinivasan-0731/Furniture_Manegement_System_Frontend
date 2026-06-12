import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-6 md:px-12 py-5">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl">🛋️</span>
        <span className="font-semibold text-lg tracking-wide">Furniture</span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
        <Link to="/" className="hover:text-orange-600 transition">Home Page</Link>
        <Link to="/products" className="hover:text-orange-600 transition">Products</Link>
        <a href="#services" className="hover:text-orange-600 transition">Services</a>
        <a href="#contact" className="hover:text-orange-600 transition">Contact</a>
        <a href="#about" className="hover:text-orange-600 transition">About us</a>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link
              to="/profile"
              className="px-4 py-2 text-sm font-medium rounded-full border border-orange-400 text-orange-600 hover:bg-orange-50 transition"
            >
              {user.name?.split(" ")[0] || "Profile"}
            </Link>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="px-4 py-2 text-sm font-medium rounded-full bg-orange-500 text-white hover:bg-orange-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-medium rounded-full border border-orange-400 text-orange-600 hover:bg-orange-50 transition"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 text-sm font-medium rounded-full bg-orange-500 text-white hover:bg-orange-600 transition"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}