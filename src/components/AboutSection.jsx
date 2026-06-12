export default function AboutSection() {
  return (
    <section id="about" className="px-6 md:px-12 py-14">
      <h2 className="text-center text-2xl font-semibold text-orange-500 mb-8">
        About Us
      </h2>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
        <div>
          <p className="text-gray-500 leading-relaxed mb-6">
            Lorem ipsum dolor sit amet consectetur. Sit lacus sed nisi tortor
            sed elit rutrum viverra luctus. Vulputate congue lobortis nisl
            laculis viverra mauris mattis mattis eluctus. Vulputate congue
            lobortis nisl
          </p>
          <a
            href="#contact"
            className="inline-block px-6 py-3 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 transition"
          >
            Explore more ↗
          </a>
        </div>

        <div className="relative bg-orange-600 rounded-3xl overflow-hidden h-64 md:h-80">
          <img
            src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80"
            alt="Orange themed living room"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
        </div>
      </div>
    </section>
  );
}