import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import ProductItem from "./ProductItem";
import { useFetchProducts } from "../hooks/useFetchProducts";
import { selectSearchQuery, setSearchQuery } from "../redux/searchSlice";

// Exact API endpoint from the problem statement — returns ALL products.
// Now served by YOUR Express + MongoDB backend (proxied by Vite in dev).
const PRODUCTS_URL = "/api/products?limit=100";
const EMPTY_PRODUCTS = [];

// Skeleton card shown while products are loading (better perceived UX)
function ProductSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="flex justify-between pt-2">
          <div className="h-5 bg-gray-200 rounded w-16" />
          <div className="h-5 bg-gray-200 rounded w-10" />
        </div>
        <div className="h-10 bg-gray-200 rounded-lg w-full mt-2" />
      </div>
    </div>
  );
}

// product list component that displays a grid of products with search functionality
export function ProductList({
  products: propsProducts,
  loading: propsLoading,
  error: propsError,
  onRetry,
  selectedCategory,
  onCategoryChange,
  onAddToCart,
}) {
  const dispatch = useDispatch();
  const searchQuery = useSelector(selectSearchQuery);
  const [internalCategory, setInternalCategory] = useState("all");
  const hasProvidedProducts = propsProducts !== undefined;

  const {
    data,
    loading: fetchedLoading,
    error: fetchedError,
    refetch,
  } = useFetchProducts(
    hasProvidedProducts ? null : PRODUCTS_URL
  );

  const products = hasProvidedProducts
    ? propsProducts
    : data?.products || data || EMPTY_PRODUCTS;
  const loading = hasProvidedProducts ? Boolean(propsLoading) : fetchedLoading;
  const error = hasProvidedProducts ? propsError : fetchedError;
  const activeCategory = selectedCategory ?? internalCategory;
  const setActiveCategory = onCategoryChange ?? setInternalCategory;
  const retry = onRetry ?? refetch;

  // Derive category list from the fetched products
  const categories = useMemo(() => {
    const unique = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return unique.sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (activeCategory !== "all" && product.category !== activeCategory) return false;
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase().trim();
      const titleMatch = product.title?.toLowerCase().includes(query);
      const descMatch = product.description?.toLowerCase().includes(query);
      const catMatch = product.category?.toLowerCase().includes(query);
      return titleMatch || descMatch || catMatch;
    });
  }, [products, searchQuery, activeCategory]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full" id="products">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight capitalize">
            {activeCategory === "all" ? "All Products" : activeCategory.replace(/-/g, " ")}
          </h2>
          {!loading && !error && (
            <p className="text-sm text-gray-500 mt-1">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} available
            </p>
          )}
        </div>

        {/* Search Input Bar (Redux state) */}
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="Search products by title or description..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent shadow-xs transition-all text-gray-900"
            aria-label="Search products"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => dispatch(setSearchQuery(""))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold bg-gray-100 hover:bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }, (_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}
      {error && (
        <div className="text-center mb-6 text-rose-700 bg-rose-50 p-4 rounded-lg border border-rose-200 text-sm flex flex-col items-center gap-3">
          <span>⚠️ Failed to load products: {error}</span>
          <button
          onClick={retry}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Category filter pills */}
      {!loading && !error && categories.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {["all", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-purple-400 hover:text-purple-600"
              }`}
            >
              {cat === "all" ? "All" : cat.replace(/-/g, " ")}
            </button>
          ))}
        </div>
      )}

      {searchQuery && (
        <div className="mb-4 text-sm text-gray-600">
          Showing results for <span className="font-semibold text-purple-700">"{searchQuery}"</span> ({filteredProducts.length} found)
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 text-base font-medium mb-4">
            {searchQuery
              ? `No products match your search query "${searchQuery}".`
              : "No products are available in this category."}
          </p>
          <button
            onClick={() => {
              dispatch(setSearchQuery(""));
              setActiveCategory("all");
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors"
          >
            Show all products
          </button>
        </div>
      ) : !loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductItem
            key={product.id || product._id}
              product={product}
              onAddToCart={onAddToCart}
              mongoId={product._id}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// PropTypes validation for the ProductList component

ProductList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  error: PropTypes.string,
  onRetry: PropTypes.func,
  selectedCategory: PropTypes.string,
  onCategoryChange: PropTypes.func,
  onAddToCart: PropTypes.func,
};

export default ProductList;
