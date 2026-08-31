import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginUser, registerUser, clearAuthError, selectIsLoggedIn } from "../redux/authSlice";
import { fetchCart } from "../redux/cartSlice";

// Login / Register page — posts to the protected backend's JWT endpoints
export function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { loading, error, user } = useSelector((state) => state.auth);

  const [mode, setMode] = useState("login"); 
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  const redirectTo = location.state?.from || "/cart";

  useEffect(() => {
    if (isLoggedIn && user) {
      dispatch(fetchCart()); // load this user's protected cart
      navigate(redirectTo, { replace: true });
    }
  }, [isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => dispatch(clearAuthError()), []); // eslint-disable-line react-hooks/exhaustive-deps

  const validate = () => {
    const errs = {};
    if (mode === "register" && (!form.username || form.username.trim().length < 3)) {
      errs.username = "Username must be at least 3 characters";
    }
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = "Enter a valid email address";
    }
    if (!form.password || form.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (mode === "login") {
      dispatch(loginUser({ email: form.email, password: form.password }));
    } else {
      dispatch(registerUser({ username: form.username.trim(), email: form.email, password: form.password }));
    }
  };

  const setField = (name) => (e) => setForm({ ...form, [name]: e.target.value });

  const inputCls = (bad) =>
    `w-full px-4 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all text-gray-900 ${bad ? "border-rose-400" : "border-gray-300"
    }`;

  return (
    <section className="max-w-md mx-auto px-4 py-14 w-full">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {mode === "login"
            ? "Log in to access your shopping cart."
            : "Sign up to start adding products to your cart."}
        </p>

        {error && (
          <div className="mb-4 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-4 py-2.5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {mode === "register" && (
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="username">
                USERNAME
              </label>
              <input
                id="username"
                type="text"
                className={inputCls(fieldErrors.username)}
                value={form.username}
                onChange={setField("username")}
                placeholder="johndoe"
              />
              {fieldErrors.username && (
                <p className="text-xs text-rose-600 mt-1">{fieldErrors.username}</p>
              )}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="email">
              EMAIL
            </label>
            <input
              id="email"
              type="email"
              className={inputCls(fieldErrors.email)}
              value={form.email}
              onChange={setField("email")}
              placeholder="you@example.com"
            />
            {fieldErrors.email && <p className="text-xs text-rose-600 mt-1">{fieldErrors.email}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="password">
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              className={inputCls(fieldErrors.password)}
              value={form.password}
              onChange={setField("password")}
              placeholder="••••••••"
            />
            {fieldErrors.password && (
              <p className="text-xs text-rose-600 mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            {loading ? "Please wait..." : mode === "login" ? "Log In" : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-6">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => {
                  setMode("register");
                  dispatch(clearAuthError());
                }}
                className="text-purple-600 font-semibold hover:underline cursor-pointer"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setMode("login");
                  dispatch(clearAuthError());
                }}
                className="text-purple-600 font-semibold hover:underline cursor-pointer"
              >
                Log in
              </button>
            </>
          )}
        </p>
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">
        <Link to="/products" className="hover:text-purple-600">
          Continue browsing without an account →
        </Link>
      </p>
    </section>
  );
}

export default Login;
