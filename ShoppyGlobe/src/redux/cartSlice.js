import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { logout as authLogout } from "./authSlice";

// Cart slice synced with the PROTECTED backend cart API.
// Every mutation also calls /api/cart with the JWT from localStorage.

function authHeaders() {
  const token = localStorage.getItem("sg_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiCall(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...authHeaders(), ...(options.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

// Backend cart docs: { userId, items: [{ product: {...}, quantity }], totalPrice }
// Normalize to the shape the UI components already use (id, title, price, thumbnail, quantity)
function normalizeCart(data) {
  if (!data) return [];
  return (data.items || []).map((it) => {
    const p = typeof it.product === "object" ? it.product : null;
    return {
      id: p ? String(p._id) : String(it.product),
      title: p?.title || "Item",
      price: p?.price ?? 0,
      thumbnail: p?.thumbnail || "",
      quantity: it.quantity,
    };
  });
}

/** GET /api/cart */
export const fetchCart = createAsyncThunk("cart/fetch", async (_, { rejectWithValue }) => {
  try {
    const data = await apiCall("/api/cart");
    return normalizeCart(data);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

/** POST /api/cart { productId, quantity } */
export const addCartItem = createAsyncThunk("cart/add", async ({ productId, quantity = 1 }, { rejectWithValue }) => {
  try {
    const data = await apiCall("/api/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
    return normalizeCart(data.cart);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

/** PUT /api/cart/:productId { quantity } */
export const updateCartItemApi = createAsyncThunk(
  "cart/updateApi",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const data = await apiCall(`/api/cart/${productId}`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
      });
      return normalizeCart(data.cart);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/** DELETE /api/cart/:productId */
export const removeCartItemApi = createAsyncThunk("cart/removeApi", async (productId, { rejectWithValue }) => {
  try {
    const data = await apiCall(`/api/cart/${productId}`, { method: "DELETE" });
    return normalizeCart(data.cart);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialState = { items: [], loading: false, error: null };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Local add — used when NOT logged in (guest mode)
    addToCart: (state, action) => {
      const product = action.payload;
      const key = product._id !== undefined ? String(product._id) : product.id !== undefined ? String(product.id) : undefined;
      if (!product || key === undefined) return;
      const existing = state.items.find((i) => String(i.id) === key);
      if (existing) {
        existing.quantity += product.quantity || 1;
      } else {
        state.items.push({ ...product, id: key, quantity: product.quantity || 1 });
      }
      state.error = null;
    },
    removeFromCart: (state, action) => {
      const id = typeof action.payload === "object" ? String(action.payload._id ?? action.payload.id ?? action.payload) : String(action.payload);
      state.items = state.items.filter((i) => String(i.id) !== id);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const key = String(id);
      if (quantity <= 0) {
        state.items = state.items.filter((i) => String(i.id) !== key);
      } else {
        const item = state.items.find((i) => String(i.id) === key);
        if (item) item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const setItems = (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    };
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, setItems)
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCartItem.fulfilled, setItems)
      .addCase(addCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCartItemApi.fulfilled, setItems)
      .addCase(updateCartItemApi.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeCartItemApi.fulfilled, setItems)
      .addCase(removeCartItemApi.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Logging out clears the local cart (backend cart is per-user)
      .addCase(authLogout, (state) => {
        state.items = [];
        state.error = null;
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectCartTotalCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

export default cartSlice.reducer;
