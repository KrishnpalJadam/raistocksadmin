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
import tradeReducer from "../slices/tradeSlice";
import tradeActionReducer from "../slices/tradeActionsSlice";
import supportReducer from "../slices/supportSlice";
import clientReducer from "../slices/clientSlice";
import marketSetupReducer from "../slices/marketSetupSlice";
import subscriptionReducer from "../slices/subscriptionSlice";
import tradeStrategyReducer from "../slices/tradeStrategySlice";
import paymentReducer from "../slices/paymentSlice";
import dashboardReducer from "../slices/dashboardSlice";

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
    trades: tradeReducer,
    tradeActions: tradeActionReducer,
    support: supportReducer,
    clients: clientReducer,
    marketSetup: marketSetupReducer,
    subscriptions: subscriptionReducer,
    payments: paymentReducer,
     tradeStrategies: tradeStrategyReducer,
    dashboard: dashboardReducer,
  },
});
