// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import leadsReducer from "../slices/leadSlice";
import crmUsersReducer from "../slices/crmuserSlice";
import marketInsightsReducer from "../slices/marketInsightSlice";
import marketPhasesReducer from "../slices/marketPhaseSlice";
import marketTrendsReducer from "../slices/marketTrendSlice";
import researchReportsReducer from "../slices/researchReportSlice";
import vixReducer from "../slices/vixSlice";
import globalMarketReducer from "../slices/globalMarketSlice";

export const store = configureStore({
  reducer: {
    leads: leadsReducer,
    crmUsers: crmUsersReducer,
    marketInsights: marketInsightsReducer,
    marketPhases: marketPhasesReducer,
    marketTrends: marketTrendsReducer,
    researchReports: researchReportsReducer,
    vix: vixReducer,
    globalMarket: globalMarketReducer,
  },
});
