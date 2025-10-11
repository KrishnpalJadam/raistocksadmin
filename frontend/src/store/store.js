// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import leadsReducer from '../slices/leadSlice';
import crmUsersReducer from '../slices/crmuserSlice';  
export const store = configureStore({
  reducer: {
    leads: leadsReducer,
    crmUsers: crmUsersReducer,  
  },
});
