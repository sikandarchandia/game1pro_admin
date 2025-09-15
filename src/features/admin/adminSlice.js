// src/api/adminAuthApi.js
import { apiSlice } from "./apiSlice";

export const adminAuthApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginAdmin: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getAdminStats: builder.query({
      query: () => "/stats",
      providesTags: ["AdminStats"],
    }),
  }),
});

export const { useLoginAdminMutation, useGetAdminStatsQuery } = adminAuthApi;
