import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API = `${API_BASE}/api/research-reports`;

export const fetchReports = createAsyncThunk(
  "researchReports/fetchAll",
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

export const uploadReport = createAsyncThunk(
  "researchReports/upload",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/upload`, {
        method: "POST",
        body: formData,
      });
      const body = await res.json();
      if (!res.ok) return rejectWithValue(body);
      return body.report;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteReport = createAsyncThunk(
  "researchReports/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      const body = await res.json();
      if (!res.ok) return rejectWithValue(body);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const slice = createSlice({
  name: "researchReports",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchReports.pending, (s) => {
      s.status = "loading";
    })
      .addCase(fetchReports.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload;
      })
      .addCase(fetchReports.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || a.error.message;
      })
      .addCase(uploadReport.fulfilled, (s, a) => {
        s.items.unshift(a.payload);
      })
      .addCase(deleteReport.fulfilled, (s, a) => {
        s.items = s.items.filter((i) => i._id !== a.payload);
      });
  },
});

export default slice.reducer;
