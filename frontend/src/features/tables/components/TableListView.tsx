'use client';

import { DiningTable, TableStatus } from '../types/table.types';
import { TABLE_STATUS_CONFIG } from '../utils/status.utils';
import { Users, Edit3, Trash2, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface TableListViewProps {
  tables: DiningTable[];
  totalCount: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onEdit: (table: DiningTable) => void;
  onDelete: (table: DiningTable) => void;
  onStatusChange: (tableId: string, status: TableStatus) => Promise<void>;
}

export function TableListView({
  tables,
  totalCount,
  page,
  limit,
  onPageChange,
  onLimitChange,
  onEdit,
  onDelete,
  onStatusChange,
}: TableListViewProps) {
  const { hasPermission } = useAuth();
  const canManage = hasPermission('tables:manage');
  const totalPages = Math.ceil(totalCount / limit) || 1;

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th scope="col" className="px-5 py-4">Table No.</th>
              <th scope="col" className="px-5 py-4">Table Name</th>
              <th scope="col" className="px-5 py-4">Capacity</th>
              <th scope="col" className="px-5 py-4">Status</th>
              <th scope="col" className="px-5 py-4">Description</th>
              {canManage && <th scope="col" className="px-5 py-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {tables.length === 0 ? (
              <tr>
                <td colSpan={canManage ? 6 : 5} className="px-5 py-12 text-center text-slate-500">
                  No dining tables found matching your filters.
                </td>
              </tr>
            ) : (
              tables.map((table) => {
                const config = TABLE_STATUS_CONFIG[table.status] || TABLE_STATUS_CONFIG.AVAILABLE;

                return (
                  <tr
                    key={table._id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Table Number */}
                    <td className="px-5 py-4 whitespace-nowrap font-mono font-bold text-slate-200">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-amber-400">
                        #{table.tableNumber}
                      </span>
                    </td>

                    {/* Table Name */}
                    <td className="px-5 py-4 font-semibold text-slate-100 whitespace-nowrap">
                      {table.tableName}
                      {!table.isActive && (
                        <span className="ml-2 text-[10px] text-rose-400 font-normal uppercase bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Capacity */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5 text-slate-300">
                        <Users className="h-4 w-4 text-amber-400 shrink-0" />
                        <span className="font-semibold text-slate-200">{table.capacity}</span>
                        <span className="text-slate-400 text-[11px]">{table.capacity === 1 ? 'person' : 'people'}</span>
                      </div>
                    </td>

                    {/* Status with Quick Select */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="relative inline-block">
                        <select
                          value={table.status}
                          onChange={(e) => onStatusChange(table._id, e.target.value as TableStatus)}
                          className={`appearance-none h-7 pl-2.5 pr-6 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500 ${config.badgeClass}`}
                        >
                          <option value="AVAILABLE" className="bg-slate-900 text-emerald-400">Available</option>
                          <option value="OCCUPIED" className="bg-slate-900 text-amber-400">Occupied</option>
                          <option value="CLEANING" className="bg-slate-900 text-sky-400">Cleaning</option>
                          <option value="RESERVED" className="bg-slate-900 text-purple-400">Reserved</option>
                        </select>
                        <ChevronDown className={`pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${config.colorClass}`} />
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-5 py-4 max-w-xs truncate text-slate-400">
                      {table.description ? (
                        <span className="truncate block" title={table.description}>
                          {table.description}
                        </span>
                      ) : (
                        <span className="text-slate-600 italic">No notes</span>
                      )}
                    </td>

                    {/* Actions (Owner & Manager ONLY) */}
                    {canManage && (
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(table)}
                            className="h-8 w-8 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 cursor-pointer"
                            title="Edit Table"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(table)}
                            className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 cursor-pointer"
                            title="Delete Table"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {tables.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center text-xs text-slate-500">
            No dining tables found matching your filters.
          </div>
        ) : (
          tables.map((table) => {
            const config = TABLE_STATUS_CONFIG[table.status] || TABLE_STATUS_CONFIG.AVAILABLE;

            return (
              <div
                key={table._id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3 shadow-lg"
              >
                {/* Header: Table No., Name, and Status Dropdown */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 font-mono text-xs font-bold text-amber-400">
                        #{table.tableNumber}
                      </span>
                      <span className="font-bold text-slate-100 text-sm">{table.tableName}</span>
                    </div>
                    {table.description && (
                      <p className="text-[11px] text-slate-400 mt-1">{table.description}</p>
                    )}
                  </div>

                  {/* Status Dropdown */}
                  <div className="shrink-0">
                    <div className="relative inline-block">
                      <select
                        value={table.status}
                        onChange={(e) => onStatusChange(table._id, e.target.value as TableStatus)}
                        className={`appearance-none h-7 pl-2 pr-5 rounded-lg text-[11px] font-semibold border cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500 ${config.badgeClass}`}
                      >
                        <option value="AVAILABLE" className="bg-slate-900 text-emerald-400">Available</option>
                        <option value="OCCUPIED" className="bg-slate-900 text-amber-400">Occupied</option>
                        <option value="CLEANING" className="bg-slate-900 text-sky-400">Cleaning</option>
                        <option value="RESERVED" className="bg-slate-900 text-purple-400">Reserved</option>
                      </select>
                      <ChevronDown className={`pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 ${config.colorClass}`} />
                    </div>
                  </div>
                </div>

                {/* Footer: Capacity & Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <div className="flex items-center space-x-1.5 text-slate-300 text-xs">
                    <Users className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>Capacity: <strong className="text-slate-100 font-mono">{table.capacity}</strong> {table.capacity === 1 ? 'person' : 'people'}</span>
                  </div>

                  {canManage && (
                    <div className="flex items-center space-x-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(table)}
                        className="h-8 w-8 p-0 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 cursor-pointer"
                        title="Edit Table"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(table)}
                        className="h-8 w-8 p-0 rounded-xl text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                        title="Delete Table"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Footer */}
      {totalCount > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 bg-slate-950/60 border-t border-slate-800 text-slate-400 text-xs">
          <div className="flex items-center space-x-2">
            <span>Show</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="h-8 rounded-lg border border-slate-800 bg-slate-900 px-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>entries per page</span>
          </div>

          <div className="flex items-center space-x-4">
            <span>
              Page <strong className="text-slate-200">{page}</strong> of <strong className="text-slate-200">{totalPages}</strong>
            </span>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(Math.max(page - 1, 1))}
                disabled={page === 1}
                className="h-8 w-8 border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-40 rounded-lg cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(Math.min(page + 1, totalPages))}
                disabled={page >= totalPages}
                className="h-8 w-8 border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-40 rounded-lg cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
