import { createSlice } from "@reduxjs/toolkit";

/**
 * Initial state for search slice
 */
const initialState = {
  searchQuery: "",
};

/**
 * Search Slice
 * Manages global search query state for filtering products in ProductList.
 */
const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    // Sets search query string
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    // Clears search query string
    clearSearchQuery: (state) => {
      state.searchQuery = "";
    },
  },
});

export const { setSearchQuery, clearSearchQuery } = searchSlice.actions;

// Selector to access active search query
export const selectSearchQuery = (state) => state.search.searchQuery;

export default searchSlice.reducer;
