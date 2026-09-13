import { baseApi } from '@/services/baseApi';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import {
  Employee,
  AttendanceRecord,
  EmployeeQueryParams,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  RecordAttendanceInput,
} from '../types/employee.types';

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<ApiResponse<PaginatedResponse<Employee>>, EmployeeQueryParams | void>({
      query: (params) => ({
        url: API_ENDPOINTS.EMPLOYEES.BASE,
        method: 'GET',
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ _id }) => ({ type: 'Employee' as const, id: _id })),
              { type: 'Employee', id: 'LIST' },
            ]
          : [{ type: 'Employee', id: 'LIST' }],
    }),

    getEmployeeById: builder.query<ApiResponse<Employee>, string>({
      query: (id) => ({
        url: API_ENDPOINTS.EMPLOYEES.BY_ID(id),
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Employee', id }],
    }),

    createEmployee: builder.mutation<ApiResponse<Employee>, CreateEmployeeInput>({
      query: (body) => ({
        url: API_ENDPOINTS.EMPLOYEES.BASE,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Employee', id: 'LIST' }, 'Dashboard'],
    }),

    updateEmployee: builder.mutation<ApiResponse<Employee>, { id: string; body: UpdateEmployeeInput }>({
      query: ({ id, body }) => ({
        url: API_ENDPOINTS.EMPLOYEES.BY_ID(id),
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Employee', id },
        { type: 'Employee', id: 'LIST' },
        'Dashboard',
      ],
    }),

    deleteEmployee: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (id) => ({
        url: API_ENDPOINTS.EMPLOYEES.BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Employee', id: 'LIST' }, 'Dashboard'],
    }),

    recordAttendance: builder.mutation<ApiResponse<Employee>, RecordAttendanceInput>({
      query: ({ id, ...body }) => ({
        url: API_ENDPOINTS.EMPLOYEES.ATTENDANCE(id),
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Employee', id },
        { type: 'Employee', id: 'LIST' },
        { type: 'Employee', id: `ATTENDANCE_${id}` },
        'Dashboard',
      ],
    }),

    getEmployeeAttendance: builder.query<ApiResponse<{ attendance: AttendanceRecord[] }>, string>({
      query: (id) => ({
        url: API_ENDPOINTS.EMPLOYEES.ATTENDANCE(id),
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Employee', id: `ATTENDANCE_${id}` }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetEmployeesQuery,
  useLazyGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useRecordAttendanceMutation,
  useGetEmployeeAttendanceQuery,
} = employeeApi;
