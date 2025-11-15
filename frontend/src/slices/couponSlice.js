// src/redux/slices/couponSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN;

/* ------------------------------------------------------------------
   ASYNC THUNKS
------------------------------------------------------------------ */

// ✅ Fetch all coupons
export const fetchCoupons = createAsyncThunk("coupons/fetchCoupons", async (_, thunkAPI) => {
  try {
    const response = await fetch(`${API_URL}/api/coupons/all`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch coupons");

    const data = await response.json();
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// ✅ Create coupon
export const createCoupon = createAsyncThunk("coupons/createCoupon", async (couponData, thunkAPI) => {
  try {
    const response = await fetch(`${API_URL}/api/coupons/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      body: JSON.stringify(couponData),
    });

    if (!response.ok) throw new Error("Failed to create coupon");

    const data = await response.json();
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// ✅ Delete coupon
export const deleteCoupon = createAsyncThunk("coupons/deleteCoupon", async (id, thunkAPI) => {
  try {
    const response = await fetch(`${API_URL}/api/coupons/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
    });

    if (!response.ok) throw new Error("Failed to delete coupon");

    return id; // return deleted ID
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

/* ------------------------------------------------------------------
   SLICE
------------------------------------------------------------------ */

const couponSlice = createSlice({
  name: "coupons",
  initialState: {
    coupons: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      /* FETCH */
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload || [];
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      /* CREATE */
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons.push(action.payload);
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      /* DELETE */
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.coupons = state.coupons.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export default couponSlice.reducer;
