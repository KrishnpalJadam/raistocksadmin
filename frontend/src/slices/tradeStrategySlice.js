import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// API base URL setup
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const STRATEGY_API = `${API_BASE}/api/trade-strategies`;

// -------------------- FETCH ALL --------------------
export const fetchTradeStrategies = createAsyncThunk(
  "tradeStrategies/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(STRATEGY_API);
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return data || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// -------------------- CREATE --------------------
export const createTradeStrategy = createAsyncThunk(
  "tradeStrategies/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(STRATEGY_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return data.strategy || data; // backend may return { message, strategy }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// -------------------- UPDATE --------------------
export const updateTradeStrategy = createAsyncThunk(
  "tradeStrategies/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${STRATEGY_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) return rejectWithValue(body);
      return body.updated || body;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// -------------------- DELETE --------------------
export const deleteTradeStrategy = createAsyncThunk(
  "tradeStrategies/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${STRATEGY_API}/${id}`, { method: "DELETE" });
      const body = await res.json();
      if (!res.ok) return rejectWithValue(body);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// -------------------- SLICE --------------------
const tradeStrategySlice = createSlice({
  name: "tradeStrategies",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH ALL
      .addCase(fetchTradeStrategies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTradeStrategies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTradeStrategies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // CREATE
      .addCase(createTradeStrategy.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      // UPDATE
      .addCase(updateTradeStrategy.fulfilled, (state, action) => {
        const updated = action.payload;
        state.items = state.items.map((item) =>
          item._id === updated._id ? updated : item
        );
      })

      // DELETE
      .addCase(deleteTradeStrategy.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i._id !== action.payload);
      });
  },
});

export default tradeStrategySlice.reducer;
