import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-orange-50 px-6 md:px-12 py-12 text-sm text-gray-600">
      <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🛋️</span>
            <span className="font-semibold text-orange-500 text-lg">
              Furniture
            </span>
          </div>
          <p className="text-gray-500 leading-relaxed max-w-xs">
            Lorem ipsum dolor sit amet consectetur. Onare sed quie magna
            dignis pulvinar amet. Ut elim quam faucibus orci ut elit
            adipiscing tueco massa amet.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Company</h4>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-orange-500">About us</Link></li>
            <li><Link to="/products" className="hover:text-orange-500">Products</Link></li>
            <li><a href="#services" className="hover:text-orange-500">Our Services</a></li>
            <li><a href="#contact" className="hover:text-orange-500">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Legal</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-orange-500">Privacy policy</a></li>
            <li><a href="#" className="hover:text-orange-500">Terms of use</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Get in touch</h4>
          <ul className="space-y-2">
            <li>📍 800 Winward Drive, Suite A, Convington, LA 70433</li>
            <li>✉️ info@tempestutilityconsulting.com</li>
            <li>📞 (318) 228-6768</li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-orange-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Furniture. All rights reserved.
        </p>
        <div className="flex gap-4 text-gray-500">
          <a href="#" aria-label="LinkedIn">in</a>
          <a href="#" aria-label="Facebook">f</a>
          <a href="#" aria-label="X">x</a>
        </div>
      </div>
    </footer>
  );
}