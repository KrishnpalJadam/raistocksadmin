// src/slices/clientSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Base URL — adjust if needed
const API_URL = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/clients`;

// ✅ Fetch all clients
export const fetchClients = createAsyncThunk("clients/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await axios.get(API_URL, { withCredentials: true });
    return response.data.clients || response.data; // depending on backend response format
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch clients");
  }
});

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
      // 🔄 Fetch clients
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
      });
  },
});

export default clientSlice.reducer;
