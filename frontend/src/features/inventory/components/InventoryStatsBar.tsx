'use client';

import { InventoryItem } from '../types/inventory.types';
import { Package, AlertTriangle, CheckCircle2, Layers } from 'lucide-react';

interface InventoryStatsBarProps {
  items: InventoryItem[];
  isLowStockOnly?: boolean;
  onToggleLowStock?: (val: boolean) => void;
}

export function InventoryStatsBar({
  items,
  isLowStockOnly,
  onToggleLowStock,
}: InventoryStatsBarProps) {
  const total = items.length;
  const lowStockCount = items.filter((i) => i.isLowStock || i.currentStock <= i.minimumStock).length;
  const healthyCount = total - lowStockCount;
  const totalUnits = items.reduce((acc, i) => acc + (i.currentStock || 0), 0);

  const stats = [
    {
      label: 'Total Stock Items',
      count: total,
      subtext: `${totalUnits.toLocaleString()} units total`,
      icon: Package,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      action: () => onToggleLowStock?.(false),
      active: !isLowStockOnly,
    },
    {
      label: 'Healthy Stock Level',
      count: healthyCount,
      subtext: 'Adequate quantity',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      action: () => onToggleLowStock?.(false),
      active: false,
    },
    {
      label: 'Low Stock Alerts',
      count: lowStockCount,
      subtext: 'Requires reordering',
      icon: AlertTriangle,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      action: () => onToggleLowStock?.(true),
      active: !!isLowStockOnly,
    },
    {
      label: 'Stock Health',
      count: total > 0 ? `${Math.round((healthyCount / total) * 100)}%` : '100%',
      subtext: 'Operational capacity',
      icon: Layers,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
      action: undefined,
      active: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <button
            key={idx}
            type="button"
            onClick={stat.action}
            disabled={!stat.action}
            className={`flex items-center space-x-3.5 p-3.5 rounded-2xl border transition-all duration-200 text-left cursor-pointer hover:scale-[1.02] ${
              stat.bg
            } ${stat.border} ${stat.active ? 'ring-2 ring-rose-500 shadow-lg shadow-black/40' : 'hover:border-slate-600'}`}
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
