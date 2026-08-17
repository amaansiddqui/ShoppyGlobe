import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import ProductItem from "./ProductItem";
import { useFetchProducts } from "../hooks/useFetchProducts";
import { selectSearchQuery, setSearchQuery } from "../redux/searchSlice";


// Mock product data for demonstration purposes when API fetch fails or is unavailable
const MOCK_PRODUCTS = [
  {
    id: 83,
    title: "Boys Blue & Black Check Shirt",
    description: "Classic plaid check long-sleeve button-down shirt for boys. Soft, breathable cotton fabric for casual everyday wear.",
    price: 24.99,
    rating: 4.8,
    category: "boys-garments",
    thumbnail: "https://cdn.dummyjson.com/products/images/mens-shirts/Blue%20&%20Black%20Check%20Shirt/thumbnail.png"
  },
  {
    id: 84,
    title: "Boys Graphic Printed T-Shirt",
    description: "Casual crewneck cotton t-shirt for boys featuring vibrant graphic artwork. Lightweight and comfortable for all-day play.",
    price: 15.99,
    rating: 4.6,
    category: "boys-garments",
    thumbnail: "https://cdn.dummyjson.com/products/images/mens-shirts/Gigabyte%20Aorus%20Men%20Tshirt/thumbnail.png"
  },
  {
    id: 85,
    title: "Boys Casual Plaid Flannel Shirt",
    description: "Warm flannel plaid shirt with chest pockets and buttoned cuffs. Perfect for layering over t-shirts.",
    price: 28.50,
    rating: 4.7,
    category: "boys-garments",
    thumbnail: "https://cdn.dummyjson.com/products/images/mens-shirts/Man%20Plaid%20Shirt/thumbnail.png"
  },
  {
    id: 86,
    title: "Boys Short Sleeve Polo Shirt",
    description: "Smart casual short sleeve polo shirt with ribbed collar and button placket. Great for school and events.",
    price: 19.99,
    rating: 4.5,
    category: "boys-garments",
    thumbnail: "https://cdn.dummyjson.com/products/images/mens-shirts/Man%20Short%20Sleeve%20Shirt/thumbnail.png"
  },
  {
    id: 87,
    title: "Boys Checkered Casual Shirt",
    description: "Stylish red & navy checkered shirt for boys with turn-down collar and durable stitching.",
    price: 22.99,
    rating: 4.9,
    category: "boys-garments",
    thumbnail: "https://cdn.dummyjson.com/products/images/mens-shirts/Men%20Check%20Shirt/thumbnail.png"
  }
];

// product list component that displays a grid of products with search functionality
export function ProductList({ products: propsProducts, onAddToCart }) {
  const dispatch = useDispatch();
  const searchQuery = useSelector(selectSearchQuery);

  const { data, loading: fetchLoading, error: fetchError } = useFetchProducts(
    "https://dummyjson.com/products/category/mens-shirts"
  );

  // Determine the products to display based on props, fetched data, or mock data
  const products =
    propsProducts && propsProducts.length > 0
      ? propsProducts
      : data?.products || MOCK_PRODUCTS;

  const loading = propsProducts && propsProducts.length > 0 ? false : fetchLoading;
  const error = propsProducts && propsProducts.length > 0 ? null : fetchError;

  const filteredProducts = products.filter((product) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().trim();
    const titleMatch = product.title?.toLowerCase().includes(query);
    const descMatch = product.description?.toLowerCase().includes(query);
    const catMatch = product.category?.toLowerCase().includes(query);
    return titleMatch || descMatch || catMatch;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full" id="products">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          Boys Garments & Apparel
        </h2>

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
        <div className="text-center py-8 text-gray-500 font-medium animate-pulse">
          Loading products...
        </div>
      )}
      {error && (
        <div className="text-center mb-6 text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200 text-sm">
          Notice: Showing sample products ({error})
        </div>
      )}

      {searchQuery && (
        <div className="mb-4 text-sm text-gray-600">
          Showing results for <span className="font-semibold text-purple-700">"{searchQuery}"</span> ({filteredProducts.length} found)
        </div>
      )}

      {!loading && filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 text-base font-medium mb-4">
            No products match your search query "{searchQuery}".
          </p>
          <button
            onClick={() => dispatch(setSearchQuery(""))}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
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
  onAddToCart: PropTypes.func,
};

export default ProductList;
