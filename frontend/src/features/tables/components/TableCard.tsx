'use client';

import { useState } from 'react';
import { DiningTable, TableStatus } from '../types/table.types';
import { TABLE_STATUS_CONFIG } from '../utils/status.utils';
import { Users, Edit3, Trash2, ChevronDown, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface TableCardProps {
  table: DiningTable;
  onEdit: (table: DiningTable) => void;
  onDelete: (table: DiningTable) => void;
  onStatusChange: (tableId: string, status: TableStatus) => Promise<void>;
  isUpdatingStatus?: boolean;
}

export function TableCard({
  table,
  onEdit,
  onDelete,
  onStatusChange,
  isUpdatingStatus = false,
}: TableCardProps) {
  const { hasPermission } = useAuth();
  const canManage = hasPermission('tables:manage');
  const [updating, setUpdating] = useState(false);
  const config = TABLE_STATUS_CONFIG[table.status] || TABLE_STATUS_CONFIG.AVAILABLE;

  const handleStatusSelect = async (newStatus: TableStatus) => {
    if (newStatus === table.status) return;
    setUpdating(true);
    try {
      await onStatusChange(table._id, newStatus);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 shadow-xs hover:shadow-md ${config.bgClass} ${config.borderClass} ${config.glowClass} hover:-translate-y-0.5`}
    >
      {/* Top Header: Table Number Badge & Actions */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="flex h-7 px-2.5 items-center justify-center rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold font-mono text-slate-800 shadow-2xs">
              #{table.tableNumber}
            </span>
            <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${config.badgeClass}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`} />
              <span>{config.label}</span>
            </span>
          </div>

          {/* Edit / Delete Buttons (Owner & Manager ONLY) */}
          {canManage && (
            <div className="flex items-center space-x-1 opacity-90 sm:opacity-70 group-hover:opacity-100 transition-opacity">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onEdit(table)}
                className="h-8 w-8 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 cursor-pointer"
                title="Edit Table"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onDelete(table)}
                className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                title="Delete Table"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Table Name */}
        <h3 className="font-heading text-base font-bold text-slate-900 tracking-tight transition-colors">
          {table.tableName}
        </h3>

        {/* Capacity & Description */}
        <div className="mt-2.5 flex items-center space-x-2 text-xs text-slate-500">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
            <Users className="h-3.5 w-3.5 text-amber-700" />
            <span className="font-semibold text-slate-900">{table.capacity}</span>
            <span className="text-[11px] text-slate-500">{table.capacity === 1 ? 'Seat' : 'Seats'}</span>
          </div>

          {!table.isActive && (
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 text-slate-500 border border-slate-200">
              Inactive
            </span>
          )}
        </div>

        {table.description && (
          <p className="mt-2.5 text-xs text-slate-500 line-clamp-2 leading-relaxed flex items-start space-x-1">
            <Info className="h-3.5 w-3.5 shrink-0 text-slate-400 mt-0.5" />
            <span>{table.description}</span>
          </p>
        )}
      </div>

      {/* Footer: Quick Status Switcher */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-400">Change Status</span>

        <div className="relative inline-block">
          <select
            value={table.status}
            disabled={updating || isUpdatingStatus}
            onChange={(e) => handleStatusSelect(e.target.value as TableStatus)}
            className={`appearance-none h-7 pl-2.5 pr-7 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-colors ${
              config.badgeClass
            } ${updating || isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <option value="AVAILABLE" className="bg-white text-emerald-800 font-semibold">
              Available
            </option>
            <option value="OCCUPIED" className="bg-white text-amber-800 font-semibold">
              Occupied
            </option>
            <option value="CLEANING" className="bg-white text-sky-800 font-semibold">
              Cleaning
            </option>
            <option value="RESERVED" className="bg-white text-purple-800 font-semibold">
              Reserved
            </option>
          </select>
          <ChevronDown className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 ${config.colorClass}`} />
        </div>
      </div>
    </div>
  );
}
