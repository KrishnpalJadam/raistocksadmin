import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TOKEN = import.meta.env.VITE_ADMIN_TOKEN;

// ✅ Fetch all CRM users
export const fetchUsers = createAsyncThunk(
  "crmUsers/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/user-management`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      if (!res.ok) throw new Error(`Failed to fetch CRM users: ${res.status}`);
      const data = await res.json();

      // Return array of users including status
      return Array.isArray(data.data) ? data.data : [];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// ✅ Add new CRM user
export const addUser = createAsyncThunk(
  "crmUsers/addUser",
  async (userData, thunkAPI) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/user-management`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(userData),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      if (!res.ok) {
        throw new Error(
          data.message || `Failed to add CRM user: ${res.status}`
        );
      }

      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// ✅ Update user (Edit)
export const updateUser = createAsyncThunk(
  "crmUsers/updateUser",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/user-management/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update user");

      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// ---- Just ADDED NEW update CRM USEr
// ✅ Update CRM User (only name, email, and role)
export const updateCRMUser = createAsyncThunk(
  "crmUsers/updateCRMUser",
  async ({ id, name, email, role }, thunkAPI) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/user-management/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({ name, email, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update CRM user");
      }
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ✅ Toggle Status (Suspend/Activate)
export const toggleUserStatus = createAsyncThunk(
  "crmUsers/toggleUserStatus",
  async ({ id, currentStatus }, thunkAPI) => {
    try {
      const newStatus = currentStatus === "Active" ? "Suspended" : "Active";

      const res = await fetch(`${API_URL}/api/admin/user-management/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to toggle status");

      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// ✅ Delete user (from backend)
export const deleteUserAsync = createAsyncThunk(
  "crmUsers/deleteUserAsync",
  async (id, thunkAPI) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/user-management/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      if (!res.ok) throw new Error(`Failed to delete user: ${res.status}`);

      return id; // return userId to remove from state
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const crmUserSlice = createSlice({
  name: "crmUsers",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 📦 Fetch
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ➕ Add
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.unshift(action.payload);
      })

      // ✏️ Update (edit)
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (u) => u._id === action.payload._id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })

      // 🔄 Toggle status
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (u) => u._id === action.payload._id
        );
        if (index !== -1) {
          state.users[index].status = action.payload.status;
        }
      })

      // 🗑️ Delete
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      })

      .addCase(updateCRMUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(updateCRMUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCRMUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default crmUserSlice.reducer;
