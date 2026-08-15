import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";

export function Checkout({ cartItems = [], onClearCart }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "card",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setOrderPlaced(true);
      if (onClearCart) {
        onClearCart();
      }
      setIsSubmitting(false);

      setTimeout(() => {
        navigate("/");
      }, 2500);
    }, 800);
  };

  if (orderPlaced) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 max-w-lg w-full text-center shadow-lg">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full mb-6 font-extrabold text-3xl animate-bounce">
            ✓
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Order Placed!
          </h2>
          <p className="text-gray-600 text-base mb-6">
            Thank you for your purchase! Your order has been placed successfully.
          </p>
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-4 rounded-xl font-medium mb-6">
            Redirecting you to the Home page in a moment...
          </div>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-sm transition-colors text-center no-underline"
          >
            Go to Home Page Now
          </Link>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h2>
        <div className="bg-white border border-gray-200 rounded-2xl p-10 max-w-lg mx-auto shadow-xs">
          <p className="text-gray-600 mb-6 font-medium">
            Your cart is empty. Add products to your cart before checking out.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-sm transition-colors no-underline"
          >
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center tracking-tight">
        Checkout
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* User Details Form */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100">
            Shipping & Contact Details
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street, Apt 4B"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="New York"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Zip / Postal Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  required
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="10001"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                <label className={`flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer text-xs font-semibold transition-all ${formData.paymentMethod === 'card' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span>Credit Card</span>
                </label>

                <label className={`flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer text-xs font-semibold transition-all ${formData.paymentMethod === 'cod' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span>Cash on Delivery</span>
                </label>

                <label className={`flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer text-xs font-semibold transition-all ${formData.paymentMethod === 'upi' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span>UPI / Wallet</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 py-3.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-base rounded-xl shadow-md transition-colors disabled:opacity-50 cursor-pointer active:scale-98"
            >
              {isSubmitting ? "Processing Order..." : "Place Order"}
            </button>
          </form>
        </div>

        {/* Product & Price Summary */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 h-fit shadow-xs">
          <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100">
            Order Summary ({totalItems} items)
          </h3>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-1 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 shrink-0 bg-gray-50 rounded-lg border border-gray-100 p-1 flex items-center justify-center">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xs text-gray-400">N/A</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h4>
                    <span className="text-xs text-gray-500">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</span>
                  </div>
                </div>
                <div className="font-bold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-sm text-gray-600 pt-4 border-t border-gray-100">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-emerald-600 font-semibold">Free</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-100 mt-2">
              <span>Total Amount</span>
              <span className="text-purple-600 text-lg">${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

Checkout.propTypes = {
  cartItems: PropTypes.arrayOf(PropTypes.object),
  onClearCart: PropTypes.func,
};

export default Checkout;