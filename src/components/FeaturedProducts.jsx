import ProductCard from "./ProductCard";

const featured = [
  {
    title: "Modern Chair",
    image:
      "https://images.unsplash.com/photo-1503602642458-232111445657?w=400&q=80",
  },
  {
    title: "Bamboo Swing Chairs",
    image:
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400&q=80",
  },
  {
    title: "Hanging Light",
    image:
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de2f0?w=400&q=80",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="px-6 md:px-12 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {featured.map((item) => (
          <ProductCard key={item.title} title={item.title} image={item.image} />
        ))}
      </div>
    </section>
  );
}