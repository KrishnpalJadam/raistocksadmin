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
      return data.data;
      

    //   // handle any shape of response
    //   if (Array.isArray(data)) return data;
    //   if (Array.isArray(data.data)) return data.data;
    //   if (Array.isArray(data.users)) return data.users;

   
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);


export const addUser = createAsyncThunk(
  "crmUsers/addUser",
  async (userData, thunkAPI) => {
    try {
console.log("📦 Sending user data:", userData);

      const res = await fetch(`${API_URL}/api/admin/user-management`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(userData),
      });

      const text = await res.text(); // read raw text (in case backend doesn’t send JSON)
      console.log("🧾 Raw response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      if (!res.ok) {
        throw new Error(data.message || `Failed to add CRM user: ${res.status}`);
      }

      return data.data;
    } catch (err) {
      console.error("❌ Error adding user:", err);
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
  reducers: {
    deleteUser: (state, action) => {
      state.users = state.users.filter((user) => user._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload; // ✅ this now receives correct data
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.unshift(action.payload);
      });
  },
});

export const { deleteUser } = crmUserSlice.actions;
export default crmUserSlice.reducer;
