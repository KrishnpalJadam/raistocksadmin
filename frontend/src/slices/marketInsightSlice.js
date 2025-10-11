import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API = `${API_BASE}/api/market-insights`;

export const fetchMarketInsights = createAsyncThunk(
  "marketInsights/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(API);
      const body = await res.json();
      if (!res.ok) return rejectWithValue(body);
      return body.data || [];
    } catch (err) {
      return rejectWithValue({ message: err.message });
    }
  }
);

export const createMarketInsight = createAsyncThunk(
  "marketInsights/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) return rejectWithValue(body);
      return body.data;
    } catch (err) {
      return rejectWithValue({ message: err.message });
    }
  }
);

export const updateMarketInsight = createAsyncThunk(
  "marketInsights/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) return rejectWithValue(body);
      return body.data;
    } catch (err) {
      return rejectWithValue({ message: err.message });
    }
  }
);

export const deleteMarketInsight = createAsyncThunk(
  "marketInsights/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      const body = await res.json();
      if (!res.ok) return rejectWithValue(body);
      return id;
    } catch (err) {
      return rejectWithValue({ message: err.message });
    }
  }
);

const marketInsightSlice = createSlice({
  name: "marketInsights",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketInsights.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMarketInsights.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMarketInsights.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || action.error.message;
      })

      .addCase(createMarketInsight.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      .addCase(updateMarketInsight.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })

      .addCase(deleteMarketInsight.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i._id !== action.payload);
      });
  },
});

export default marketInsightSlice.reducer;
