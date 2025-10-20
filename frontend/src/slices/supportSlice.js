// src/redux/supportSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/support";

// ✅ Fetch all tickets
export const fetchSupportTickets = createAsyncThunk(
  "support/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL);
      return res.data; // ✅ backend returns an array directly
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ✅ Update ticket status (used when email is sent)
export const updateTicketStatus = createAsyncThunk(
  "support/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, { status });
      return res.data; // ✅ backend returns ticket directly
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const supportSlice = createSlice({
  name: "support",
  initialState: {
    tickets: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Fetch tickets
      .addCase(fetchSupportTickets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSupportTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchSupportTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Update ticket status
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        const updatedTicket = action.payload;
        state.tickets = state.tickets.map((t) =>
          t._id === updatedTicket._id ? updatedTicket : t
        );
      });
  },
});

export default supportSlice.reducer;
