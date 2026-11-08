import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useFetchProducts } from "../hooks/useFetchProducts";
import ProductList from "./ProductList";

// Slide images MUST be imported so Vite bundles them and generates correct URLs.
// A runtime string like "./assets/slide1.jpg" is not resolved by Vite.
import slide1 from "../assets/Silder 1.jpg";
import slide2 from "../assets/Slider 2.jpg";
import slide3 from "../assets/Slider 3.jpg";

const PRODUCTS_URL = "/api/products?limit=100";
const EMPTY_PRODUCTS = [];

// Hero slides. Images live in /public and are referenced with an ABSOLUTE path
// ("/slide1.jpg") — relative "./assets/..." paths break on nested routes.
// gradient is the fallback background shown while the image loads (or if it's missing).
const HERO_SLIDES = [
  {
    title: "Everything You Love, One Store",
    subtitle: "Thousands of products, delivered to your door. Free returns within 30 days.",
    cta: "Shop All Products",
    img: slide1,
    gradient: "from-gray-800 to-gray-900",
    emoji: "🛍️",
  },
  {
    title: "Big Savings, Every Day",
    subtitle: "Up to 40% off on top-rated picks across fashion, beauty, home and more.",
    cta: "See Top Deals",
    img: slide2,
    gradient: "from-teal-500 to-cyan-700",
    emoji: "🔥",
  },
  {
    title: "New Arrivals Weekly",
    subtitle: "Discover the latest gadgets, fragrances and essentials before anyone else.",
    cta: "Explore Categories",
    img: slide3,
    gradient: "from-gray-900 to-cyan-900",
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
      <img
        key={slide}
        src={current.img}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-60 animate-[fade-in_0.8s_ease-out]"
        loading="eager"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/25 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="max-w-2xl text-left sm:text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm mb-4">
            <span>{current.emoji}</span>
            Fresh arrivals
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-3 drop-shadow-md">
            {current.title}
          </h1>
          <p className="text-white/90 text-base sm:text-lg max-w-xl mb-6 drop-shadow">
            {current.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <a
              href="#products"
              className="inline-block px-8 py-3 bg-white text-gray-900 font-bold rounded-full shadow-lg hover:scale-[1.02] transition-transform no-underline"
            >
              {current.cta}
            </a>
            <span className="rounded-full border border-white/30 bg-black/15 px-3 py-2 text-sm font-medium text-white/90 backdrop-blur-sm">
              Free shipping over $50
            </span>
          </div>
        </div>
      </div>

      <div className="absolute right-4 top-6 sm:right-10 sm:top-8 hidden md:flex flex-col gap-3">
        {[
          { label: "Curated picks", value: "2.5k+" },
          { label: "Happy shoppers", value: "98%" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-left shadow-lg backdrop-blur-sm">
            <div className="text-xl font-extrabold text-white">{stat.value}</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/70">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2.5 rounded-full cursor-pointer transition-all ${i === slide ? "w-6 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"}`}
          />
        ))}
      </div>
    </section>
  );
}

// Category quick-links row (Amazon-style tiles)
function CategoryTiles({ categories, activeCategory, onSelectCategory }) {
  if (!categories?.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10" aria-label="Shop by category">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">Browse</p>
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
        </div>
        <span className="hidden sm:inline-flex rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
          Trending now
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-3">
        {categories.slice(0, 10).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              onSelectCategory(cat);
              document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
            }}
            aria-pressed={activeCategory === cat}
            className={`group rounded-2xl border p-3 flex flex-col items-center gap-2 text-center transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-lg ${
              activeCategory === cat
                ? "border-purple-500 bg-purple-50 ring-2 ring-purple-100 shadow-md"
                : "border-gray-200 bg-white hover:border-purple-200"
            }`}
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-full text-xl shadow-sm transition-colors ${
              activeCategory === cat ? "bg-purple-600 text-white" : "bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 group-hover:from-purple-200 group-hover:to-pink-200"
            }`}>
              {catEmoji(cat)}
            </div>
            <span className="text-xs font-semibold text-gray-700 capitalize leading-tight">
              {cat.replace(/-/g, " ")}
            </span>
          </button>
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
      <div className="rounded-[28px] border border-purple-100 bg-gradient-to-br from-white via-violet-50 to-fuchsia-50 p-5 sm:p-6 shadow-sm">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">Hot picks</p>
            <h2 className="text-2xl font-bold text-gray-900">🔥 Today's Top Deals</h2>
          </div>
          <a href="#products" className="text-sm font-semibold text-purple-600 hover:text-purple-700 no-underline">
            View all →
          </a>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
          {deals.map((p) => (
            <Link
              key={p._id || p.id}
              to={`/product/${p._id || p.id}`}
              className="group snap-start shrink-0 w-40 sm:w-48 rounded-2xl border border-gray-200 bg-white p-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl no-underline"
            >
              <div className="relative mb-3 flex h-28 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-slate-100">
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                />
                {p.discountPercentage > 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    {Math.round(p.discountPercentage)}% OFF
                  </span>
                )}
              </div>
              <span className="block text-xs font-semibold text-gray-800 line-clamp-2 text-left leading-tight min-h-[2.5rem]">
                {p.title}
              </span>
              <div className="mt-3 flex items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-bold text-purple-600">${Number(p.price).toFixed(2)}</div>
                  <div className="text-[10px] font-bold text-amber-700">★ {Number(p.rating).toFixed(1)}</div>
                </div>
                <span className="rounded-full bg-purple-50 px-2 py-1 text-[10px] font-bold text-purple-700">
                  Save
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

//  Home page with hero carousel + categories + deals row + full product grid
export function Home() {
  const { data, loading, error, refetch } = useFetchProducts(PRODUCTS_URL);
  const [activeCategory, setActiveCategory] = useState("all");
  const products = data?.products || EMPTY_PRODUCTS;
  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category).filter(Boolean))].sort(),
    [products]
  );

  return (
    <div className="w-full">
      <HeroCarousel />
      <CategoryTiles
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

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
      <ProductList
        products={products}
        loading={loading}
        error={error}
        onRetry={refetch}
        selectedCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Trust badges footer strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "🚚", title: "Free & Fast Delivery", text: "On orders over $50", accent: "from-emerald-500 to-teal-500" },
            { icon: "↩️", title: "Easy 30-Day Returns", text: "No questions asked", accent: "from-amber-400 to-orange-500" },
            { icon: "🔒", title: "Secure Payment", text: "100% protected checkout", accent: "from-violet-500 to-purple-600" },
          ].map((b) => (
            <div key={b.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${b.accent} text-2xl shadow-sm`}>
                  {b.icon}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">{b.title}</div>
                  <div className="text-gray-500 text-xs">{b.text}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
