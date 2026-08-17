import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

export function ProductItem({ product, onAddToCart }) {
  const [added, setAdded] = useState(false);
  const dispatch = useDispatch();

  if (!product) return null;
    // Destructure product properties with default values
  const {
    id,
    title = "Product Title",
    price = 0,
    description = "",
    thumbnail = "",
    rating = 0,
  } = product;

  // Handle adding the product to the cart and updating the added state for feedback
  const handleAddToCart = () => {
    dispatch(addToCart(product));
    if (onAddToCart) {
      onAddToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };


  // return the product item card with image, title, price, rating, and add to cart button
  return (
    <div
      className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
      id={`product-${id}`}
    >
      <Link to={`/product/${id}`} className="block w-full h-48 bg-gray-50 overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-contain p-4 transition-transform duration-300 hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
        )}
      </Link>
      <div className="p-5 flex flex-col flex-grow text-left">
        <Link to={`/product/${id}`} className="no-underline hover:text-purple-600 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{title}</h3>
        </Link>
        {description && (
          <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-2">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-purple-600">${Number(price).toFixed(2)}</span>
          {rating > 0 && (
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-md flex items-center gap-1">
              ★ {Number(rating).toFixed(1)}
            </span>
          )}
        </div>
        <button
          className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-95 ${
            added
              ? "bg-emerald-600 text-white"
              : "bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
          }`}
          // Disable the button if the product is already added to the cart
          onClick={handleAddToCart}
          aria-label={`Add ${title} to cart`}
        >
          {added ? "Added to Cart ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

// PropTypes validation for the ProductItem component

ProductItem.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string,
    price: PropTypes.number,
    description: PropTypes.string,
    thumbnail: PropTypes.string,
    rating: PropTypes.number,
  }),
  onAddToCart: PropTypes.func,
};

export default ProductItem;
