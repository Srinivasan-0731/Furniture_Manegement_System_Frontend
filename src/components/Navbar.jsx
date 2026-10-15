import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  const navLinks = [
    { label: "Home Page", to: "/", type: "route" },
    { label: "Products", to: "/products", type: "route" },
    { label: "Services", to: "/#services", type: "anchor" },
    { label: "Contact", to: "/#contact", type: "anchor" },
    { label: "About us", to: "/#about", type: "anchor" },
  ];

  return (
    <nav className="relative flex items-center justify-between px-6 md:px-12 py-5">
      {/* Logo */}
      <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
        <span className="text-2xl">🛋️</span>
        <span className="font-semibold text-lg tracking-wide">Furniture</span>
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
        {navLinks.map((l) =>
          l.type === "route" ? (
            <Link key={l.label} to={l.to} className="hover:text-orange-600 transition">
              {l.label}
            </Link>
          ) : (
            <a key={l.label} href={l.to} className="hover:text-orange-600 transition">
              {l.label}
            </a>
          )
        )}
      </div>

      {/* Desktop auth buttons */}
      <div className="hidden md:flex items-center gap-3">
        {user ? (
          <>
            <Link
              to="/profile"
              className="px-4 py-2 text-sm font-medium rounded-full border border-orange-400 text-orange-600 hover:bg-orange-50 transition"
            >
              {user.name?.split(" ")[0] || "Profile"}
            </Link>
            <button
              onClick={handleLogout}
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

      {/* Hamburger button (small screens only, right side) */}
      <button
        type="button"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-orange-50 transition"
      >
        {menuOpen ? (
          // X icon
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="5" y1="5" x2="19" y2="19" />
            <line x1="19" y1="5" x2="5" y2="19" />
          </svg>
        ) : (
          // Three lines icon
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        )}
      </button>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 z-40 bg-white shadow-lg border-t border-orange-100 px-6 py-4">
          <div className="flex flex-col text-sm font-medium text-gray-700">
            {navLinks.map((l) =>
              l.type === "route" ? (
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={closeMenu}
                  className="py-3 border-b border-gray-100 hover:text-orange-600 transition"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.label}
                  href={l.to}
                  onClick={closeMenu}
                  className="py-3 border-b border-gray-100 hover:text-orange-600 transition"
                >
                  {l.label}
                </a>
              )
            )}
          </div>

          <div className="flex flex-col gap-3 mt-4">
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="text-center px-4 py-2.5 text-sm font-medium cursor-pointer rounded-full border border-orange-400 text-orange-600 hover:bg-orange-50 transition"
                >
                  {user.name?.split(" ")[0] || "Profile"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 text-sm font-medium rounded-full cursor-pointer bg-orange-500 text-white hover:bg-orange-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="text-center px-5 py-2.5 text-sm cursor-pointer font-medium rounded-full border border-orange-400 text-orange-600 hover:bg-orange-50 transition"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="text-center px-5 py-2.5 text-sm cursor-pointer font-medium rounded-full bg-orange-500 text-white hover:bg-orange-600 transition"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}