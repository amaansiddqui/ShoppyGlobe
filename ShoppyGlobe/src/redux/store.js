import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import searchReducer from "./searchSlice";

/**
 * Redux Store Configuration
 * Configures the global Redux store by combining reducers for cart management
 * and product search functionality.
 */
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    search: searchReducer,
  },
});

export default store;
