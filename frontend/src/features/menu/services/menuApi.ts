import { baseApi } from '@/services/baseApi';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { MenuItem } from '@/types/menu';
import { MenuQueryParams } from '../types/menu.types';

export const menuApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMenuItems: builder.query<ApiResponse<PaginatedResponse<MenuItem>>, MenuQueryParams | void>({
      query: (params) => ({
        url: API_ENDPOINTS.MENU.BASE,
        method: 'GET',
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ _id }) => ({ type: 'Menu' as const, id: _id })),
              { type: 'Menu', id: 'LIST' },
            ]
          : [{ type: 'Menu', id: 'LIST' }],
    }),

    getMenuItemById: builder.query<ApiResponse<MenuItem>, string>({
      query: (id) => ({
        url: API_ENDPOINTS.MENU.BY_ID(id),
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Menu', id }],
    }),

    createMenuItem: builder.mutation<ApiResponse<MenuItem>, FormData>({
      query: (formData) => ({
        url: API_ENDPOINTS.MENU.BASE,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Menu', id: 'LIST' }, 'Category', 'Dashboard'],
    }),

    updateMenuItem: builder.mutation<ApiResponse<MenuItem>, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: API_ENDPOINTS.MENU.BY_ID(id),
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Menu', id },
        { type: 'Menu', id: 'LIST' },
        'Category',
        'Dashboard',
      ],
    }),

    deleteMenuItem: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (id) => ({
        url: API_ENDPOINTS.MENU.BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Menu', id: 'LIST' }, 'Category', 'Dashboard'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMenuItemsQuery,
  useLazyGetMenuItemsQuery,
  useGetMenuItemByIdQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
} = menuApi;
