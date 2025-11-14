// src/slices/clientSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Base URL — adjust if needed
const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000"
}/api/clients`;

// ======================================================
// ✅ Fetch ALL clients
// ======================================================
export const fetchClients = createAsyncThunk(
  "clients/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL, { withCredentials: true });
      return response.data.clients || response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch clients"
      );
    }
  }
);

// ======================================================
// ✅ Update ONLY KYC status
// ======================================================
export const updateKycStatus = createAsyncThunk(
  "clients/updateKycStatus",
  async ({ clientId, kyc }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${API_URL}/${clientId}/kyc`,
        { kyc },
        { withCredentials: true }
      );

      return response.data.client; // updated client from backend
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update KYC status"
      );
    }
  }
);

// ======================================================
// ✅ Slice
// ======================================================
const clientSlice = createSlice({
  name: "clients",
  initialState: {
    clients: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // ========================================
      // 🔄 Fetch clients
      // ========================================
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========================================
      // 🔄 Update KYC
      // ========================================
      .addCase(updateKycStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateKycStatus.fulfilled, (state, action) => {
        state.loading = false;

        const updatedClient = action.payload;

        // Replace updated client in list
        state.clients = state.clients.map((c) =>
          c.clientId === updatedClient.clientId ? updatedClient : c
        );
      })
      .addCase(updateKycStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export reducer
export default clientSlice.reducer;
