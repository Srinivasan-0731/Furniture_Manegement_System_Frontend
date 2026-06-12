export default function ProductCard({ title, image, link = "#" }) {
  return (
    <div className="relative bg-gradient-to-br from-orange-500 to-orange-700 rounded-3xl p-6 min-h-[260px] flex flex-col justify-end overflow-hidden">
      <img
        src={image}
        alt={title}
        className="absolute top-4 left-1/2 -translate-x-1/2 w-3/4 object-contain drop-shadow-lg"
      />
      <div className="relative z-10">
        <h3 className="text-white text-lg font-semibold mb-3">{title}</h3>
        <a
          href={link}
          className="inline-block bg-white text-orange-600 text-xs font-medium px-4 py-2 rounded-full"
        >
          Explore more »
        </a>
      </div>
    </div>
  );
}