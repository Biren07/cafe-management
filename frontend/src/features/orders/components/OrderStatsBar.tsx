'use client';

import { Order, OrderStatus } from '../types/order.types';
import { ShoppingBag, Clock, ChefHat, CheckCircle2, CheckCheck, XCircle } from 'lucide-react';

interface OrderStatsBarProps {
  orders: Order[];
  selectedStatus?: OrderStatus | '';
  onSelectStatus?: (status: OrderStatus | '') => void;
}

export function OrderStatsBar({ orders, selectedStatus, onSelectStatus }: OrderStatsBarProps) {
  const total = orders.length;
  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const preparingCount = orders.filter((o) => o.status === 'PREPARING').length;
  const servedCount = orders.filter((o) => o.status === 'SERVED').length;
  const completedCount = orders.filter((o) => o.status === 'COMPLETED').length;
  const cancelledCount = orders.filter((o) => o.status === 'CANCELLED').length;

  const stats = [
    {
      id: '' as const,
      label: 'All Orders',
      count: total,
      icon: ShoppingBag,
      color: 'text-slate-200',
      bg: 'bg-slate-800/50',
      border: 'border-slate-700/60',
      activeBorder: 'ring-2 ring-slate-400',
    },
    {
      id: 'PENDING' as const,
      label: 'Pending',
      count: pendingCount,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      activeBorder: 'ring-2 ring-amber-500',
    },
    {
      id: 'PREPARING' as const,
      label: 'Preparing',
      count: preparingCount,
      icon: ChefHat,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
      activeBorder: 'ring-2 ring-sky-500',
    },
    {
      id: 'SERVED' as const,
      label: 'Served',
      count: servedCount,
      icon: CheckCircle2,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      activeBorder: 'ring-2 ring-indigo-500',
    },
    {
      id: 'COMPLETED' as const,
      label: 'Completed',
      count: completedCount,
      icon: CheckCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      activeBorder: 'ring-2 ring-emerald-500',
    },
    {
      id: 'CANCELLED' as const,
      label: 'Cancelled',
      count: cancelledCount,
      icon: XCircle,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      activeBorder: 'ring-2 ring-rose-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isSelected = selectedStatus === stat.id;
        return (
          <button
            key={stat.label}
            type="button"
            onClick={() => onSelectStatus?.(stat.id)}
            className={`flex items-center space-x-3 p-3 rounded-2xl border transition-all duration-200 text-left cursor-pointer hover:scale-[1.02] ${
              stat.bg
            } ${stat.border} ${isSelected ? `${stat.activeBorder} shadow-lg shadow-black/40` : 'hover:border-slate-600'}`}
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900/80 border border-slate-800 ${stat.color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-wide uppercase text-slate-400">{stat.label}</p>
              <div className="flex items-baseline space-x-1 mt-0.5">
                <span className={`text-lg font-extrabold font-heading ${stat.color}`}>{stat.count}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
