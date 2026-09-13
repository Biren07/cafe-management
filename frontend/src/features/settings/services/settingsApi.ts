import { baseApi } from '@/services/baseApi';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { ApiResponse } from '@/types/api';
import { CafeSettings } from '@/types/settings';

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<ApiResponse<CafeSettings>, void>({
      query: () => ({
        url: API_ENDPOINTS.SETTINGS.BASE,
        method: 'GET',
      }),
      providesTags: ['Settings'],
    }),

    updateSettings: builder.mutation<ApiResponse<CafeSettings>, FormData | Partial<CafeSettings>>({
      query: (body) => ({
        url: API_ENDPOINTS.SETTINGS.BASE,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),

    uploadPaymentQr: builder.mutation<ApiResponse<CafeSettings>, FormData>({
      query: (formData) => ({
        url: API_ENDPOINTS.SETTINGS.PAYMENT_QR,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Settings'],
    }),

    deletePaymentQr: builder.mutation<ApiResponse<CafeSettings>, string>({
      query: (provider) => ({
        url: API_ENDPOINTS.SETTINGS.DELETE_PAYMENT_QR(provider),
        method: 'DELETE',
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useUploadPaymentQrMutation,
  useDeletePaymentQrMutation,
} = settingsApi;
