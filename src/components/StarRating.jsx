export default function StarRating({ rating = 0, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={i < Math.round(rating) ? "text-orange-500" : "text-gray-300"}
        >
          ★
        </span>
      ))}
    </div>
  );
}