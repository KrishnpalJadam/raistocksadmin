import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const PHASE_API = `${API_BASE}/api/users/market-phase`;

export const fetchMarketPhases = createAsyncThunk(
  "marketPhases/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(PHASE_API);
      const body = await res.json();
      if (!res.ok) return rejectWithValue(body);
      return body || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createMarketPhase = createAsyncThunk(
  "marketPhases/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(PHASE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) return rejectWithValue(body);
      return body.trend || body; // controller responds with { message, trend }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const slice = createSlice({
  name: "marketPhases",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketPhases.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchMarketPhases.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload;
      })
      .addCase(fetchMarketPhases.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || a.error.message;
      })
      .addCase(createMarketPhase.fulfilled, (s, a) => {
        s.items.unshift(a.payload);
      });
  },
});

export default slice.reducer;
