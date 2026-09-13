import { baseApi } from '@/services/baseApi';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { ApiResponse, PaginatedResponse } from '@/types/api';

export interface Expense {
  _id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  notes?: string;
  recordedBy?: any;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateExpenseInput {
  title: string;
  category: string;
  amount: number;
  date?: string;
  notes?: string;
}

export interface UpdateExpenseInput {
  id: string;
  title?: string;
  category?: string;
  amount?: number;
  date?: string;
  notes?: string;
}

export const expenseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query<ApiResponse<PaginatedResponse<Expense>>, ExpenseQueryParams | void>({
      query: (params) => ({
        url: API_ENDPOINTS.EXPENSES.BASE,
        method: 'GET',
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ _id }) => ({ type: 'Expense' as const, id: _id })),
              { type: 'Expense', id: 'LIST' },
            ]
          : [{ type: 'Expense', id: 'LIST' }],
    }),

    getExpenseById: builder.query<ApiResponse<Expense>, string>({
      query: (id) => ({
        url: API_ENDPOINTS.EXPENSES.BY_ID(id),
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Expense', id }],
    }),

    createExpense: builder.mutation<ApiResponse<Expense>, CreateExpenseInput>({
      query: (body) => ({
        url: API_ENDPOINTS.EXPENSES.BASE,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Expense', id: 'LIST' }, 'Dashboard'],
    }),

    updateExpense: builder.mutation<ApiResponse<Expense>, UpdateExpenseInput>({
      query: ({ id, ...body }) => ({
        url: API_ENDPOINTS.EXPENSES.BY_ID(id),
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Expense', id },
        { type: 'Expense', id: 'LIST' },
        'Dashboard',
      ],
    }),

    deleteExpense: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (id) => ({
        url: API_ENDPOINTS.EXPENSES.BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Expense', id: 'LIST' }, 'Dashboard'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetExpensesQuery,
  useGetExpenseByIdQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} = expenseApi;
