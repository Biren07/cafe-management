import { baseApi } from '@/services/baseApi';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { Category } from '@/types/category';
import { CategoryQueryParams } from '../types/category.types';

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<ApiResponse<PaginatedResponse<Category>>, CategoryQueryParams | void>({
      query: (params) => ({
        url: API_ENDPOINTS.CATEGORIES.BASE,
        method: 'GET',
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ _id }) => ({ type: 'Category' as const, id: _id })),
              { type: 'Category', id: 'LIST' },
            ]
          : [{ type: 'Category', id: 'LIST' }],
    }),

    getCategoryById: builder.query<ApiResponse<Category>, string>({
      query: (id) => ({
        url: API_ENDPOINTS.CATEGORIES.BY_ID(id),
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),

    createCategory: builder.mutation<ApiResponse<Category>, FormData>({
      query: (formData) => ({
        url: API_ENDPOINTS.CATEGORIES.BASE,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }, 'Menu'],
    }),

    updateCategory: builder.mutation<ApiResponse<Category>, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: API_ENDPOINTS.CATEGORIES.BY_ID(id),
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
        'Menu',
      ],
    }),

    deleteCategory: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (id) => ({
        url: API_ENDPOINTS.CATEGORIES.BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }, 'Menu'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoriesQuery,
  useLazyGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
