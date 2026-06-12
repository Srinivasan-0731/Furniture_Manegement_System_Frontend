export default function CollectionsSection() {
  return (
    <section className="px-6 md:px-12 py-12 bg-orange-50/40">
      <h2 className="text-center text-2xl font-semibold text-gray-900 mb-8">
        Our <span className="text-orange-500 underline">Collections</span>
      </h2>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Outdoor Lounge Chair - big card */}
        <div className="relative bg-gradient-to-br from-orange-500 to-orange-700 rounded-3xl p-8 min-h-[280px] flex flex-col justify-between overflow-hidden">
          <h3 className="text-white text-2xl font-semibold leading-tight">
            Outdoor <br /> Lounge Chair
          </h3>
          <img
            src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80"
            alt="Outdoor lounge chairs"
            className="absolute bottom-0 right-0 w-4/5 object-contain"
          />
        </div>

        {/* Explore more + plant - right tall card */}
        <div className="relative bg-gradient-to-br from-orange-500 to-orange-700 rounded-3xl p-8 min-h-[280px] flex flex-col items-end overflow-hidden">
          <button className="bg-white text-orange-600 text-sm font-medium px-5 py-2 rounded-full shadow-sm">
            Explore more »
          </button>
          <img
            src="https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400&q=80"
            alt="Plant"
            className="absolute bottom-0 left-0 w-2/3 object-contain"
          />
        </div>

        {/* Modern Couches - wide card spanning both columns */}
        <div className="relative md:col-span-2 bg-gradient-to-br from-orange-500 to-orange-700 rounded-3xl p-8 min-h-[220px] flex items-center overflow-hidden">
          <h3 className="text-white text-2xl font-semibold leading-tight z-10">
            Modern <br /> Couches
          </h3>
          <img
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"
            alt="Modern couch"
            className="absolute right-6 bottom-0 w-3/5 object-contain"
          />
        </div>
      </div>
    </section>
  );
}