'use client';

import { Payment, PaymentMethod, PaymentStatus } from '../types/payment.types';
import { DollarSign, Banknote, CreditCard, CheckCircle2, Clock } from 'lucide-react';

interface PaymentStatsBarProps {
  payments: Payment[];
  selectedMethod?: PaymentMethod | '';
  onSelectMethod?: (method: PaymentMethod | '') => void;
  selectedStatus?: PaymentStatus | '';
  onSelectStatus?: (status: PaymentStatus | '') => void;
}

export function PaymentStatsBar({
  payments,
  selectedMethod,
  onSelectMethod,
}: PaymentStatsBarProps) {
  const totalReceived = payments
    .filter((p) => p.paymentStatus === 'COMPLETED')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const cashPayments = payments.filter((p) => p.paymentMethod === 'CASH' && p.paymentStatus === 'COMPLETED');
  const cashTotal = cashPayments.reduce((acc, p) => acc + (p.amount || 0), 0);

  const onlinePayments = payments.filter((p) => p.paymentMethod === 'ONLINE' && p.paymentStatus === 'COMPLETED');
  const onlineTotal = onlinePayments.reduce((acc, p) => acc + (p.amount || 0), 0);

  const pendingCount = payments.filter((p) => p.paymentStatus === 'PENDING').length;

  const stats = [
    {
      id: '' as const,
      label: 'Total Collected',
      amount: `Rs.${totalReceived.toFixed(2)}`,
      count: `${payments.length} transactions`,
      icon: DollarSign,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      activeBorder: 'ring-2 ring-amber-500',
    },
    {
      id: 'CASH' as const,
      label: 'Cash Transactions',
      amount: `Rs.${cashTotal.toFixed(2)}`,
      count: `${cashPayments.length} paid`,
      icon: Banknote,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      activeBorder: 'ring-2 ring-emerald-500',
    },
    {
      id: 'ONLINE' as const,
      label: 'Online Digital',
      amount: `Rs.${onlineTotal.toFixed(2)}`,
      count: `${onlinePayments.length} paid`,
      icon: CreditCard,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
      activeBorder: 'ring-2 ring-sky-500',
    },
    {
      id: '' as const,
      label: 'Pending Approval',
      amount: `${pendingCount} Orders`,
      count: 'Awaiting settlement',
      icon: Clock,
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
        const isSelected = stat.id !== '' && selectedMethod === stat.id;
        return (
          <button
            key={idx}
            type="button"
            onClick={() => stat.id !== undefined && onSelectMethod?.(stat.id)}
            className={`flex items-center space-x-3.5 p-3.5 rounded-2xl border transition-all duration-200 text-left cursor-pointer hover:scale-[1.02] ${
              stat.bg
            } ${stat.border} ${isSelected ? `${stat.activeBorder} shadow-lg shadow-black/40` : 'hover:border-slate-600'}`}
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900/80 border border-slate-800 ${stat.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-wide uppercase text-slate-400">{stat.label}</p>
              <span className={`text-xl font-extrabold font-heading font-mono ${stat.color}`}>{stat.amount}</span>
              <p className="text-[10px] text-slate-400 mt-0.5">{stat.count}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
