import { baseApi } from '@/services/baseApi';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { ApiResponse } from '@/types/api';
import {
  DashboardAnalyticsResponse,
  SummaryCardsData,
  WeeklySalesPoint,
  MonthlyRevenuePoint,
  TopSellingMenuItem,
} from '@/types/dashboard';
import { Order } from '@/types/order';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query<ApiResponse<DashboardAnalyticsResponse>, void>({
      query: () => ({
        url: API_ENDPOINTS.DASHBOARD.ANALYTICS,
        method: 'GET',
      }),
      providesTags: ['Dashboard', 'Order', 'Inventory', 'Table'],
    }),

    getDashboardSummary: builder.query<ApiResponse<SummaryCardsData>, void>({
      query: () => ({
        url: API_ENDPOINTS.DASHBOARD.SUMMARY,
        method: 'GET',
      }),
      providesTags: ['Dashboard'],
    }),

    getWeeklySales: builder.query<ApiResponse<WeeklySalesPoint[]>, void>({
      query: () => ({
        url: API_ENDPOINTS.DASHBOARD.WEEKLY_SALES,
        method: 'GET',
      }),
      providesTags: ['Dashboard'],
    }),

    getMonthlyRevenue: builder.query<ApiResponse<MonthlyRevenuePoint[]>, void>({
      query: () => ({
        url: API_ENDPOINTS.DASHBOARD.MONTHLY_REVENUE,
        method: 'GET',
      }),
      providesTags: ['Dashboard'],
    }),

    getTopSelling: builder.query<ApiResponse<TopSellingMenuItem[]>, void>({
      query: () => ({
        url: API_ENDPOINTS.DASHBOARD.TOP_SELLING,
        method: 'GET',
      }),
      providesTags: ['Dashboard'],
    }),

    getRecentOrders: builder.query<ApiResponse<Order[]>, void>({
      query: () => ({
        url: API_ENDPOINTS.DASHBOARD.RECENT_ORDERS,
        method: 'GET',
      }),
      providesTags: ['Dashboard', 'Order'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDashboardAnalyticsQuery,
  useLazyGetDashboardAnalyticsQuery,
  useGetDashboardSummaryQuery,
  useGetWeeklySalesQuery,
  useGetMonthlyRevenueQuery,
  useGetTopSellingQuery,
  useGetRecentOrdersQuery,
} = dashboardApi;
