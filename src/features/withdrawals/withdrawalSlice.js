// src/features/withdrawals/withdrawalSlice.js
import { apiSlice } from "../../api/apiSlice";

export const withdrawalApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllWithdrawals: builder.query({
      query: () => "/admin/withdrawals",
      providesTags: ["Withdrawals"],
    }),
    getWithdrawalById: builder.query({
      query: (id) => `/admin/withdrawals/${id}`,
      providesTags: (result, error, id) => [{ type: "Withdrawals", id }],
    }),
    updateWithdrawalStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/withdrawals/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Withdrawals"],
    }),
    deleteWithdrawal: builder.mutation({
      query: (id) => ({
        url: `/admin/withdrawals/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Withdrawals"],
    }),
  }),
});

export const {
  useGetAllWithdrawalsQuery,
  useGetWithdrawalByIdQuery,
  useUpdateWithdrawalStatusMutation,
  useDeleteWithdrawalMutation,
} = withdrawalApi;
