import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ✅ Fetch all leads (with authentication)
export const fetchLeads = createAsyncThunk("leads/fetchLeads", async (_, thunkAPI) => {
  try {
    const token = import.meta.env.VITE_ADMIN_TOKEN;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/leads`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch leads");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const leadsSlice = createSlice({
  name: "leads",
  initialState: {
    leads: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateLeadStatus: (state, action) => {
      const { id, status } = action.payload;
      const lead = state.leads.find((l) => l._id === id);
      if (lead) lead.status = status;
    },
    deleteLead: (state, action) => {
      state.leads = state.leads.filter((l) => l._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload || [];
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { updateLeadStatus, deleteLead } = leadsSlice.actions;
export default leadsSlice.reducer;
