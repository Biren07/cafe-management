'use client';

import { Employee, EmployeeStatus } from '../types/employee.types';
import { Users, UserCheck, CalendarX, DollarSign } from 'lucide-react';

interface EmployeeStatsBarProps {
  employees: Employee[];
  selectedStatus?: EmployeeStatus | '';
  onSelectStatus?: (status: EmployeeStatus | '') => void;
}

export function EmployeeStatsBar({
  employees,
  selectedStatus,
  onSelectStatus,
}: EmployeeStatsBarProps) {
  const totalCount = employees.length;
  const activeCount = employees.filter((e) => e.status === 'ACTIVE').length;
  const onLeaveCount = employees.filter((e) => e.status === 'ON_LEAVE').length;
  const totalPayroll = employees
    .filter((e) => e.status === 'ACTIVE' || e.status === 'ON_LEAVE')
    .reduce((acc, e) => acc + (e.salary || 0), 0);

  const stats = [
    {
      id: '' as const,
      label: 'Total Staff',
      count: totalCount,
      subtext: 'Registered workforce',
      icon: Users,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      activeBorder: 'ring-2 ring-amber-500',
    },
    {
      id: 'ACTIVE' as const,
      label: 'Active Staff',
      count: activeCount,
      subtext: 'Currently working',
      icon: UserCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      activeBorder: 'ring-2 ring-emerald-500',
    },
    {
      id: 'ON_LEAVE' as const,
      label: 'Staff On Leave',
      count: onLeaveCount,
      subtext: 'Approved leave',
      icon: CalendarX,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      activeBorder: 'ring-2 ring-purple-500',
    },
    {
      id: '' as const,
      label: 'Monthly Payroll',
      count: `Rs. ${totalPayroll.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtext: 'Est. active salaries',
      icon: DollarSign,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
      activeBorder: 'ring-2 ring-sky-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        const isSelected = stat.id !== '' && selectedStatus === stat.id;
        return (
          <button
            key={idx}
            type="button"
            onClick={() => stat.id !== undefined && onSelectStatus?.(stat.id)}
            disabled={stat.id === ''}
            className={`flex items-center space-x-3.5 p-3.5 rounded-2xl border transition-all duration-200 text-left cursor-pointer hover:scale-[1.02] ${
              stat.bg
            } ${stat.border} ${isSelected ? `${stat.activeBorder} shadow-lg shadow-black/40` : 'hover:border-slate-600'}`}
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900/80 border border-slate-800 ${stat.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-wide uppercase text-slate-400">{stat.label}</p>
              <span className={`text-xl font-extrabold font-heading ${stat.color}`}>{stat.count}</span>
              <p className="text-[10px] text-slate-400 mt-0.5">{stat.subtext}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
