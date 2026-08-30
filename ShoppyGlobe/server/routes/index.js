import { Router } from "express";
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

const router = Router();

// Product routes
router.get("/products", getProducts);                    // GET /api/products — list products
router.get("/products/category-list", getCategoryList);  // GET /api/products/category-list
router.get("/products/:id", getProductById);             // GET /api/products/:id — single product
router.post("/products", createProduct);                 // POST /api/products — create product
router.put("/products/:id", updateProduct);              // PUT /api/products/:id — update product
router.delete("/products/:id", deleteProduct);           // DELETE /api/products/:id — delete product

// Cart routes
router.get("/cart", getCart);                            // GET /api/cart — view cart (bonus)
router.post("/cart", addToCart);                         // POST /api/cart — add product to cart
router.put("/cart/:productId", updateCartItem);          // PUT /api/cart/:productId — update quantity
router.delete("/cart/:productId", removeCartItem);       // DELETE /api/cart/:productId — remove item

export default router;
