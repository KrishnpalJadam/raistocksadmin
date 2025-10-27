import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

 
const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/api/marketsetup`;

// Fetch All Market Setups
export const fetchMarketSetups = createAsyncThunk(
  "marketSetup/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL);
      return res.data; // ✅ This is an array
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Create Market Setup
export const createMarketSetup = createAsyncThunk(
  "marketSetup/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Delete Market Setup
export const deleteMarketSetup = createAsyncThunk(
  "marketSetup/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_URL}/${id}`);
      return id; // ✅ Return deleted ID to remove from store
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const marketSetupSlice = createSlice({
  name: "marketSetup",
  initialState: {
    setups: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchMarketSetups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketSetups.fulfilled, (state, action) => {
        state.loading = false;
        state.setups = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchMarketSetups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createMarketSetup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMarketSetup.fulfilled, (state, action) => {
        state.loading = false;
        state.setups.unshift(action.payload); // Add new on top
      })
      .addCase(createMarketSetup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteMarketSetup.fulfilled, (state, action) => {
        state.setups = state.setups.filter((s) => s._id !== action.payload);
      })
      .addCase(deleteMarketSetup.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default marketSetupSlice.reducer;
