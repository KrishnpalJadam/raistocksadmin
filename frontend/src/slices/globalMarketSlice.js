import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API = `${API_BASE}/api/globalmarket`;

export const fetchGlobalMarkets = createAsyncThunk(
  "globalMarket/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(API);
      const body = await res.json();
      if (!res.ok) return rejectWithValue(body);
      return body || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createGlobalMarket = createAsyncThunk(
  "globalMarket/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) return rejectWithValue(body);
      return body;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const slice = createSlice({
  name: "globalMarket",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchGlobalMarkets.pending, (s) => {
      s.status = "loading";
    })
      .addCase(fetchGlobalMarkets.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload;
      })
      .addCase(fetchGlobalMarkets.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || a.error?.message;
      })
      .addCase(createGlobalMarket.fulfilled, (s, a) => {
        s.items.unshift(a.payload);
      });
  },
});

export default slice.reducer;
