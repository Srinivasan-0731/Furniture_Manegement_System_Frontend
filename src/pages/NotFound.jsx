import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50/40 text-center px-4">
      <h1 className="text-6xl font-bold text-orange-500 mb-2">404</h1>
      <p className="text-gray-600 mb-6">Page not found</p>
      <Link
        to="/"
        className="px-6 py-3 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 transition"
      >
        Go home
      </Link>
    </div>
  );
}