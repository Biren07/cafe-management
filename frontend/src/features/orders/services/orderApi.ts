import { baseApi } from '@/services/baseApi';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import {
  Order,
  OrderQueryParams,
  CreateOrderInput,
  UpdateOrderStatusInput,
  UpdateOrderInput,
} from '../types/order.types';

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<ApiResponse<PaginatedResponse<Order>>, OrderQueryParams | void>({
      query: (params) => ({
        url: API_ENDPOINTS.ORDERS.BASE,
        method: 'GET',
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ _id }) => ({ type: 'Order' as const, id: _id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),

    getOrderById: builder.query<ApiResponse<Order>, string>({
      query: (id) => ({
        url: API_ENDPOINTS.ORDERS.BY_ID(id),
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),

    createOrder: builder.mutation<ApiResponse<Order>, CreateOrderInput>({
      query: (body) => ({
        url: API_ENDPOINTS.ORDERS.BASE,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }, 'Table', 'Billing', 'Dashboard'],
    }),

    updateOrderStatus: builder.mutation<ApiResponse<Order>, UpdateOrderStatusInput>({
      query: ({ id, status }) => ({
        url: API_ENDPOINTS.ORDERS.STATUS(id),
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
        'Table',
        'Billing',
        'Dashboard',
      ],
    }),

    updateOrder: builder.mutation<ApiResponse<Order>, { id: string; body: UpdateOrderInput }>({
      query: ({ id, body }) => ({
        url: API_ENDPOINTS.ORDERS.BY_ID(id),
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
        'Table',
        'Billing',
        'Dashboard',
      ],
    }),

    deleteOrder: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (id) => ({
        url: API_ENDPOINTS.ORDERS.BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }, 'Table', 'Billing', 'Dashboard'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrdersQuery,
  useLazyGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
