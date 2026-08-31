import jwt from "jsonwebtoken";
import User from "../models/User.js";
import process from "process";
import { ApiError, asyncHandler } from "../middleware/validate.js";

// JWT_SECRET is loaded from .env (set a strong value in production)
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_TTL = process.env.JWT_EXPIRES_IN || "1d";

function signToken(user) {
  return jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
    expiresIn: TOKEN_TTL,
  });
}

/**
 * POST /api/register
 */
export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body || {};

  if (!username || !email || !password) {
    throw new ApiError(400, "username, email and password are required");
  }
  if (String(password).length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    throw new ApiError(409, "Username or email already registered");
  }

  const user = await User.create({ username, email, password });

  res.status(201).json({
    message: "User registered successfully",
    token: signToken(user),
    user: { id: user._id, username: user.username, email: user.email },
  });
});

/**
 * POST /api/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body || {};

  if ((!email && !username) || !password) {
    throw new ApiError(400, "email/username and password are required");
  }

  const user = await User.findOne(email ? { email } : { username }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    // Same message for both cases — don't reveal which field was wrong
    throw new ApiError(401, "Invalid credentials");
  }

  res.json({
    message: "Login successful",
    token: signToken(user),
    user: { id: user._id, username: user.username, email: user.email },
  });
});

/**
 * Authorization middleware — protects routes.
 */
export const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    throw new ApiError(401, "Authentication required: provide a Bearer token");
  }

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new ApiError(401, err.name === "TokenExpiredError" ? "Token expired" : "Invalid token");
  }

  const user = await User.findById(payload.id);
  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }

  req.user = { id: user._id.toString(), username: user.username };
  next();
});
