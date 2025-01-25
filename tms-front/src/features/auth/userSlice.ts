import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import API from "../../config/base";
import { RootState } from "../../redux/store";

// Define user profile interface
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

// Thunk to fetch user profile by ID
export const getAUser = createAsyncThunk<
  UserProfile,
  string,
  { rejectValue: string }
>("user/getAUser", async (id, { rejectWithValue }) => {
  try {
    const response = await API.get(`/api/v1/auth/user/${id}`);
    if (response.data) {
      return response.data;
    } else {
      return rejectWithValue("User not found");
    }
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Server error");
  }
});

// Thunk for updating a user profile
export const updateUser = createAsyncThunk<
  UserProfile,
  { id: string; data: Partial<UserProfile> },
  { rejectValue: string }
>("user/updateUser", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await API.put(`/api/v1/auth/user/${id}`, data);
    if (response.data?.status) {
      return response.data.user;
    } else {
      return rejectWithValue("Failed to update user");
    }
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Server error");
  }
});

// Slice for user profile management
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAUser.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.profile = action.payload;
          state.loading = false;
        }
      )
      .addCase(getAUser.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      });
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateUser.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.profile = action.payload;
          state.loading = false;
        }
      )
      .addCase(updateUser.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { clearProfile } = userSlice.actions;
export default userSlice.reducer;

// Selector for getting complete user profile
export const selectUserProfile = (state: RootState) => state.auth.user;
