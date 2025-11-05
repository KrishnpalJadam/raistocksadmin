// src/slices/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;

// ==================== LOGIN USER ====================
export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      // Store in localStorage
      localStorage.setItem("login_details", JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ==================== REGISTER USER ====================
export const registerUser = createAsyncThunk(
  "user/register",
  async ({ name, email, password, role, subRole }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        role,
        subRole,
      });
      localStorage.setItem("login_details", JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ==================== LOGOUT USER ====================
export const logoutUser = createAsyncThunk("user/logout", async () => {
  localStorage.removeItem("login_details");
  return { message: "User logged out" };
});

// ==================== UPDATE PASSWORD ====================
export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (
    { currentPassword, newPassword, confirmPassword, token },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.put(
        `${API_URL}/password`,
        { currentPassword, newPassword, confirmPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ==================== SLICE ====================
const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: localStorage.getItem("user_id") || null,
    token: localStorage.getItem("authToken") || null,
    userDetails: null, // optional, full user info after fetching
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.userId = action.payload.user._id; // <--- add this

        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.userId = action.payload.user._id; // <--- add this

        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
        state.successMessage = null;
      })

      // UPDATE PASSWORD
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = userSlice.actions;
export default userSlice.reducer;
