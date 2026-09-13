'use client';

import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  CheckCircle2,
  Armchair,
  Users,
  AlertTriangle,
} from 'lucide-react';
import { SummaryCardsData } from '@/types/dashboard';

interface SummaryCardsGridProps {
  data?: SummaryCardsData;
}

export function SummaryCardsGrid({ data }: SummaryCardsGridProps) {
  const formatCurrency = (val?: number) =>
    `Rs. ${(val || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const cards = [
    {
      title: "Today's Sales",
      value: formatCurrency(data?.todaySales),
      subtitle: 'Real-time revenue',
      icon: DollarSign,
      iconBg: 'bg-amber-50 text-amber-700 border border-amber-200/80',
    },
    {
      title: "Today's Orders",
      value: (data?.todayOrders || 0).toLocaleString(),
      subtitle: 'Total processed',
      icon: ShoppingBag,
      iconBg: 'bg-blue-50 text-blue-700 border border-blue-200/80',
    },
    {
      title: 'Monthly Revenue',
      value: formatCurrency(data?.monthlySales),
      subtitle: 'Current month',
      icon: TrendingUp,
      iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    },
    {
      title: 'Available Tables',
      value: `${data?.availableTables || 0} Free`,
      subtitle: 'Ready for seating',
      icon: CheckCircle2,
      iconBg: 'bg-teal-50 text-teal-700 border border-teal-200/80',
    },
    {
      title: 'Occupied Tables',
      value: `${data?.occupiedTables || 0} Seated`,
      subtitle: 'Active dining',
      icon: Armchair,
      iconBg: 'bg-orange-50 text-orange-700 border border-orange-200/80',
    },
    {
      title: 'Total Employees',
      value: (data?.totalEmployees || 0).toLocaleString(),
      subtitle: 'Active staff',
      icon: Users,
      iconBg: 'bg-indigo-50 text-indigo-700 border border-indigo-200/80',
    },
    {
      title: 'Low Stock Alerts',
      value: `${data?.lowStockItems || 0} Items`,
      subtitle: 'Requires reorder',
      icon: AlertTriangle,
      iconBg:
        (data?.lowStockItems || 0) > 0
          ? 'bg-rose-50 text-rose-700 border border-rose-200/80'
          : 'bg-slate-100 text-slate-600 border border-slate-200/80',
      isAlert: (data?.lowStockItems || 0) > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`flex flex-col justify-between rounded-2xl border bg-white p-4 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-150 ${
              card.isAlert ? 'border-rose-300 ring-1 ring-rose-200/60' : 'border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {card.title}
              </span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${card.iconBg}`}>
                <Icon className="h-4 w-4 stroke-[2.2]" />
              </div>
            </div>

            <div className="mt-3">
              <h3 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {card.value}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">{card.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
