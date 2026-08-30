import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Stored JWT + user info. Token persisted in localStorage so the
// session survives page reloads.
const savedToken = localStorage.getItem("sg_token");
const savedUser = JSON.parse(localStorage.getItem("sg_user") || "null");

const initialState = {
  token: savedToken || null,
  user: savedUser,
  loading: false,
  error: null,
};

function saveSession(token, user) {
  localStorage.setItem("sg_token", token);
  localStorage.setItem("sg_user", JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem("sg_token");
  localStorage.removeItem("sg_user");
}

/**
 * POST /api/register — create account, receives JWT
 * payload: { username, email, password }
 */
export const registerUser = createAsyncThunk(
  "auth/register",
  async (body, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || "Registration failed");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/**
 * POST /api/login — authenticate, receives JWT
 * payload: { email, password }
 */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (body, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || "Login failed");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.error = null;
      clearSession();
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        saveSession(action.payload.token, action.payload.user);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        saveSession(action.payload.token, action.payload.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectIsLoggedIn = (state) => Boolean(state.auth.token);
export const selectAuthUser = (state) => state.auth.user;

export default authSlice.reducer;
