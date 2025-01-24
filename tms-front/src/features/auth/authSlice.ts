import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  userId: string | null; // User ID
  accessToken: string | null; // Access token
  isAuthenticated: boolean; // Authentication state
  error: string | null; // Error message
}

const initialState: AuthState = {
  userId: null,
  accessToken: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  error: null,
};

const API_URL = "http://localhost:8081/api/v1/auth/user";

// Async thunk for registration
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    userData: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

// Async thunk for refreshing the token
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/refresh-token`, null, {
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
    logout(state) {
      state.userId = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
        const { id, accessToken } = action.payload;
        if (id && accessToken) {
          state.userId = id;
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
        const { id, accessToken } = action.payload;

        if (id && accessToken) {
          state.userId = id;
          state.accessToken = accessToken;
          state.isAuthenticated = true;
          localStorage.setItem("token", accessToken);
        } else {
          state.error = "Invalid response format during login";
        }
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.error =
          action.payload?.message || "Login failed. Please try again.";
      })
      .addCase(refreshToken.fulfilled, (state, action: PayloadAction<any>) => {
        const { accessToken } = action.payload;
        if (accessToken) {
          state.accessToken = accessToken;
          localStorage.setItem("token", accessToken);
        } else {
          state.error = "Failed to refresh access token";
        }
      })
      .addCase(refreshToken.rejected, (state, action: PayloadAction<any>) => {
        state.error =
          action.payload?.message || "Failed to refresh token. Please login again.";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
