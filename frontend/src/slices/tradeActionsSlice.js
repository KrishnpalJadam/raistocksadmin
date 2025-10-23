import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;

// ✅ Create a new trade action
export const createTradeAction = createAsyncThunk(
  "tradeActions/create",
  async ({ tradeId, actionData }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/api/trade-actions/${tradeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(actionData),
      });

      if (!res.ok) throw new Error("Failed to create trade action");
      const data = await res.json();
      // backend returns { message, action }
      return data.action || data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Get all trade actions for a trade
export const fetchTradeActions = createAsyncThunk(
  "tradeActions/fetchAll",
  async (tradeId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/api/trade-actions/${tradeId}`);
      if (!res.ok) throw new Error("Failed to fetch trade actions");
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const tradeActionSlice = createSlice({
  name: "tradeActions",
  initialState: {
    actions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all actions
      .addCase(fetchTradeActions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTradeActions.fulfilled, (state, action) => {
        state.loading = false;
        const tradeId = action.meta?.arg;
        const incoming = (action.payload || []).map((a) => ({
          ...a,
          type: String(a.type || "")
            .toLowerCase()
            .trim(),
          tradeId: String(a.tradeId || tradeId || "").trim(),
        }));

        // Remove existing actions for this tradeId and append incoming
        if (tradeId) {
          state.actions = state.actions.filter(
            (a) => String(a.tradeId) !== String(tradeId)
          );
        }
        state.actions = state.actions.concat(incoming);
      })
      .addCase(fetchTradeActions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create new action
      .addCase(createTradeAction.fulfilled, (state, action) => {
        const a = action.payload || {};
        const normalized = {
          ...a,
          type: String(a.type || "")
            .toLowerCase()
            .trim(),
          tradeId: String(a.tradeId || "").trim(),
        };
        // append the created action
        state.actions.push(normalized);
      });
  },
});

export default tradeActionSlice.reducer;
