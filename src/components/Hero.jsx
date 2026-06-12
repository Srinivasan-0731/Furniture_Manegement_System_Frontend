import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Orange blob background */}
      <div className="absolute -top-32 -left-32 w-[480px] h-[480px] bg-orange-500 rounded-full opacity-90 -z-10"></div>
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-orange-100 via-orange-50 to-transparent -z-20"></div>

      <div className="relative grid md:grid-cols-2 gap-10 items-center px-6 md:px-12 pt-10 pb-16">
        {/* Left - Sofa Image */}
        <div className="relative flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80"
            alt="Modern sofa"
            className="w-full max-w-md rounded-2xl object-cover drop-shadow-2xl"
          />
          <img
            src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=200&q=80"
            alt="Pendant light"
            className="absolute -top-4 left-10 w-20 h-28 object-contain hidden md:block"
          />
        </div>

        {/* Right - Text */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Make you feel <span className="text-orange-500">luxury</span>
          </h1>
          <p className="mt-4 text-gray-500 max-w-md leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. In diam viverra ullamcorper
            pellentesque purus. Egestas curabitur nulla amet phasellus ut. Sed
            consequat lorem semper id elementum varius lectus. Eget fermentum
            in nulla risus ut bibendum nulla.
          </p>
          <Link
            to="/products"
            className="inline-block mt-6 px-6 py-3 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 transition"
          >
            Shop now ↗
          </Link>
        </div>
      </div>

      {/* Search + Stats */}
      <div className="relative px-6 md:px-12 pb-10 flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex items-center bg-white rounded-full shadow-sm px-5 py-3 max-w-sm w-full">
          <span className="text-gray-400 mr-2">🔍</span>
          <input
            type="text"
            placeholder="What are you looking for ?"
            className="bg-transparent outline-none text-sm w-full text-gray-600 placeholder-gray-400"
          />
        </div>

        <div className="flex items-center gap-10">
          <div>
            <p className="text-orange-500 font-bold text-lg">1.3 M+</p>
            <p className="text-xs text-gray-500">Customer reviews</p>
          </div>
          <div>
            <p className="text-orange-500 font-bold text-lg">4.7 M+</p>
            <p className="text-xs text-gray-500">Active members</p>
          </div>
          <div>
            <p className="text-orange-500 font-bold text-lg">3 day</p>
            <p className="text-xs text-gray-500">Delivery time</p>
          </div>
        </div>
      </div>
    </section>
  );
}