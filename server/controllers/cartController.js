import Cart from "../models/Cart.js";
import { ApiError } from "../middleware/validate.js";

// get (or lazily create) the current user's cart, with products populated.
// userId comes from the JWT (req.user.id) — each user has their own cart.
// Automatically filters out and cleans up any orphaned products that no longer exist in DB.
async function getPopulatedCart(userId) {
  let cart = await Cart.findOne({ userId }).populate("items.product");
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
    cart = await Cart.findById(cart._id).populate("items.product");
  } else {
    // If any product failed to populate (e.g. was deleted or re-seeded), clean it up from cart
    const validItems = cart.items.filter((item) => item.product !== null && item.product !== undefined);
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }
  }
  return cart;
}

/**
 * POST /api/cart
 * Add a product to the shopping cart.
 */
export async function addToCart(req, res) {
  try {
    // productId, quantity and product existence/stock already validated
    // by validateCartItemBody middleware; validated product is on req.product
    const { productId, quantity = 1 } = req.body;
    const qty = parseInt(quantity);

    // Separate cart per user — the authenticated user's id from the JWT
    const userId = req.user.id;
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
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) {
      throw new ApiError(404, "Product not found in cart");
    }

    item.quantity = parseInt(req.body.quantity, 10);
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
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    const before = cart.items.length;
    cart.items = cart.items.filter((i) => i.product.toString() !== productId);

    if (cart.items.length === before) {
      throw new ApiError(404, "Product not found in cart");
    }

    await cart.save();
    const populated = await getPopulatedCart(userId);

    res.json({ message: "Product removed from cart", cart: populated });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove from cart", error: err.message });
  }
}

/**
 * DELETE /api/cart
 * Clear the current user's entire cart in MongoDB.
 */
export async function clearUserCart(req, res) {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    } else {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: "Cart cleared", cart: { userId, items: [], totalPrice: 0 } });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear cart", error: err.message });
  }
}

/**
 * GET /api/cart (bonus)
 * Fetch the current user's cart with populated product details and total price.
 */
export async function getCart(req, res) {
  try {
    // Each authenticated user only ever sees their own cart
    const cart = await getPopulatedCart(req.user.id);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cart", error: err.message });
  }
}
