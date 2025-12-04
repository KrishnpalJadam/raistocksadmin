import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Base URL — adjust if needed
const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/dashboard`;

// ✅ Fetch dashboard stats
export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL, { withCredentials: true });
      // your backend sends { success: true, data: { totalClients, kycPending, ... } }
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard stats"
      );
    }
  }
);
export const fetchRevenueStats = createAsyncThunk(
  "dashboard/fetchRevenue",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/revenue`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch revenue stats");
    }
  }
);

 const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: {},
    revenue: {
      daily: [],
      weekly: [],
      monthly: [],
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ⭐ NEW REVENUE REDUCER
      .addCase(fetchRevenueStats.fulfilled, (state, action) => {
        state.revenue = action.payload;
      });
  },
});


export default dashboardSlice.reducer;
