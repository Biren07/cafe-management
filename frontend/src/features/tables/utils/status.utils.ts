import { TableStatus } from '../types/table.types';
import { CheckCircle2, UserCheck, Sparkles, BookmarkCheck } from 'lucide-react';

export interface StatusConfig {
  label: string;
  colorClass: string;
  badgeClass: string;
  glowClass: string;
  borderClass: string;
  bgClass: string;
  dotClass: string;
  icon: typeof CheckCircle2;
}

export const TABLE_STATUS_CONFIG: Record<TableStatus, StatusConfig> = {
  AVAILABLE: {
    label: 'Available',
    colorClass: 'text-emerald-700',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    glowClass: 'shadow-xs hover:shadow-sm',
    borderClass: 'border-slate-200/90 hover:border-emerald-300',
    bgClass: 'bg-white',
    dotClass: 'bg-emerald-500',
    icon: CheckCircle2,
  },
  OCCUPIED: {
    label: 'Occupied',
    colorClass: 'text-amber-700',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/80',
    glowClass: 'shadow-xs hover:shadow-sm',
    borderClass: 'border-slate-200/90 hover:border-amber-300',
    bgClass: 'bg-white',
    dotClass: 'bg-amber-500',
    icon: UserCheck,
  },
  CLEANING: {
    label: 'Cleaning',
    colorClass: 'text-sky-700',
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200/80',
    glowClass: 'shadow-xs hover:shadow-sm',
    borderClass: 'border-slate-200/90 hover:border-sky-300',
    bgClass: 'bg-white',
    dotClass: 'bg-sky-500',
    icon: Sparkles,
  },
  RESERVED: {
    label: 'Reserved',
    colorClass: 'text-purple-700',
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-200/80',
    glowClass: 'shadow-xs hover:shadow-sm',
    borderClass: 'border-slate-200/90 hover:border-purple-300',
    bgClass: 'bg-white',
    dotClass: 'bg-purple-500',
    icon: BookmarkCheck,
  },
};
