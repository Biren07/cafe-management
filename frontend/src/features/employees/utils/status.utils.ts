import { EmployeeShift, EmployeeStatus, AttendanceStatus } from '../types/employee.types';
import { Sun, Sunset, Moon, Clock, Briefcase, CheckCircle2, UserX, AlertTriangle, CalendarX } from 'lucide-react';

export interface ShiftConfig {
  label: string;
  colorClass: string;
  badgeClass: string;
  icon: typeof Sun;
}

export const EMPLOYEE_SHIFT_CONFIG: Record<EmployeeShift, ShiftConfig> = {
  MORNING: {
    label: 'Morning Shift',
    colorClass: 'text-amber-400',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    icon: Sun,
  },
  EVENING: {
    label: 'Evening Shift',
    colorClass: 'text-sky-400',
    badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    icon: Sunset,
  },
  NIGHT: {
    label: 'Night Shift',
    colorClass: 'text-purple-400',
    badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    icon: Moon,
  },
  FULL_TIME: {
    label: 'Full Time',
    colorClass: 'text-emerald-400',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    icon: Clock,
  },
  PART_TIME: {
    label: 'Part Time',
    colorClass: 'text-slate-300',
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
    icon: Briefcase,
  },
};

export interface StatusConfig {
  label: string;
  colorClass: string;
  badgeClass: string;
}

export const EMPLOYEE_STATUS_CONFIG: Record<EmployeeStatus, StatusConfig> = {
  ACTIVE: {
    label: 'Active Staff',
    colorClass: 'text-emerald-400',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
  ON_LEAVE: {
    label: 'On Leave',
    colorClass: 'text-amber-400',
    badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  TERMINATED: {
    label: 'Terminated',
    colorClass: 'text-rose-400',
    badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  },
  RESIGNED: {
    label: 'Resigned',
    colorClass: 'text-slate-400',
    badgeClass: 'bg-slate-800 text-slate-400 border-slate-700',
  },
};

export interface AttendanceConfig {
  label: string;
  colorClass: string;
  badgeClass: string;
}

export const ATTENDANCE_STATUS_CONFIG: Record<AttendanceStatus, AttendanceConfig> = {
  PRESENT: {
    label: 'Present',
    colorClass: 'text-emerald-400',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
  ABSENT: {
    label: 'Absent',
    colorClass: 'text-rose-400',
    badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  },
  LATE: {
    label: 'Late Arrival',
    colorClass: 'text-amber-400',
    badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  HALF_DAY: {
    label: 'Half Day',
    colorClass: 'text-sky-400',
    badgeClass: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  },
  ON_LEAVE: {
    label: 'On Leave',
    colorClass: 'text-purple-400',
    badgeClass: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  },
};
