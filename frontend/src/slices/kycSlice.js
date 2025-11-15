import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API = `${API_BASE}/api/kyc`;

// =============================
// ✅ Async Thunks
// =============================

// Fetch all KYCs
export const fetchKycs = createAsyncThunk(
  "kyc/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/all`);
      const body = await res.json();
      if (!res.ok) return rejectWithValue(body);
      return body.data || [];
    } catch (err) {
      return rejectWithValue({ message: err.message });
    }
  }
);

// Create new KYC
export const createKycThunk = createAsyncThunk(
  "kyc/create",
  async (payload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.keys(payload).forEach((key) => {
        if (payload[key] !== undefined && payload[key] !== null) {
          formData.append(key, payload[key]);
        }
      });

      const res = await fetch(`${API}/create`, {
        method: "POST",
        body: formData,
      });

      const body = await res.json();
      if (!res.ok) return rejectWithValue(body);
      return body.data;
    } catch (err) {
      return rejectWithValue({ message: err.message });
    }
  }
);

// Update existing KYC
export const updateKycThunk = createAsyncThunk(
  "kyc/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });

      const res = await fetch(`${API}/update/${id}`, {
        method: "PUT",
        body: formData,
      });

      const body = await res.json();
      if (!res.ok) return rejectWithValue(body);
      return body.data;
    } catch (err) {
      return rejectWithValue({ message: err.message });
    }
  }
);

// Get KYC by email
export const getKycByEmail = createAsyncThunk(
  "kyc/getByEmail",
  async (email, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/email/${email}`);
      const body = await res.json();
      if (!res.ok) return rejectWithValue(body);
      return body.data;
    } catch (err) {
      return rejectWithValue({ message: err.message });
    }
  }
);

// Upload agreement later
export const uploadAgreementThunk = createAsyncThunk(
  "kyc/uploadAgreement",
  async ({ id, agreementFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("agreement", agreementFile);

      const res = await fetch(`${API}/upload-agreement/${id}`, {
        method: "PUT",
        body: formData,
      });

      const body = await res.json();
      if (!res.ok) return rejectWithValue(body);
      return body.data;
    } catch (err) {
      return rejectWithValue({ message: err.message });
    }
  }
);

// =============================
// ✅ Slice
// =============================
const kycSlice = createSlice({
  name: "kyc",
  initialState: {
    items: [],
    selectedKyc: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearSelectedKyc: (state) => {
      state.selectedKyc = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchKycs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchKycs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchKycs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || action.error.message;
      })

      // Create KYC
      .addCase(createKycThunk.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      // Update KYC
      .addCase(updateKycThunk.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })

      // Get by email
      .addCase(getKycByEmail.fulfilled, (state, action) => {
        state.selectedKyc = action.payload;
      })

      // Upload agreement
      .addCase(uploadAgreementThunk.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.selectedKyc?._id === action.payload._id) {
          state.selectedKyc = action.payload;
        }
      });
  },
});

export const { clearSelectedKyc } = kycSlice.actions;
export default kycSlice.reducer;
