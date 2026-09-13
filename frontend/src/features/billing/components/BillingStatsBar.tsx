'use client';

import { Bill, BillStatus } from '../types/billing.types';
import { Receipt, DollarSign, Clock, CheckCircle2, Split } from 'lucide-react';

interface BillingStatsBarProps {
  bills: Bill[];
  selectedStatus?: BillStatus | '';
  onSelectStatus?: (status: BillStatus | '') => void;
}

export function BillingStatsBar({ bills, selectedStatus, onSelectStatus }: BillingStatsBarProps) {
  const totalBills = bills.length;
  const totalRevenue = bills
    .filter((b) => b.status === 'PAID')
    .reduce((acc, b) => acc + (b.grandTotal || 0), 0);
  const pendingCount = bills.filter((b) => b.status === 'PENDING').length;
  const paidCount = bills.filter((b) => b.status === 'PAID').length;
  const splitCount = bills.filter((b) => b.isSplit).length;

  const stats = [
    {
      id: '' as const,
      label: 'Total Bills',
      count: totalBills,
      subtext: `Total Revenue: Rs. ${totalRevenue.toFixed(2)}`,
      icon: Receipt,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      activeBorder: 'ring-2 ring-amber-500',
    },
    {
      id: 'PAID' as const,
      label: 'Paid Invoices',
      count: paidCount,
      subtext: 'Completed payments',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      activeBorder: 'ring-2 ring-emerald-500',
    },
    {
      id: 'PENDING' as const,
      label: 'Unpaid / Pending',
      count: pendingCount,
      subtext: 'Awaiting payment',
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      activeBorder: 'ring-2 ring-amber-500',
    },
    {
      id: '' as const,
      label: 'Split Bills',
      count: splitCount,
      subtext: 'Shared payments',
      icon: Split,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      activeBorder: 'ring-2 ring-purple-500',
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
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{stat.subtext}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
