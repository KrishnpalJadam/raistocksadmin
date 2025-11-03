import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// ✅ Fetch all subscription plans
export const fetchPlansAsync = createAsyncThunk(
  "subscriptions/fetchPlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/plan-subscriptions"
      );
      return response.data.data; // API wraps plans in `data`
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Create Subscription Async
export const createSubscriptionAsync = createAsyncThunk(
  "subscriptions/create",
  async (subscriptionData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/plan-subscriptions",
        subscriptionData
      );
      return response.data.data; // return the created plan
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Delete Subscription Async
export const deleteSubscriptionAsync = createAsyncThunk(
  "subscriptions/delete",
  async (planId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/plan-subscriptions/${planId}`
      );
      return planId; // return the deleted plan's id
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateSubscriptionAsync = createAsyncThunk(
  "subscriptions/updateSubscription",
  async ({ id, planData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/plan-subscriptions/${id}`,
        planData
      );
      toast.success("Subscription updated successfully!");
      return response.data.data;
    } catch (error) {
      toast.error("Failed to update subscription!");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const subscriptionSlice = createSlice({
  name: "subscriptions",
  initialState: { plans: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch plans
      .addCase(fetchPlansAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPlansAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.plans = action.payload;
      })
      .addCase(fetchPlansAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Create subscription
      .addCase(createSubscriptionAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createSubscriptionAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.plans.push(action.payload);
      })
      .addCase(createSubscriptionAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete subscription
      .addCase(deleteSubscriptionAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteSubscriptionAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.plans = state.plans.filter((plan) => plan._id !== action.payload);
        toast.success("Subscription deleted successfully!");
      })
      .addCase(deleteSubscriptionAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update subscription
      .addCase(updateSubscriptionAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateSubscriptionAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.plans.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.plans[index] = action.payload;
      })
      .addCase(updateSubscriptionAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default subscriptionSlice.reducer;
