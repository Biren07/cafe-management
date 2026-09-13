'use client';

import { DiningTable, TableStatus } from '../types/table.types';
import { CheckCircle2, UserCheck, Sparkles, BookmarkCheck, Armchair } from 'lucide-react';

interface TableStatsBarProps {
  tables: DiningTable[];
  selectedStatus?: TableStatus | '';
  onSelectStatus?: (status: TableStatus | '') => void;
}

export function TableStatsBar({ tables, selectedStatus, onSelectStatus }: TableStatsBarProps) {
  const total = tables.length;
  const availableCount = tables.filter((t) => t.status === 'AVAILABLE').length;
  const occupiedCount = tables.filter((t) => t.status === 'OCCUPIED').length;
  const cleaningCount = tables.filter((t) => t.status === 'CLEANING').length;
  const reservedCount = tables.filter((t) => t.status === 'RESERVED').length;

  const stats = [
    {
      id: '' as const,
      label: 'Total Tables',
      count: total,
      icon: Armchair,
      color: 'text-slate-200',
      bg: 'bg-slate-800/50',
      border: 'border-slate-700/60',
      activeBorder: 'ring-2 ring-slate-400',
    },
    {
      id: 'AVAILABLE' as const,
      label: 'Available',
      count: availableCount,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      activeBorder: 'ring-2 ring-emerald-500',
    },
    {
      id: 'OCCUPIED' as const,
      label: 'Occupied',
      count: occupiedCount,
      icon: UserCheck,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      activeBorder: 'ring-2 ring-amber-500',
    },
    {
      id: 'CLEANING' as const,
      label: 'Cleaning',
      count: cleaningCount,
      icon: Sparkles,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
      activeBorder: 'ring-2 ring-sky-500',
    },
    {
      id: 'RESERVED' as const,
      label: 'Reserved',
      count: reservedCount,
      icon: BookmarkCheck,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      activeBorder: 'ring-2 ring-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isSelected = selectedStatus === stat.id;
        return (
          <button
            key={stat.label}
            type="button"
            onClick={() => onSelectStatus?.(stat.id)}
            className={`flex items-center space-x-3.5 p-3.5 rounded-2xl border transition-all duration-200 text-left cursor-pointer hover:scale-[1.02] ${
              stat.bg
            } ${stat.border} ${isSelected ? `${stat.activeBorder} shadow-lg shadow-black/40` : 'hover:border-slate-600'}`}
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900/80 border border-slate-800 ${stat.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-wide uppercase text-slate-400">{stat.label}</p>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className={`text-xl font-extrabold font-heading ${stat.color}`}>{stat.count}</span>
                {total > 0 && stat.id !== '' && (
                  <span className="text-[10px] font-medium text-slate-400">
                    ({Math.round((stat.count / total) * 100)}%)
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
