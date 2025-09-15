import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";        // your old slice
import { dashboardApi } from "../api/dashboardApi"; // named import matches export

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer, // add dashboardApi reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)      // keep old middleware
      .concat(dashboardApi.middleware)  // add dashboardApi middleware
});
