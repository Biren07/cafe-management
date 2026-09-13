import { User } from './user';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'ON_LEAVE';
export type EmployeeShift = 'MORNING' | 'EVENING' | 'NIGHT' | 'FULL_TIME' | 'PART_TIME';
export type EmployeeStatus = 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED' | 'RESIGNED';

export interface AttendanceRecord {
  date: string;
  status: AttendanceStatus;
  checkIn?: string | null;
  checkOut?: string | null;
  notes?: string;
  recordedBy?: User | string | null;
  createdAt: string;
}

export interface Employee {
  _id: string;
  employeeId: string;
  user?: User | string | null;
  fullName: string;
  email: string;
  phone?: string;
  position: string;
  salary: number;
  shift: EmployeeShift;
  status: EmployeeStatus;
  attendance?: AttendanceRecord[];
  createdAt: string;
  updatedAt: string;
}
