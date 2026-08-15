import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import CartItem from "./CartItem";

export function Cart({
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) {
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full" id="cart">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center tracking-tight">
          Your Shopping Cart
        </h2>
        <div className="flex flex-col items-center justify-center p-12 bg-white border-2 border-dashed border-gray-200 rounded-2xl text-center">
          <svg
            className="w-16 h-16 text-gray-400 mb-4 stroke-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <p className="text-lg text-gray-600 mb-6 font-medium">
            Your cart is currently empty.
          </p>
          <a
            href="#products"
            className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-sm transition-colors decoration-none"
          >
            Browse Products
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full" id="cart">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center tracking-tight">
        Your Shopping Cart ({totalItems})
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
            />
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 h-fit text-left shadow-xs">
          <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
            Order Summary
          </h3>
          <div className="flex justify-between text-sm text-gray-600 mb-3">
            <span>Subtotal ({totalItems} items)</span>
            <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-3">
            <span>Estimated Shipping</span>
            <span className="text-emerald-600 font-semibold">Free</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 pt-4 border-t border-gray-100 mt-4">
            <span>Total</span>
            <span className="text-purple-600">${subtotal.toFixed(2)}</span>
          </div>
          <Link
            to="/checkout"
            className="block w-full text-center mt-6 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-sm transition-colors active:scale-98 no-underline"
          >
            Proceed to Checkout
          </Link>
          {onClearCart && (
            <button
              className="w-full mt-3 py-2 px-4 bg-transparent hover:bg-rose-50 text-rose-600 border border-rose-200 font-semibold rounded-lg transition-colors"
              onClick={onClearCart}
            >
              Clear Cart
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

Cart.propTypes = {
  cartItems: PropTypes.arrayOf(PropTypes.object),
  onUpdateQuantity: PropTypes.func,
  onRemoveItem: PropTypes.func,
  onClearCart: PropTypes.func,
};

export default Cart;
