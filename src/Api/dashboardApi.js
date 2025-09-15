// src/api/dashboardApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/admin" }), // your backend url
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/dashboard",
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
