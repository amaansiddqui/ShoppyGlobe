import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { updateQuantity, removeFromCart } from "../redux/cartSlice";

export function CartItem({ item, onUpdateQuantity, onRemoveItem }) {
  const dispatch = useDispatch();

  if (!item) return null;

  const { id, title = "Item", price = 0, thumbnail = "", quantity = 1 } = item;
  const itemTotal = price * quantity;

  const handleDecrease = () => {
    if (quantity > 1) {
      dispatch(updateQuantity({ id, quantity: quantity - 1 }));
      if (onUpdateQuantity) {
        onUpdateQuantity(id, quantity - 1);
      }
    }
  };

  const handleIncrease = () => {
    dispatch(updateQuantity({ id, quantity: quantity + 1 }));
    if (onUpdateQuantity) {
      onUpdateQuantity(id, quantity + 1);
    }
  };

  const handleRemove = () => {
    dispatch(removeFromCart(id));
    if (onRemoveItem) {
      onRemoveItem(id);
    }
  };

  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-xl mb-3 shadow-xs hover:shadow-md transition-shadow duration-200"
      id={`cart-item-${id}`}
    >
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="w-20 h-20 shrink-0 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
          {thumbnail ? (
            <img src={thumbnail} alt={title} className="w-full h-full object-contain p-1" loading="lazy" decoding="async" />
          ) : (
            <div className="text-gray-400 text-xs">No Image</div>
          )}
        </div>

        <div className="flex flex-col text-left">
          <h4 className="text-base font-semibold text-gray-900">{title}</h4>
          <span className="text-sm font-medium text-purple-600">
            ${Number(price).toFixed(2)} each
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
          <button
            className="w-8 h-8 flex items-center justify-center text-lg font-bold text-gray-700 hover:bg-purple-50 hover:text-purple-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-700 transition-colors"
            onClick={handleDecrease}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="w-10 text-center text-sm font-bold text-gray-900">
            {quantity}
          </span>
          <button
            className="w-8 h-8 flex items-center justify-center text-lg font-bold text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
            onClick={handleIncrease}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <div className="text-base font-bold text-gray-900 min-w-20 text-right">
          ${itemTotal.toFixed(2)}
        </div>

        <button
          className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          onClick={handleRemove}
          aria-label={`Remove ${title} from cart`}
          title="Remove Item"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string,
    price: PropTypes.number,
    thumbnail: PropTypes.string,
    quantity: PropTypes.number,
  }),
  onUpdateQuantity: PropTypes.func,
  onRemoveItem: PropTypes.func,
};

export default CartItem;
