import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TREND_API = `${API_BASE}/api/users/market-trend`;

export const fetchMarketTrends = createAsyncThunk(
  "marketTrends/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(TREND_API);
      const body = await res.json();
      if (!res.ok) return rejectWithValue(body);
      return body || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createMarketTrend = createAsyncThunk(
  "marketTrends/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(TREND_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) return rejectWithValue(body);
      return body.trend || body;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const slice = createSlice({
  name: "marketTrends",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketTrends.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchMarketTrends.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload;
      })
      .addCase(fetchMarketTrends.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || a.error.message;
      })
      .addCase(createMarketTrend.fulfilled, (s, a) => {
        s.items.unshift(a.payload);
      });
  },
});

export default slice.reducer;
