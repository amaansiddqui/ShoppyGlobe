import PropTypes from "prop-types";
import ProductItem from "./ProductItem";
import { useFetchProducts } from "../hooks/useFetchProducts";

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

export function ProductList({ products: propsProducts, onAddToCart }) {
  const { data, loading: fetchLoading, error: fetchError } = useFetchProducts(
    "https://dummyjson.com/products/category/mens-shirts"
  );

  const products =
    propsProducts && propsProducts.length > 0
      ? propsProducts
      : data?.products || MOCK_PRODUCTS;

  const loading = propsProducts && propsProducts.length > 0 ? false : fetchLoading;
  const error = propsProducts && propsProducts.length > 0 ? null : fetchError;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full" id="products">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center tracking-tight">
        Boys Garments & Apparel
      </h2>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
}

ProductList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object),
  onAddToCart: PropTypes.func,
};

export default ProductList;
