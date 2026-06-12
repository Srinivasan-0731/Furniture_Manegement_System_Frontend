import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CollectionsSection from "../components/CollectionsSection";
import FeaturedProducts from "../components/FeaturedProducts";
import AboutSection from "../components/AboutSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="bg-orange-50/30 min-h-screen">
      <Navbar />
      <Hero />
      <CollectionsSection />
      <FeaturedProducts />
      <AboutSection />
      <Footer />
    </div>
  );
}