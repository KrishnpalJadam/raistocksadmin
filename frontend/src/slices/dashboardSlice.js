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

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: {
      totalClients: 0,
      kycPending: 0,
      openTickets: 0,
      activeSubscriptions: 0,
      totalRevenue: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔄 Fetch Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
