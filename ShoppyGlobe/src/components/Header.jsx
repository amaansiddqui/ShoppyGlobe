
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export function Header({ cartCount = 0 }) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-bold text-xl tracking-tight no-underline">
            <svg
              className="w-7 h-7 stroke-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className="text-gray-900 font-extrabold text-2xl">ShoppyGlobe</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
          <Link to="/" className="text-purple-600 font-semibold text-base transition-colors hover:text-purple-700">
            Home
          </Link>
          <a href="/#products" className="text-gray-600 hover:text-purple-600 font-medium text-base transition-colors">
            Products
          </a>
          <Link to="/cart" className="text-gray-600 hover:text-purple-600 font-medium text-base transition-colors">
            Cart
          </Link>
          <a href="/#about" className="text-gray-600 hover:text-purple-600 font-medium text-base transition-colors">
            About
          </a>
        </nav>

        <div className="flex items-center">
          <Link
            to="/cart"
            className="relative p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all"
            aria-label="Shopping Cart"
          >
            <svg
              className="w-6 h-6 stroke-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  cartCount: PropTypes.number,
};

export default Header;