import { baseApi } from '@/services/baseApi';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { User, UserRole } from '@/types/user';

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  status?: string;
}

export interface CreateStaffInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}

export interface UpdateStaffInput {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: 'MANAGER' | 'CASHIER';
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<ApiResponse<PaginatedResponse<User>>, UserQueryParams | void>({
      query: (params) => ({
        url: API_ENDPOINTS.USERS.BASE,
        method: 'GET',
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ _id }) => ({ type: 'User' as const, id: _id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    getUserById: builder.query<ApiResponse<User>, string>({
      query: (id) => ({
        url: API_ENDPOINTS.USERS.BY_ID(id),
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    createStaff: builder.mutation<ApiResponse<User>, CreateStaffInput>({
      query: (body) => ({
        url: API_ENDPOINTS.USERS.BASE,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    updateStaff: builder.mutation<ApiResponse<User>, UpdateStaffInput>({
      query: ({ id, ...body }) => ({
        url: API_ENDPOINTS.USERS.BY_ID(id),
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),

    deactivateStaff: builder.mutation<ApiResponse<User>, string>({
      query: (id) => ({
        url: API_ENDPOINTS.USERS.DEACTIVATE(id),
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),

    deleteStaff: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (id) => ({
        url: API_ENDPOINTS.USERS.BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeactivateStaffMutation,
  useDeleteStaffMutation,
} = userApi;
