 import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TRADE_API = `${API_BASE}/api/trades`;

/* ================= Fetch Trades ================= */
export const fetchTrades = createAsyncThunk(
  "trades/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(TRADE_API);
      const body = await res.json();

      if (!res.ok) return rejectWithValue(body);

      return body.trades || []; // ✅ Always return array
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ================= Create Trade ================= */
export const createTrade = createAsyncThunk(
  "trades/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(TRADE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json();
      if (!res.ok) return rejectWithValue(body);

      return body.trade;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ================= Update Trade ================= */
export const updateTrade = createAsyncThunk(
  "trades/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${TRADE_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const body = await res.json();
      if (!res.ok) return rejectWithValue(body);

      return body.trade;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ================= Update Status ================= */
export const updateTradeStatus = createAsyncThunk(
  "trades/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${TRADE_API}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const body = await res.json();
      if (!res.ok) return rejectWithValue(body);

      return { id, status: body.trade.status };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ================= Update Trail SL ================= */
export const updateTrailSl = createAsyncThunk(
  "trades/updateTrailSl",
  async ({ id, trailSl }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${TRADE_API}/${id}/trail-sl`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trailSl }),
      });

      const body = await res.json();
      if (!res.ok) return rejectWithValue(body);

      return body.trade;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ================= Delete Trade ================= */
export const deleteTrade = createAsyncThunk(
  "trades/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${TRADE_API}/${id}`, { method: "DELETE" });
      const body = await res.json();

      if (!res.ok) return rejectWithValue(body);

      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ================= Slice ================= */
const slice = createSlice({
  name: "trades",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    updateWithActions: (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrades.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTrades.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = Array.isArray(action.payload) ? action.payload : []; // ✅ Safety
      })
      .addCase(fetchTrades.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error?.message;
      })

      /* CREATE */
      .addCase(createTrade.fulfilled, (state, action) => {
        if (action.payload)
          state.items.unshift({ ...action.payload, status: "Live" });
      })

      /* UPDATE */
      .addCase(updateTrade.fulfilled, (state, action) => {
        const trade = action.payload;
        const id = trade?._id || trade?.id;
        const idx = state.items.findIndex((x) => String(x._id) === String(id));
        if (idx >= 0) state.items[idx] = trade;
      })

      /* UPDATE STATUS */
      .addCase(updateTradeStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const idx = state.items.findIndex((x) => String(x._id) === String(id));
        if (idx >= 0) state.items[idx].status = status;
      })

      /* UPDATE TRAIL SL */
      .addCase(updateTrailSl.fulfilled, (state, action) => {
        const trade = action.payload;
        const id = trade?._id || trade?.id;
        const idx = state.items.findIndex((x) => String(x._id) === String(id));
        if (idx >= 0) state.items[idx] = { ...state.items[idx], ...trade };
      })

      /* DELETE */
      .addCase(deleteTrade.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter((x) => String(x._id) !== String(id));
      });
  },
});

export default slice.reducer;
