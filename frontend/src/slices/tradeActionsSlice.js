import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// ✅ Create a new trade action
export const createTradeAction = createAsyncThunk(
  "tradeActions/create",
  async ({ tradeId, actionData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/trades/${tradeId}/actions`, actionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create trade action");
    }
  }
);

// ✅ Get all trade actions for a trade
export const fetchTradeActions = createAsyncThunk(
  "tradeActions/fetchAll",
  async (tradeId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/trades/${tradeId}/actions`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch trade actions");
    }
  }
);

const tradeActionsSlice = createSlice({
  name: "tradeActions",
  initialState: {
    actions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTradeActions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTradeActions.fulfilled, (state, action) => {
        state.loading = false;
        state.actions = action.payload;
      })
      .addCase(fetchTradeActions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTradeAction.fulfilled, (state, action) => {
        state.actions.push(action.payload);
      });
  },
});

export default tradeActionsSlice.reducer;
