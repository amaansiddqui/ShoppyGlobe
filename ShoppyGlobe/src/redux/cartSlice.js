import { createSlice } from "@reduxjs/toolkit";

/**
 * Initial state for the cart slice
 */
const initialState = {
  items: [],
};

/**
 * Cart Slice
 * Manages shopping cart state including adding, removing, updating items, and clearing cart.
 */
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Adds a product or increments quantity if item is already in cart
    addToCart: (state, action) => {
      const product = action.payload;
      if (!product || product.id === undefined) return;
      const existingItem = state.items.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += product.quantity || 1;
      } else {
        state.items.push({ ...product, quantity: product.quantity || 1 });
      }
    },
    // Removes an item from cart by ID
    removeFromCart: (state, action) => {
      const id = typeof action.payload === "object" && action.payload !== null ? action.payload.id : action.payload;
      state.items = state.items.filter((item) => item.id !== id);
    },
    // Updates item quantity; removes item if quantity is set to 0 or less
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        const item = state.items.find((item) => item.id === id);
        if (item) {
          item.quantity = quantity;
        }
      }
    },
    // Resets the cart to empty
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

// Selectors for accessing cart state in components
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

export default cartSlice.reducer;
