import { baseApi } from '@/services/baseApi';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import {
  Bill,
  BillQueryParams,
  GenerateBillInput,
  UpdateBillStatusInput,
  SplitBillInput,
} from '../types/billing.types';

export const billingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBills: builder.query<ApiResponse<PaginatedResponse<Bill>>, BillQueryParams | void>({
      query: (params) => ({
        url: API_ENDPOINTS.BILLING.BASE,
        method: 'GET',
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ _id }) => ({ type: 'Billing' as const, id: _id })),
              { type: 'Billing', id: 'LIST' },
            ]
          : [{ type: 'Billing', id: 'LIST' }],
    }),

    getBillById: builder.query<ApiResponse<Bill>, string>({
      query: (id) => ({
        url: API_ENDPOINTS.BILLING.BY_ID(id),
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Billing', id }],
    }),

    generateBill: builder.mutation<ApiResponse<Bill>, GenerateBillInput>({
      query: (body) => ({
        url: API_ENDPOINTS.BILLING.BASE + '/generate',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Billing', id: 'LIST' }, 'Order', 'Dashboard'],
    }),

    updateBillStatus: builder.mutation<ApiResponse<Bill>, UpdateBillStatusInput>({
      query: ({ id, status }) => ({
        url: API_ENDPOINTS.BILLING.STATUS(id),
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Billing', id },
        { type: 'Billing', id: 'LIST' },
        'Order',
        'Dashboard',
      ],
    }),

    splitBill: builder.mutation<ApiResponse<Bill>, SplitBillInput>({
      query: ({ id, splitCount, customAmounts }) => ({
        url: API_ENDPOINTS.BILLING.SPLIT(id),
        method: 'POST',
        body: { splitCount, customAmounts },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Billing', id },
        { type: 'Billing', id: 'LIST' },
      ],
    }),

    printInvoice: builder.mutation<ApiResponse<any>, string>({
      query: (id) => ({
        url: API_ENDPOINTS.BILLING.PRINT(id),
        method: 'POST',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBillsQuery,
  useLazyGetBillsQuery,
  useGetBillByIdQuery,
  useGenerateBillMutation,
  useUpdateBillStatusMutation,
  useSplitBillMutation,
  usePrintInvoiceMutation,
} = billingApi;
