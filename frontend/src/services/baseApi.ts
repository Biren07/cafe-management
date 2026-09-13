import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { SITE_CONFIG } from '@/constants/site-config';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { authStorage } from '@/utils/auth-storage';
import { setCredentials, logout } from '@/store/slices/authSlice';
import { ApiResponse } from '@/types/api';
import { RefreshTokenResponseData } from '@/features/auth/types/auth.types';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: SITE_CONFIG.apiUrl,
  prepareHeaders: (headers) => {
    const token = authStorage.getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = authStorage.getRefreshToken();
    if (refreshToken) {
      // Attempt to refresh the access token
      const refreshResult = await rawBaseQuery(
        {
          url: API_ENDPOINTS.AUTH.REFRESH_TOKEN,
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const response = refreshResult.data as ApiResponse<RefreshTokenResponseData>;
        const data = response.data;
        const newAccessToken = data?.accessToken;
        const newRefreshToken = data?.refreshToken || refreshToken;

        if (newAccessToken) {
          const currentUser = authStorage.getUser() as any;
          api.dispatch(
            setCredentials({
              user: currentUser,
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            })
          );
          // Retry original request with new token
          result = await rawBaseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } else {
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Category',
    'Menu',
    'Order',
    'Payment',
    'Billing',
    'Inventory',
    'Employee',
    'Table',
    'Dashboard',
    'Expense',
    'Settings',
  ],
  endpoints: () => ({}),
});
