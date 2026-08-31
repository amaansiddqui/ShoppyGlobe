import mongoose from "mongoose";
import Product from "../models/Product.js";

/**
 * Central API error class — controllers/middleware throw this and the
 * global error handler in server.js converts it into a JSON response.
 */
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Wraps async route handlers so thrown errors / rejected promises
 * are forwarded to Express's global error handler automatically.
 * No more missing try/catch on any route.
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/** Validate that a route param is a well-formed MongoDB ObjectId. */
export function validateObjectIdParam(param = "id") {
  return (req, res, next) => {
    const value = req.params[param];
    if (!value || !mongoose.isValidObjectId(value)) {
      return next(new ApiError(400, `Invalid ${param} format`));
    }
    next();
  };
}

/** Validate body for creating a product (POST /api/products). */
export function validateProductBody(req, res, next) {
  const { title, price } = req.body || {};

  if (!title || typeof title !== "string" || !title.trim()) {
    return next(new ApiError(400, "Title is required and must be a non-empty string"));
  }
  const numPrice = Number(price);
  if (price === undefined || Number.isNaN(numPrice) || numPrice < 0) {
    return next(new ApiError(400, "Price must be a non-negative number"));
  }

  const { stock } = req.body;
  if (stock !== undefined && (!Number.isInteger(Number(stock)) || Number(stock) < 0)) {
    return next(new ApiError(400, "Stock must be a non-negative integer"));
  }

  next();
}

/** Validate body for updating a product (PUT /api/products/:id) — partial. */
export function validateProductUpdateBody(req, res, next) {
  const updates = req.body || {};
  const allowed = [
    "title", "description", "price", "discountPercentage", "rating",
    "stock", "brand", "category", "thumbnail", "images",
  ];
  const keys = Object.keys(updates);

  if (keys.length === 0) {
    return next(new ApiError(400, "Request body must contain at least one field to update"));
  }
  if (keys.some((k) => !allowed.includes(k))) {
    return next(new ApiError(400, `Unknown or protected field(s): ${keys.filter((k) => !allowed.includes(k)).join(", ")}`));
  }
  if (updates.title !== undefined && (!String(updates.title).trim())) {
    return next(new ApiError(400, "Title must be a non-empty string"));
  }
  if (updates.price !== undefined && (Number.isNaN(Number(updates.price)) || Number(updates.price) < 0)) {
    return next(new ApiError(400, "Price must be a non-negative number"));
  }
  if (updates.stock !== undefined && (!Number.isInteger(Number(updates.stock)) || Number(updates.stock) < 0)) {
    return next(new ApiError(400, "Stock must be a non-negative integer"));
  }

  next();
}

/**
 * Validate body for adding to cart (POST /api/cart):
 *  - productId must be a valid ObjectId AND must exist in the products collection
 *  - quantity must be a positive integer (and not exceed available stock)
 */
export async function validateCartItemBody(req, res, next) {
  const { productId, quantity = 1 } = req.body || {};

  if (!productId || !mongoose.isValidObjectId(productId)) {
    return next(new ApiError(400, "A valid productId is required"));
  }
  const qty = parseInt(quantity, 10);
  if (!Number.isInteger(qty) || qty < 1) {
    return next(new ApiError(400, "Quantity must be a positive integer"));
  }

  // Check the product actually exists before allowing it into the cart
  const product = await Product.findById(productId).lean();
  if (!product) {
    return next(new ApiError(404, "Product not found"));
  }
  if (product.stock !== undefined && product.stock < qty) {
    return next(new ApiError(409, `Insufficient stock: only ${product.stock} left`));
  }
// pass along for the controller
  req.product = product; 
  next();
}

/** Validate body for updating a cart item (PUT /api/cart/:productId). */
export function validateQuantityBody(req, res, next) {
  const { quantity } = req.body || {};
  const qty = parseInt(quantity, 10);
  if (!Number.isInteger(qty) || qty < 1) {
    return next(new ApiError(400, "Quantity must be a positive integer"));
  }
  next();
}
