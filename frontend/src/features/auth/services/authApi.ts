import { baseApi } from '@/services/baseApi';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { ApiResponse } from '@/types/api';
import { User } from '@/types/user';
import {
  LoginRequest,
  AuthResponseData,
  RefreshTokenRequest,
  RefreshTokenResponseData,
  ChangePasswordRequest,
} from '../types/auth.types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<AuthResponseData>, LoginRequest>({
      query: (credentials) => ({
        url: credentials.isOwnerLogin
          ? API_ENDPOINTS.AUTH.OWNER_LOGIN
          : API_ENDPOINTS.AUTH.LOGIN,
        method: 'POST',
        body: {
          email: credentials.email,
          password: credentials.password,
        },
      }),
      invalidatesTags: ['User', 'Dashboard'],
    }),

    refreshToken: builder.mutation<ApiResponse<RefreshTokenResponseData>, RefreshTokenRequest>({
      query: (body) => ({
        url: API_ENDPOINTS.AUTH.REFRESH_TOKEN,
        method: 'POST',
        body,
      }),
    }),

    logout: builder.mutation<ApiResponse<{ message: string }>, void>({
      query: () => ({
        url: API_ENDPOINTS.AUTH.LOGOUT,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    getProfile: builder.query<ApiResponse<User>, void>({
      query: () => ({
        url: API_ENDPOINTS.AUTH.PROFILE,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    changePassword: builder.mutation<ApiResponse<{ message: string }>, ChangePasswordRequest>({
      query: (body) => ({
        url: API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useChangePasswordMutation,
} = authApi;
