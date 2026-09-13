'use client';

import { InventoryItem } from '../types/inventory.types';
import {
  ArrowDownRight,
  ArrowUpRight,
  History,
  Edit2,
  Edit3,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface InventoryTableProps {
  items: InventoryItem[];
  totalCount: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onStockIn: (item: InventoryItem) => void;
  onStockOut: (item: InventoryItem) => void;
  onViewHistory: (item: InventoryItem) => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
}

export function InventoryTable({
  items,
  totalCount,
  page,
  limit,
  onPageChange,
  onLimitChange,
  onStockIn,
  onStockOut,
  onViewHistory,
  onEdit,
  onDelete,
}: InventoryTableProps) {
  const { hasPermission } = useAuth();
  const canManage = hasPermission('inventory:manage');
  const totalPages = Math.ceil(totalCount / limit) || 1;

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th scope="col" className="px-5 py-4">Item Name</th>
              <th scope="col" className="px-5 py-4">Category</th>
              <th scope="col" className="px-5 py-4">Current Stock</th>
              <th scope="col" className="px-5 py-4">Min Stock Limit</th>
              <th scope="col" className="px-5 py-4">Health Status</th>
              <th scope="col" className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                  No inventory items found matching your filters.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const categoryName = typeof item.category === 'object' && item.category ? (item.category as any).name : 'General';
                const isLow = item.isLowStock || item.currentStock <= item.minimumStock;
                const ratio = Math.min(100, Math.round((item.currentStock / (item.minimumStock * 2 || 1)) * 100));

                return (
                  <tr key={item._id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="px-5 py-4 font-semibold text-slate-100 whitespace-nowrap">
                      {item.itemName}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-slate-400">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px]">
                        {categoryName}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`font-mono font-extrabold text-sm ${isLow ? 'text-rose-400' : 'text-slate-100'}`}>
                          {item.currentStock}
                        </span>
                        <span className="text-[11px] text-slate-400">{item.unit}</span>
                      </div>
                      <div className="w-28 h-1.5 rounded-full bg-slate-800 overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full transition-all ${isLow ? 'bg-rose-500' : 'bg-emerald-500'}`}
                          style={{ width: `${ratio}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-mono text-slate-400">
                      {item.minimumStock} {item.unit}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {isLow ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Low Stock</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>In Stock</span>
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {canManage && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => onStockIn(item)}
                            className="h-8 w-8 rounded-lg text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
                            title="Stock In (+)"
                          >
                            <ArrowDownRight className="h-4 w-4" />
                          </Button>
                        )}
                        {canManage && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => onStockOut(item)}
                            className="h-8 w-8 rounded-lg text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                            title="Stock Out (-)"
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewHistory(item)}
                          className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 cursor-pointer"
                          title="Movement History"
                        >
                          <History className="h-4 w-4" />
                        </Button>
                        {canManage && (
                          <>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit(item)}
                              className="h-8 w-8 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 cursor-pointer"
                              title="Edit Item"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => onDelete(item)}
                              className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center text-xs text-slate-500">
            No inventory items found matching your filters.
          </div>
        ) : (
          items.map((item) => {
            const categoryName = typeof item.category === 'object' && item.category ? (item.category as any).name : 'General';
            const isLow = item.isLowStock || item.currentStock <= item.minimumStock;
            const ratio = Math.min(100, Math.round((item.currentStock / (item.minimumStock * 2 || 1)) * 100));

            return (
              <div
                key={item._id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3 shadow-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-slate-100 text-sm">{item.itemName}</p>
                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] text-slate-400 mt-1">
                      {categoryName}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                      isLow
                        ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {isLow ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                    <span>{isLow ? 'Low Stock' : 'In Stock'}</span>
                  </span>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Current Level</span>
                    <span className="font-mono font-extrabold text-slate-100">
                      <strong className={isLow ? 'text-rose-400' : 'text-emerald-400'}>{item.currentStock}</strong> / {item.minimumStock} {item.unit} min
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isLow ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  {canManage ? (
                    <div className="flex items-center space-x-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onStockIn(item)}
                        className="h-8 px-2.5 rounded-xl border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs cursor-pointer"
                        title="Stock In"
                      >
                        <ArrowDownRight className="h-3.5 w-3.5 mr-1" />
                        <span>In</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onStockOut(item)}
                        className="h-8 px-2.5 rounded-xl border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs cursor-pointer"
                        title="Stock Out"
                      >
                        <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                        <span>Out</span>
                      </Button>
                    </div>
                  ) : <div />}
                  <div className="flex items-center space-x-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewHistory(item)}
                      className="h-8 px-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs cursor-pointer"
                      title="History"
                    >
                      <History className="h-3.5 w-3.5 mr-1" />
                      <span>History</span>
                    </Button>
                    {canManage && (
                      <>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(item)}
                          className="h-8 w-8 p-0 rounded-xl text-slate-400 hover:text-amber-400 cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(item)}
                          className="h-8 w-8 p-0 rounded-xl text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    )}
                  </div>
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
