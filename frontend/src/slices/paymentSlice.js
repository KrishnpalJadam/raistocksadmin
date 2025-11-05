import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ✅ Fetch all clients (payment list)
export const fetchPayments = createAsyncThunk("payments/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_BASE}/api/clients`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const paymentSlice = createSlice({
  name: "payments",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default paymentSlice.reducer;
