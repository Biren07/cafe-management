import { PaymentMethod, PaymentStatus } from '../types/payment.types';
import { CheckCircle2, Clock, XCircle, RotateCcw, Banknote, CreditCard } from 'lucide-react';

export interface PaymentStatusConfig {
  label: string;
  colorClass: string;
  badgeClass: string;
  icon: typeof CheckCircle2;
}

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, PaymentStatusConfig> = {
  COMPLETED: {
    label: 'Completed',
    colorClass: 'text-emerald-400',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    icon: CheckCircle2,
  },
  PENDING: {
    label: 'Pending',
    colorClass: 'text-amber-400',
    badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    icon: Clock,
  },
  FAILED: {
    label: 'Failed',
    colorClass: 'text-rose-400',
    badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    icon: XCircle,
  },
  REFUNDED: {
    label: 'Refunded',
    colorClass: 'text-purple-400',
    badgeClass: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    icon: RotateCcw,
  },
};

export interface PaymentMethodConfig {
  label: string;
  badgeClass: string;
  icon: typeof Banknote;
}

export const PAYMENT_METHOD_CONFIG: Record<PaymentMethod, PaymentMethodConfig> = {
  CASH: {
    label: 'Cash',
    badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    icon: Banknote,
  },
  ONLINE: {
    label: 'Online Digital',
    badgeClass: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
    icon: CreditCard,
  },
};
