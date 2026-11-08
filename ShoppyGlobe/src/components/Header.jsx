import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { selectCartTotalCount } from "../redux/cartSlice";
import { selectIsLoggedIn, selectAuthUser, logout } from "../redux/authSlice";
import { selectSearchQuery, setSearchQuery } from "../redux/searchSlice";

// Shared nav items so desktop nav + mobile drawer stay in sync automatically
const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/cart", label: "Cart" },
];

// Header component displays the navigation bar with logo, search input, and cart icon
export function Header({ cartCount: propCartCount }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const reduxCartCount = useSelector(selectCartTotalCount);
  const searchQuery = useSelector(selectSearchQuery);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const authUser = useSelector(selectAuthUser);

  // Previous cart count — used to detect change and re-trigger the badge "pop" animation
  const prevCountRef = useRef(reduxCartCount);
  const [badgeKey, setBadgeKey] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (reduxCartCount !== prevCountRef.current) {
      prevCountRef.current = reduxCartCount;
      setBadgeKey((k) => k + 1); // remount badge → animation replays on every change
    }
  }, [reduxCartCount]);

  // Elevation shadow once the user scrolls (sticky header feels "lifted")
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setMobileMenuOpen(false);
    navigate("/");
  };

  const cartCount = propCartCount !== undefined && propCartCount > 0 ? propCartCount : reduxCartCount;

  const isActive = (to) => location.pathname === to;

  const desktopLinkClass = (to) =>
    `relative font-medium text-base transition-colors duration-200 group ${isActive(to) ? "text-purple-600 font-semibold" : "text-gray-600 hover:text-purple-600"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white border-b border-gray-200 transition-shadow duration-300 ${scrolled ? "shadow-md" : "shadow-xs"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-bold text-xl tracking-tight no-underline transition-transform duration-200 hover:scale-[1.03] active:scale-95"
          >
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
              className="w-full pl-10 pr-8 py-2 text-sm bg-gray-100 border border-transparent rounded-full focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all text-gray-900"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold bg-gray-200 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer transition-colors"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Desktop nav — active route highlighted with animated underline */}
        <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
          {NAV_ITEMS.map(({ to, label }) => (
            <Link key={to} to={to} className={desktopLinkClass(to)}>
              {label}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-purple-600 rounded-full transition-all duration-300 ${isActive(to) ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                  }`}
              ></span>
            </Link>
          ))}
          <a
            href="/#about"
            className="text-gray-600 hover:text-purple-600 font-medium text-base transition-colors group relative"
          >
            About
            <span className="absolute -bottom-1 left-0 h-0.5 bg-purple-600 rounded-full w-0 opacity-0 transition-all duration-300 group-hover:w-full group-hover:opacity-100"></span>
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            className="relative p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all active:scale-90"
            aria-label={`Shopping Cart (${cartCount} items)`}
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
            {cartCount > 0 && (
              <span
                key={badgeKey}
                className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-badge-pop"
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* Auth: Login button or user menu with logout */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 bg-black-50 border border-purple-100 px-2.5 py-1.5 rounded-full">
                <span className="w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center uppercase">
                  {authUser?.username?.charAt(0) || "U"}
                </span>
                {authUser?.username}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm font-semibold text-gray-600 hover:text-rose-600 border border-gray-200 hover:border-rose-200 hover:bg-rose-50 rounded-lg transition-all cursor-pointer active:scale-95"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              state={{ from: location.pathname }}
              className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition-all no-underline hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg focus:outline-none transition-colors active:scale-90"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
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
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-1 animate-drawer-in shadow-lg">
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {NAV_ITEMS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between py-2.5 px-3 rounded-lg font-medium text-base transition-colors ${isActive(to)
                  ? "bg-purple-50 text-purple-600 font-semibold"
                  : "text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                }`}
            >
              {label}
              {isActive(to) && <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-nav-underline"></span>}
            </Link>
          ))}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="block w-full text-left text-rose-600 font-semibold text-base py-2.5 px-3 rounded-lg hover:bg-rose-50 cursor-pointer transition-colors"
            >
              Logout ({authUser?.username})
            </button>
          ) : (
            <Link
              to="/login"
              state={{ from: location.pathname }}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center text-white bg-purple-600 hover:bg-purple-700 font-semibold text-base py-2.5 px-3 rounded-lg no-underline transition-colors"
            >
              Login / Register
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

Header.propTypes = {
  cartCount: PropTypes.number,
};

export default Header;
