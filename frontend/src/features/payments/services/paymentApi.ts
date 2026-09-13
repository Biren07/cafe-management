import { baseApi } from '@/services/baseApi';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import {
  Payment,
  PaymentQueryParams,
  ProcessPaymentInput,
  UpdatePaymentStatusInput,
} from '../types/payment.types';

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<ApiResponse<PaginatedResponse<Payment>>, PaymentQueryParams | void>({
      query: (params) => ({
        url: API_ENDPOINTS.PAYMENTS.BASE,
        method: 'GET',
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ _id }) => ({ type: 'Payment' as const, id: _id })),
              { type: 'Payment', id: 'LIST' },
            ]
          : [{ type: 'Payment', id: 'LIST' }],
    }),

    getPaymentById: builder.query<ApiResponse<Payment>, string>({
      query: (id) => ({
        url: API_ENDPOINTS.PAYMENTS.BY_ID(id),
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Payment', id }],
    }),

    processPayment: builder.mutation<ApiResponse<Payment>, ProcessPaymentInput>({
      query: (body) => ({
        url: API_ENDPOINTS.PAYMENTS.BASE,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Payment', id: 'LIST' }, 'Order', 'Billing', 'Dashboard'],
    }),

    updatePaymentStatus: builder.mutation<ApiResponse<Payment>, UpdatePaymentStatusInput>({
      query: ({ id, paymentStatus }) => ({
        url: API_ENDPOINTS.PAYMENTS.STATUS(id),
        method: 'PATCH',
        body: { paymentStatus },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Payment', id },
        { type: 'Payment', id: 'LIST' },
        'Order',
        'Billing',
        'Dashboard',
      ],
    }),

    deletePayment: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (id) => ({
        url: API_ENDPOINTS.PAYMENTS.BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Payment', id: 'LIST' }, 'Order', 'Billing', 'Dashboard'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPaymentsQuery,
  useLazyGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useProcessPaymentMutation,
  useUpdatePaymentStatusMutation,
  useDeletePaymentMutation,
} = paymentApi;
