import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://tradingapi-production-a52b.up.railway.app/api/invoice"; 
// Endpoints:
// GET /invoice/all
// GET /invoice/:invoiceId

// ✅ Get All Invoices
export const fetchAllInvoices = createAsyncThunk(
  "invoice/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/all`);
      return res.data; // Array of invoices
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ✅ Get Invoice By ID
export const fetchInvoiceById = createAsyncThunk(
  "invoice/fetchById",
  async (invoiceId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/${invoiceId}`);
      return res.data; // Single invoice object
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const invoiceSlice = createSlice({
  name: "invoice",
  initialState: {
    invoices: [],
    selectedInvoice: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedInvoice: (state) => {
      state.selectedInvoice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch All Invoices
      .addCase(fetchAllInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAllInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Fetch Invoice By ID
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedInvoice = action.payload; // Set selected invoice
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.selectedInvoice = null;
      });
  },
});

export const { clearSelectedInvoice } = invoiceSlice.actions;

export default invoiceSlice.reducer;
