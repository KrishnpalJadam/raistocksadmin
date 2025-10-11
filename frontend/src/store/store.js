// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import leadsReducer from "../slices/leadSlice";
import crmUsersReducer from "../slices/crmuserSlice";
import marketInsightsReducer from "../slices/marketInsightSlice";
import marketPhasesReducer from "../slices/marketPhaseSlice";
import marketTrendsReducer from "../slices/marketTrendSlice";

export const store = configureStore({
  reducer: {
    leads: leadsReducer,
    crmUsers: crmUsersReducer,
    marketInsights: marketInsightsReducer,
    marketPhases: marketPhasesReducer,
    marketTrends: marketTrendsReducer,
  },
});
