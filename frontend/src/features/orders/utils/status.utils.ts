import { OrderStatus } from '../types/order.types';
import { Clock, ChefHat, CheckCircle2, CheckCheck, XCircle } from 'lucide-react';

export interface OrderStatusConfig {
  label: string;
  colorClass: string;
  badgeClass: string;
  borderClass: string;
  bgClass: string;
  icon: typeof Clock;
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, OrderStatusConfig> = {
  PENDING: {
    label: 'Pending',
    colorClass: 'text-amber-400',
    badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    borderClass: 'border-amber-500/30',
    bgClass: 'bg-amber-500/10',
    icon: Clock,
  },
  PREPARING: {
    label: 'Preparing',
    colorClass: 'text-sky-400',
    badgeClass: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    borderClass: 'border-sky-500/30',
    bgClass: 'bg-sky-500/10',
    icon: ChefHat,
  },
  SERVED: {
    label: 'Served',
    colorClass: 'text-indigo-400',
    badgeClass: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    borderClass: 'border-indigo-500/30',
    bgClass: 'bg-indigo-500/10',
    icon: CheckCircle2,
  },
  COMPLETED: {
    label: 'Completed',
    colorClass: 'text-emerald-400',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    borderClass: 'border-emerald-500/30',
    bgClass: 'bg-emerald-500/10',
    icon: CheckCheck,
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
