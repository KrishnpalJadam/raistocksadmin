import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const STRATEGY_API = `${API_BASE}/api/trade-strategies`;

export const fetchTradeStrategies = createAsyncThunk(
  "tradeStrategies/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(STRATEGY_API);
      const body = await res.json();
      if (!res.ok) return rejectWithValue(body);
      return body || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createTradeStrategy = createAsyncThunk(
  "tradeStrategies/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(STRATEGY_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) return rejectWithValue(body);
      return body.tradeStrategy || body; // controller responds with { message, tradeStrategy }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

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

const slice = createSlice({
  name: "tradeStrategies",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTradeStrategies.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchTradeStrategies.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload;
      })
      .addCase(fetchTradeStrategies.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || a.error.message;
      })
      .addCase(createTradeStrategy.fulfilled, (s, a) => {
        s.items.unshift(a.payload);
      })
      .addCase(deleteTradeStrategy.fulfilled, (s, a) => {
        s.items = s.items.filter((i) => i._id !== a.payload);
      });
  },
});

export default slice.reducer;
