import { baseApi } from '@/services/baseApi';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { ApiResponse } from '@/types/api';
import {
  PushSubscriptionData,
  NotificationPreferencesResponse,
  NotificationCategoryPreferences,
  TestPushPayload,
} from '../types/pushNotification.types';

export const pushNotificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotificationPreferences: builder.query<ApiResponse<NotificationPreferencesResponse>, void>({
      query: () => ({
        url: API_ENDPOINTS.NOTIFICATIONS.PREFERENCES,
        method: 'GET',
      }),
      providesTags: ['Settings'],
    }),

    updateNotificationPreferences: builder.mutation<
      ApiResponse<NotificationPreferencesResponse>,
      { isPushEnabled: boolean; categories: NotificationCategoryPreferences }
    >({
      query: (body) => ({
        url: API_ENDPOINTS.NOTIFICATIONS.PREFERENCES,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),

    subscribePush: builder.mutation<ApiResponse<{ message: string }>, PushSubscriptionData>({
      query: (body) => ({
        url: API_ENDPOINTS.NOTIFICATIONS.SUBSCRIBE,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),

    unsubscribePush: builder.mutation<ApiResponse<{ message: string }>, { endpoint: string }>({
      query: (body) => ({
        url: API_ENDPOINTS.NOTIFICATIONS.UNSUBSCRIBE,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),

    sendTestNotification: builder.mutation<ApiResponse<{ message: string }>, TestPushPayload | void>({
      query: (body) => ({
        url: API_ENDPOINTS.NOTIFICATIONS.TEST,
        method: 'POST',
        body: body || {},
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
  useSubscribePushMutation,
  useUnsubscribePushMutation,
  useSendTestNotificationMutation,
} = pushNotificationApi;
