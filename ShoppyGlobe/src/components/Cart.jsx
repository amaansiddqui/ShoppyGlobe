import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import CartItem from "./CartItem";
import { selectCartItems, clearCart, fetchCart } from "../redux/cartSlice";
import { selectIsLoggedIn } from "../redux/authSlice";
import { useEffect } from "react";

export function Cart({
  cartItems: propCartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxCartItems = useSelector(selectCartItems);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  // Load the protected backend cart when the user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCart());
    }
  }, [isLoggedIn, dispatch]);

  const cartItems =
    propCartItems && propCartItems.length > 0 ? propCartItems : reduxCartItems;

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleClearCart = () => {
    dispatch(clearCart());
    if (onClearCart) {
      onClearCart();
    }
  };
  // PROTECTED: cart page requires login — the backend rejects unauthenticated cart access
  if (!isLoggedIn) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full" id="cart">
        <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">
          <div className="text-4xl mb-3">🔒</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Login required</h2>
          <p className="text-gray-600 text-sm mb-6">
            Your shopping cart is protected. Please log in to view and manage your cart.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/login", { state: { from: "/cart" } })}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Login / Register
            </button>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Browse Products
            </button>
          </div>
        </div>
      </section>
    );
  }

    // If the cart is empty, display a message and a link to browse products
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
          <button
              onClick={() => navigate("/products")}
            className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-sm transition-colors decoration-none"
            >
            Browse Products
          </button>
        </div>
      </section>
    );
  }
  //  return the cart items and order summary if the cart is not empty
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
          {(onClearCart || reduxCartItems.length > 0) && (
            <button
              className="w-full mt-3 py-2 px-4 bg-transparent hover:bg-rose-50 text-rose-600 border border-rose-200 font-semibold rounded-lg transition-colors cursor-pointer"
              onClick={handleClearCart}
            >
              Clear Cart
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

//  PropTypes validation for the Cart component
Cart.propTypes = {
  cartItems: PropTypes.arrayOf(PropTypes.object),
  onUpdateQuantity: PropTypes.func,
  onRemoveItem: PropTypes.func,
  onClearCart: PropTypes.func,
};

export default Cart;
