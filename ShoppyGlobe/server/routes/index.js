import { Router } from "express";

const router = Router();
import {
  getProducts,
  getProductById,
  getCategoryList,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import {
  addToCart,
  updateCartItem,
  removeCartItem,
  getCart,
} from "../controllers/cartController.js";
import { register, login, requireAuth } from "../controllers/authController.js";
import {
  asyncHandler,
  validateObjectIdParam,
  validateProductBody,
  validateProductUpdateBody,
  validateCartItemBody,
  validateQuantityBody,
} from "../middleware/validate.js";

// Auth routes
router.post("/register", asyncHandler(register));  // POST /api/register — create account, returns JWT
router.post("/login", asyncHandler(login));        // POST /api/login — authenticate, returns JWT

// Product routes — every handler is wrapped and validated before hitting the controller
router.get("/products", asyncHandler(getProducts));                    // GET /api/products — list products
router.get("/products/category-list", asyncHandler(getCategoryList));  // GET /api/products/category-list
router.post("/products", validateProductBody, asyncHandler(createProduct)); // POST /api/products — create product
router.get(
  "/products/:id",
  validateObjectIdParam("id"),
  asyncHandler(getProductById)                                         // GET /api/products/:id — single product
);
router.put(
  "/products/:id",
  validateObjectIdParam("id"),
  validateProductUpdateBody,
  asyncHandler(updateProduct)                                          // PUT /api/products/:id — update product
);
router.delete(
  "/products/:id",
  validateObjectIdParam("id"),
  asyncHandler(deleteProduct)                                          // DELETE /api/products/:id — delete product
);

// Cart routes — PROTECTED: only logged-in users with a valid JWT can access
router.get("/cart", requireAuth, asyncHandler(getCart));                            // GET /api/cart — view cart
router.post("/cart", requireAuth, validateCartItemBody, asyncHandler(addToCart));  // POST /api/cart — add product to cart
router.put(
  "/cart/:productId",
  requireAuth,
  validateObjectIdParam("productId"),
  validateQuantityBody,
  asyncHandler(updateCartItem)                                         // PUT /api/cart/:productId — update quantity
);
router.delete(
  "/cart/:productId",
  requireAuth,
  validateObjectIdParam("productId"),
  asyncHandler(removeCartItem)                                         // DELETE /api/cart/:productId — remove item
);

export default router;
