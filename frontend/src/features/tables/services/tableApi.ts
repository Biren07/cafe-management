import { baseApi } from '@/services/baseApi';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import {
  DiningTable,
  TableQueryParams,
  CreateTableInput,
  UpdateTableInput,
  UpdateTableStatusInput,
} from '../types/table.types';

export const tableApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTables: builder.query<ApiResponse<PaginatedResponse<DiningTable>>, TableQueryParams | void>({
      query: (params) => ({
        url: API_ENDPOINTS.TABLES.BASE,
        method: 'GET',
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ _id }) => ({ type: 'Table' as const, id: _id })),
              { type: 'Table', id: 'LIST' },
            ]
          : [{ type: 'Table', id: 'LIST' }],
    }),

    getTableById: builder.query<ApiResponse<DiningTable>, string>({
      query: (id) => ({
        url: API_ENDPOINTS.TABLES.BY_ID(id),
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Table', id }],
    }),

    createTable: builder.mutation<ApiResponse<DiningTable>, CreateTableInput>({
      query: (body) => ({
        url: API_ENDPOINTS.TABLES.BASE,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Table', id: 'LIST' }, 'Dashboard'],
    }),

    updateTable: builder.mutation<ApiResponse<DiningTable>, { id: string; body: UpdateTableInput }>({
      query: ({ id, body }) => ({
        url: API_ENDPOINTS.TABLES.BY_ID(id),
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Table', id },
        { type: 'Table', id: 'LIST' },
        'Dashboard',
      ],
    }),

    updateTableStatus: builder.mutation<ApiResponse<DiningTable>, UpdateTableStatusInput>({
      query: ({ id, status }) => ({
        url: API_ENDPOINTS.TABLES.STATUS(id),
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Table', id },
        { type: 'Table', id: 'LIST' },
        'Dashboard',
      ],
    }),

    deleteTable: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (id) => ({
        url: API_ENDPOINTS.TABLES.BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Table', id: 'LIST' }, 'Dashboard'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTablesQuery,
  useLazyGetTablesQuery,
  useGetTableByIdQuery,
  useCreateTableMutation,
  useUpdateTableMutation,
  useUpdateTableStatusMutation,
  useDeleteTableMutation,
} = tableApi;
