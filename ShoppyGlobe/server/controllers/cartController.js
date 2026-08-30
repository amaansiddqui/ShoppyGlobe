import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

function isValidId(id) {
  return mongoose.isValidObjectId(id);
}

// get (or lazily create) the current user's cart, with products populated
async function getPopulatedCart(userId = "guest") {
  let cart = await Cart.findOne({ userId }).populate("items.product");
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
    cart = await Cart.findById(cart._id).populate("items.product");
  }
  return cart;
}

/**
 * POST /api/cart
 * Add a product to the shopping cart.
 */
export async function addToCart(req, res) {
  try {
    const { productId, quantity = 1 } = req.body;
    const qty = parseInt(quantity);

    if (!isValidId(productId)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }
    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ message: "Quantity must be a positive integer" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const userId = req.body.userId || "guest";
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = await Cart.create({ userId, items: [] });

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();
    const populated = await getPopulatedCart(userId);

    res.status(201).json({ message: "Product added to cart", cart: populated });
  } catch (err) {
    res.status(500).json({ message: "Failed to add to cart", error: err.message });
  }
}

/**
 * PUT /api/cart/:productId
 * Update the quantity of a product in the cart.
 */
export async function updateCartItem(req, res) {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const qty = parseInt(quantity);

    if (!isValidId(productId)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }
    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ message: "Quantity must be a positive integer" });
    }

    const userId = req.body.userId || "guest";
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    item.quantity = qty;
    await cart.save();
    const populated = await getPopulatedCart(userId);

    res.json({ message: "Cart updated", cart: populated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update cart", error: err.message });
  }
}

/**
 * DELETE /api/cart/:productId
 * Remove a product from the cart.
 */
export async function removeCartItem(req, res) {
  try {
    const { productId } = req.params;

    if (!isValidId(productId)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const userId = req.query.userId || "guest";
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const before = cart.items.length;
    cart.items = cart.items.filter((i) => i.product.toString() !== productId);

    if (cart.items.length === before) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    await cart.save();
    const populated = await getPopulatedCart(userId);

    res.json({ message: "Product removed from cart", cart: populated });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove from cart", error: err.message });
  }
}

/**
 * GET /api/cart (bonus)
 * Fetch the current user's cart with populated product details and total price.
 */
export async function getCart(req, res) {
  try {
    const cart = await getPopulatedCart(req.query.userId || "guest");
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cart", error: err.message });
  }
}
