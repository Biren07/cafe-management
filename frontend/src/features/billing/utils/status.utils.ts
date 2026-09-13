import { BillStatus } from '../types/billing.types';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

export interface BillStatusConfig {
  label: string;
  colorClass: string;
  badgeClass: string;
  borderClass: string;
  bgClass: string;
  icon: typeof Clock;
}

export const BILL_STATUS_CONFIG: Record<BillStatus, BillStatusConfig> = {
  PENDING: {
    label: 'Unpaid / Pending',
    colorClass: 'text-amber-400',
    badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    borderClass: 'border-amber-500/30',
    bgClass: 'bg-amber-500/10',
    icon: Clock,
  },
  PAID: {
    label: 'Paid',
    colorClass: 'text-emerald-400',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    borderClass: 'border-emerald-500/30',
    bgClass: 'bg-emerald-500/10',
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: 'Cancelled',
    colorClass: 'text-rose-400',
    badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    borderClass: 'border-rose-500/30',
    bgClass: 'bg-rose-500/10',
    icon: XCircle,
  },
};
