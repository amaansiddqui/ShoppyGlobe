import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useFetchProducts } from "../hooks/useFetchProducts";
import ProductList from "./ProductList";

const PRODUCTS_URL = "https://dummyjson.com/products";
const CATEGORIES_URL = "https://dummyjson.com/products/category-list";

// Simple gradient hero slides (no external assets needed)
const HERO_SLIDES = [
  {
    title: "Everything You Love, One Store",
    subtitle: "Thousands of products, delivered to your door. Free returns within 30 days.",
    cta: "Shop All Products",
    gradient: "from-purple-700 via-purple-600 to-indigo-500",
    emoji: "🛍️",
  },
  {
    title: "Big Savings, Every Day",
    subtitle: "Up to 40% off on top-rated picks across fashion, beauty, home and more.",
    cta: "See Top Deals",
    gradient: "from-amber-500 via-orange-500 to-rose-500",
    emoji: "🔥",
  },
  {
    title: "New Arrivals Weekly",
    subtitle: "Discover the latest gadgets, fragrances and essentials before anyone else.",
    cta: "Explore Categories",
    gradient: "from-emerald-600 via-teal-500 to-cyan-500",
    emoji: "✨",
  },
];

// Full-width hero carousel with autoplay
function HeroCarousel() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const current = HERO_SLIDES[slide];

  return (
    <section
      className={`relative w-full overflow-hidden bg-gradient-to-r ${current.gradient} transition-colors duration-700`}
      aria-label="Featured promotions"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
        <div className="text-5xl sm:text-6xl mb-4 animate-bounce">{current.emoji}</div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
          {current.title}
        </h1>
        <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto mb-6">
          {current.subtitle}
        </p>
        <a
          href="#products"
          className="inline-block px-8 py-3 bg-white text-gray-900 font-bold rounded-full shadow-lg hover:scale-105 transition-transform no-underline"
        >
          {current.cta}
        </a>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${i === slide ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
              }`}
          />
        ))}
      </div>
    </section>
  );
}

// Category quick-links row (Amazon-style tiles)
function CategoryTiles() {
  const { data: categories } = useFetchProducts(CATEGORIES_URL);

  if (!categories?.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10" aria-label="Shop by category">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Shop by Category</h2>
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-3">
        {categories.slice(0, 10).map((cat) => (
          <Link
            key={cat}
            to="/#products"
            className="group bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all no-underline"
          >
            <div className="w-12 h-12 rounded-full bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center text-xl">
              {catEmoji(cat)}
            </div>
            <span className="text-xs font-semibold text-gray-700 text-center capitalize leading-tight">
              {cat.replace(/-/g, " ")}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function catEmoji(cat = "") {
  const map = {
    smartphones: "📱", laptops: "💻", fragrances: "🌸", skincare: "🧴",
    groceries: "🛒", "home-decoration": "🏠", furniture: "🛋️", tops: "👕",
    "womens-dresses": "👗", "womens-shoes": "👠", "mens-shirts": "👔",
    "mens-shoes": "👟", "mens-watches": "⌚", "womens-watches": "⌚",
    "womens-bags": "👜", "womens-jewellery": "💎", sunglasses: "🕶️",
    automotive: "🚗", motorcycle: "🏍️", lighting: "💡",
  };
  return map[cat] || "🏷️";
}

// Horizontal scroll row of top-rated deals
function DealsRow({ products }) {
  const deals = useMemo(
    () => [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10),
    [products]
  );

  if (deals.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12" aria-label="Top deals">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🔥 Today's Top Deals</h2>
          <p className="text-sm text-gray-500">Highest rated products customers love</p>
        </div>
        <a href="#products" className="text-sm font-semibold text-purple-600 hover:text-purple-700 no-underline">
          View all →
        </a>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
        {deals.map((p) => (
          <Link
            key={p.id}
            to={`/product/${p.id}`}
            className="snap-start shrink-0 w-40 sm:w-48 bg-white border border-gray-200 rounded-xl p-3 flex flex-col items-center gap-2 hover:shadow-lg transition-shadow no-underline group"
          >
            <div className="w-full h-28 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src={p.thumbnail}
                alt={p.title}
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                loading="lazy"
              />
            </div>
            <span className="text-xs font-semibold text-gray-800 line-clamp-2 text-center leading-tight">
              {p.title}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-purple-600">${Number(p.price).toFixed(2)}</span>
              <span className="text-[10px] font-bold text-amber-700">★ {Number(p.rating).toFixed(1)}</span>
            </div>
            {p.discountPercentage > 0 && (
              <span className="text-[10px] font-bold text-white bg-rose-500 px-2 py-0.5 rounded-full">
                {Math.round(p.discountPercentage)}% OFF
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}

//  Home page with hero carousel + categories + deals row + full product grid
export function Home() {
  // One shared fetch for the deals row, the grid below uses the same hook (React caches nothing,
  // so we pass data down instead of fetching twice)
  const { data, loading, error } = useFetchProducts(PRODUCTS_URL);
  const products = data?.products || [];

  return (
    <div className="w-full">
      <HeroCarousel />
      <CategoryTiles />

      {loading && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="h-7 w-56 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="shrink-0 w-40 sm:w-48 bg-white border border-gray-200 rounded-xl p-3 animate-pulse">
                <div className="w-full h-28 bg-gray-200 rounded-lg mb-2" />
                <div className="h-3 bg-gray-100 rounded mb-2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        </section>
      )}

      {!loading && !error && <DealsRow products={products} />}

      {/* Full product grid with search + category filter (scroll target for hero CTA) */}
      <ProductList products={products} />

      {/* Trust badges footer strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "🚚", title: "Free & Fast Delivery", text: "On orders over $50" },
            { icon: "↩️", title: "Easy 30-Day Returns", text: "No questions asked" },
            { icon: "🔒", title: "Secure Payment", text: "100% protected checkout" },
          ].map((b) => (
            <div key={b.title} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
              <span className="text-3xl">{b.icon}</span>
              <div>
                <div className="font-bold text-gray-900 text-sm">{b.title}</div>
                <div className="text-gray-500 text-xs">{b.text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
