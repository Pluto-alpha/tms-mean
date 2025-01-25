import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../config/base";
import type { RootState } from "../../redux/store";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  error: null,
};

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    userData: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await API.post(`/api/v1/auth/user/register`, userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await API.post(`/api/v1/auth/user/login`, credentials);
      const { id, accessToken } = response.data;
      localStorage.setItem("token", accessToken);
      const userResponse = await API.get(`/api/v1/auth/user/${id}`);
      const user = userResponse.data[0]; // Assuming it's an array
      return { user, accessToken };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

// Async thunk for user logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await API.post("/api/v1/auth/user/logout", {}, { withCredentials: true });
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Logout failed");
    }
  }
);

// Async thunk for refreshing the user token
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.post(`/api/v1/auth/user/refresh-token`, null, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to refresh token");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthState(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
        const { user, accessToken } = action.payload;
        if (user && accessToken) {
          state.user = user;
          state.accessToken = accessToken;
          state.isAuthenticated = true;
          localStorage.setItem("token", accessToken);
        } else {
          state.error = "Invalid response format during registration";
        }
      })
      .addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
        state.error =
          action.payload?.message || "Registration failed. Please try again.";
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        const { user, accessToken } = action.payload;
        state.user = user;
        state.accessToken = accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.error =
          action.payload?.message || "Login failed. Please try again.";
      })
      .addCase(refreshToken.fulfilled, (state, action: PayloadAction<any>) => {
        state.accessToken = action.payload.accessToken;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action: PayloadAction<any>) => {
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error =
          action.payload || "Failed to refresh token. Please login again.";
      });
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;

// Selectors for user and username
export const selectUser = (state: RootState) => state.auth.user;
export const selectUsername = (state: RootState) =>
  state.auth.user?.name || "Guest";
