import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TRADE_API = `${API_BASE}/api/trades`;

export const fetchTrades = createAsyncThunk(
  "trades/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(TRADE_API);
      const body = await res.json();
      if (!res.ok) return rejectWithValue(body);
      return body || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

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
      return body.trade || body;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

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

      // ✅ Always return normalized data (id + status)
      return {
        id: body.trade?._id || id,
        status: body.trade?.status || status,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


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
      return body.trade || body;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

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

const slice = createSlice({
  name: "trades",
  initialState: { items: [], status: "idle", error: null },
  reducers: {
    updateWithActions: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchTrades.pending, (s) => {
      s.status = "loading";
    })
      .addCase(fetchTrades.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload;
      })
      .addCase(fetchTrades.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || a.error?.message;
      })
      .addCase(createTrade.fulfilled, (s, a) => {
        // Ensure new trade has status
        const trade = a.payload;
        s.items.unshift({
          ...trade,
          status: trade.status || "Live",
        });
      })
      .addCase(updateTrade.fulfilled, (s, a) => {
        const idx = s.items.findIndex(
          (x) => x._id === a.payload._id || x.id === a.payload.id
        );
        if (idx >= 0) s.items[idx] = a.payload;
      })
  .addCase(updateTradeStatus.fulfilled, (s, a) => {
  const { id, status } = a.payload;
  const idx = s.items.findIndex(
    (x) => String(x._id) === String(id) || String(x.id) === String(id)
  );
  if (idx >= 0) {
    s.items[idx].status = status;
  }
})

      .addCase(deleteTrade.fulfilled, (s, a) => {
        s.items = s.items.filter(
          (x) => x._id !== a.payload && x.id !== a.payload
        );
      });
  },
});

export default slice.reducer;
