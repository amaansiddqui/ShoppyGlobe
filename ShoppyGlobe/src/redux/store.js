import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import searchReducer from "./searchSlice";
import authReducer from "./authSlice";

/**
 * Redux Store Configuration
 * Configures the global Redux store by combining reducers for cart management,
 * product search and user authentication.
 */
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    search: searchReducer,
    auth: authReducer,
  },
});

export default store;
