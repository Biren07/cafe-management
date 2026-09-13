import { baseApi } from '@/services/baseApi';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import {
  InventoryItem,
  InventoryHistory,
  InventoryQueryParams,
  CreateInventoryInput,
  UpdateInventoryInput,
  StockMovementInput,
} from '../types/inventory.types';

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInventoryItems: builder.query<ApiResponse<PaginatedResponse<InventoryItem>>, InventoryQueryParams | void>({
      query: (params) => ({
        url: API_ENDPOINTS.INVENTORY.BASE,
        method: 'GET',
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ _id }) => ({ type: 'Inventory' as const, id: _id })),
              { type: 'Inventory', id: 'LIST' },
            ]
          : [{ type: 'Inventory', id: 'LIST' }],
    }),

    getLowStockItems: builder.query<ApiResponse<PaginatedResponse<InventoryItem>>, InventoryQueryParams | void>({
      query: (params) => ({
        url: API_ENDPOINTS.INVENTORY.LOW_STOCK,
        method: 'GET',
        params: params || {},
      }),
      providesTags: [{ type: 'Inventory', id: 'LOW_STOCK' }],
    }),

    getInventoryItemById: builder.query<ApiResponse<InventoryItem>, string>({
      query: (id) => ({
        url: API_ENDPOINTS.INVENTORY.BY_ID(id),
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Inventory', id }],
    }),

    getItemHistory: builder.query<ApiResponse<{ history: InventoryHistory[] }>, string>({
      query: (id) => ({
        url: API_ENDPOINTS.INVENTORY.HISTORY(id),
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Inventory', id: `HISTORY_${id}` }],
    }),

    createInventoryItem: builder.mutation<ApiResponse<InventoryItem>, CreateInventoryInput>({
      query: (body) => ({
        url: API_ENDPOINTS.INVENTORY.BASE,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Inventory', id: 'LIST' }, { type: 'Inventory', id: 'LOW_STOCK' }, 'Dashboard'],
    }),

    updateInventoryItem: builder.mutation<ApiResponse<InventoryItem>, { id: string; body: UpdateInventoryInput }>({
      query: ({ id, body }) => ({
        url: API_ENDPOINTS.INVENTORY.BY_ID(id),
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Inventory', id },
        { type: 'Inventory', id: 'LIST' },
        { type: 'Inventory', id: 'LOW_STOCK' },
        'Dashboard',
      ],
    }),

    stockIn: builder.mutation<ApiResponse<InventoryItem>, StockMovementInput>({
      query: ({ id, quantity, reason }) => ({
        url: API_ENDPOINTS.INVENTORY.STOCK_IN(id),
        method: 'POST',
        body: { quantity, reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Inventory', id },
        { type: 'Inventory', id: 'LIST' },
        { type: 'Inventory', id: 'LOW_STOCK' },
        { type: 'Inventory', id: `HISTORY_${id}` },
        'Dashboard',
      ],
    }),

    stockOut: builder.mutation<ApiResponse<InventoryItem>, StockMovementInput>({
      query: ({ id, quantity, reason }) => ({
        url: API_ENDPOINTS.INVENTORY.STOCK_OUT(id),
        method: 'POST',
        body: { quantity, reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Inventory', id },
        { type: 'Inventory', id: 'LIST' },
        { type: 'Inventory', id: 'LOW_STOCK' },
        { type: 'Inventory', id: `HISTORY_${id}` },
        'Dashboard',
      ],
    }),

    deleteInventoryItem: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (id) => ({
        url: API_ENDPOINTS.INVENTORY.BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Inventory', id: 'LIST' }, { type: 'Inventory', id: 'LOW_STOCK' }, 'Dashboard'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetInventoryItemsQuery,
  useLazyGetInventoryItemsQuery,
  useGetLowStockItemsQuery,
  useGetInventoryItemByIdQuery,
  useGetItemHistoryQuery,
  useCreateInventoryItemMutation,
  useUpdateInventoryItemMutation,
  useStockInMutation,
  useStockOutMutation,
  useDeleteInventoryItemMutation,
} = inventoryApi;
