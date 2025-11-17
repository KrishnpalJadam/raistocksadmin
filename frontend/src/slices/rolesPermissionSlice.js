 import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API = `${API_BASE}/api/rolePermissions`;

// ✅ Update Role Permissions (called on checkbox change)
export const updateRolePermission = createAsyncThunk(
  "rolePermission/update",
  async ({ role, access }, { rejectWithValue }) => {
    try {
      const res = await axios.post(API, { role, access });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Fetch all roles
export const fetchRolePermissions = createAsyncThunk(
  "rolePermission/fetchAll",
  async () => {
    const res = await axios.get(API);
    return res.data;
  }
);

const rolePermissionSlice = createSlice({
  name: "rolePermission",
  initialState: {
    roles: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRolePermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRolePermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(updateRolePermission.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.roles.findIndex((r) => r.role === updated.role);
        if (index !== -1) {
          state.roles[index] = updated;
        }
      });
  },
});

export default rolePermissionSlice.reducer;
