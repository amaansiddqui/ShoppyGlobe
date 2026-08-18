
import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { selectCartTotalCount } from "../redux/cartSlice";
import { selectSearchQuery, setSearchQuery } from "../redux/searchSlice";

// Header component displays the navigation bar with logo, search input, and cart icon
export function Header({ cartCount: propCartCount }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const reduxCartCount = useSelector(selectCartTotalCount);
  const searchQuery = useSelector(selectSearchQuery);

  const cartCount = propCartCount !== undefined && propCartCount > 0 ? propCartCount : reduxCartCount;

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
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
            <span className="text-gray-900 font-extrabold text-xl sm:text-2xl">ShoppyGlobe</span>
          </Link>
        </div>

        {/* Search Input in Header (Desktop / Tablet) */}
        <div className="flex-1 max-w-md mx-2 sm:mx-4 hidden sm:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products in ShoppyGlobe..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full pl-10 pr-8 py-2 text-sm bg-gray-100 border border-transparent rounded-full focus:outline-none focus:bg-white focus:border-purple-500 transition-all text-gray-900"
            />
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold bg-gray-200 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
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

        <div className="flex items-center gap-2">
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

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-purple-600 rounded-lg focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-3">
          <div className="relative mb-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full pl-9 pr-8 py-2 text-sm bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-purple-500 text-gray-900"
            />
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-700 hover:text-purple-600 font-semibold text-base py-1"
          >
            Home
          </Link>
          <a
            href="/#products"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-600 hover:text-purple-600 font-medium text-base py-1"
          >
            Products
          </a>
          <Link
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-600 hover:text-purple-600 font-medium text-base py-1"
          >
            Cart
          </Link>
        </div>
      )}
    </header>
  );
}

Header.propTypes = {
  cartCount: PropTypes.number,
};

export default Header;