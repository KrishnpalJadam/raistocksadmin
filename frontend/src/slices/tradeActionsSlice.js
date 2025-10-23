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
      return data.action || data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Fetch all trade actions for a trade
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

// ✅ Update trade status (optimistic update)
export const updateTradeStatus = createAsyncThunk(
  "tradeActions/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/api/trades/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update trade status");
      const data = await res.json();
      return { id, status: data.status || status }; // return updated info
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
      // === Fetch All ===
      .addCase(fetchTradeActions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTradeActions.fulfilled, (state, action) => {
        state.loading = false;
        const tradeId = action.meta?.arg;
        const incoming = (action.payload || []).map((a) => ({
          ...a,
          type: String(a.type || "").toLowerCase().trim(),
          tradeId: String(a.tradeId || tradeId || "").trim(),
        }));

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

      // === Create Action ===
      .addCase(createTradeAction.fulfilled, (state, action) => {
        const a = action.payload || {};
        const normalized = {
          ...a,
          type: String(a.type || "").toLowerCase().trim(),
          tradeId: String(a.tradeId || "").trim(),
        };
        state.actions.push(normalized);
      })

      // === Update Trade Status (Frontend Sync) ===
      .addCase(updateTradeStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        // Update all actions related to this trade if needed
        state.actions = state.actions.map((a) =>
          String(a.tradeId) === String(id)
            ? { ...a, status }
            : a
        );
      })
      .addCase(updateTradeStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default tradeActionSlice.reducer;
