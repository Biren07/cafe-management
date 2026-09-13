import {
  Employee,
  EmployeeShift,
  EmployeeStatus,
  AttendanceStatus,
  AttendanceRecord,
} from '@/types/employee';

export type { Employee, EmployeeShift, EmployeeStatus, AttendanceStatus, AttendanceRecord };

export interface EmployeeQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  position?: string;
  shift?: EmployeeShift;
  status?: EmployeeStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateEmployeeInput {
  fullName: string;
  email: string;
  phone?: string;
  position: string;
  salary: number;
  shift?: EmployeeShift;
  status?: EmployeeStatus;
  user?: string | null;
  createLoginAccount?: boolean;
  role?: 'MANAGER' | 'CASHIER';
  password?: string;
}

export interface UpdateEmployeeInput {
  fullName?: string;
  email?: string;
  phone?: string;
  position?: string;
  salary?: number;
  shift?: EmployeeShift;
  status?: EmployeeStatus;
  user?: string | null;
}

export interface RecordAttendanceInput {
  id: string;
  date?: string;
  status?: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  notes?: string;
}
