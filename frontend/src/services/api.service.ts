import { apiClient } from '@/lib/axios';
import { ApiResponse } from '@/types/api';

export const apiService = {
  async get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const response = await apiClient.get<ApiResponse<T>>(url, { params });
    return response.data;
  },

  async post<T>(url: string, data?: unknown, config?: object): Promise<ApiResponse<T>> {
    const response = await apiClient.post<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  async put<T>(url: string, data?: unknown, config?: object): Promise<ApiResponse<T>> {
    const response = await apiClient.put<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  async patch<T>(url: string, data?: unknown, config?: object): Promise<ApiResponse<T>> {
    const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  async delete<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const response = await apiClient.delete<ApiResponse<T>>(url, { params });
    return response.data;
  },
};
