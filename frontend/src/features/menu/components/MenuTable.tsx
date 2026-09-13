'use client';

import Image from 'next/image';
import { MenuItem } from '@/types/menu';
import { Category } from '@/types/category';
import { Edit2, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Utensils, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface MenuTableProps {
  data: MenuItem[];
  totalCount: number;
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
  onSortChange: (column: string) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
}

export function MenuTable({
  data,
  totalCount,
  page,
  limit,
  sortBy,
  sortOrder,
  onPageChange,
  onLimitChange,
  onSortChange,
  onEdit,
  onDelete,
}: MenuTableProps) {
  const { hasPermission } = useAuth();
  const canManage = hasPermission('menu:manage');
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const renderSortIcon = (colKey: string) => {
    if (sortBy !== colKey) return <ArrowUpDown className="h-3 w-3 ml-1 text-slate-600 inline" />;
    return sortOrder === 'asc' ? (
      <ArrowUp className="h-3 w-3 ml-1 text-amber-400 inline" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1 text-amber-400 inline" />
    );
  };

  const formatCurrency = (val: number) => `Rs.${val.toFixed(2)}`;

  return (
    <div className="flex flex-col space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="px-4 py-3.5 select-none">Item</th>
              <th className="px-4 py-3.5 select-none">
                <button
                  type="button"
                  onClick={() => onSortChange('name')}
                  className="flex items-center font-bold hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <span>Name & Category</span>
                  {renderSortIcon('name')}
                </button>
              </th>
              <th className="px-4 py-3.5 select-none">
                <button
                  type="button"
                  onClick={() => onSortChange('price')}
                  className="flex items-center font-bold hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <span>Price</span>
                  {renderSortIcon('price')}
                </button>
              </th>
              <th className="px-4 py-3.5 select-none">
                <button
                  type="button"
                  onClick={() => onSortChange('isAvailable')}
                  className="flex items-center font-bold hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <span>Availability</span>
                  {renderSortIcon('isAvailable')}
                </button>
              </th>
              {canManage && <th className="px-4 py-3.5 text-right select-none">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {data.length === 0 ? (
              <tr>
                <td colSpan={canManage ? 5 : 4} className="p-8 text-center text-xs text-slate-500">
                  No menu items found. {canManage && 'Click "Add Menu Item" to populate your catalog.'}
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const categoryName =
                  typeof item.category === 'object' && item.category
                    ? (item.category as Category).name
                    : 'General';

                return (
                  <tr key={item._id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Thumbnail */}
                    <td className="px-4 py-3 align-middle">
                      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="44px"
                          />
                        ) : (
                          <Utensils className="h-5 w-5 text-amber-500/60" />
                        )}
                      </div>
                    </td>

                    {/* Name & Category Badge */}
                    <td className="px-4 py-3 align-middle">
                      <div>
                        <p className="font-bold text-slate-100">{item.name}</p>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="inline-block rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/20">
                            {categoryName}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 align-middle">
                      <div className="flex items-center font-extrabold text-amber-400 text-sm font-mono">
                        <span>Rs. {item.price.toFixed(2)}</span>
                      </div>
                    </td>

                    {/* Availability */}
                    <td className="px-4 py-3 align-middle">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                          item.isAvailable
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            item.isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                          }`}
                        />
                        {item.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
                      </span>
                    </td>

                    {/* Actions (Owner & Manager ONLY) */}
                    {canManage && (
                      <td className="px-4 py-3 align-middle text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(item)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg cursor-pointer"
                            title="Edit Menu Item"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(item)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                            title="Delete Menu Item"
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
        {data.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center text-xs text-slate-500">
            No menu items found. {canManage && 'Click "Add Menu Item" to populate your catalog.'}
          </div>
        ) : (
          data.map((item) => {
            const categoryName =
              typeof item.category === 'object' && item.category
                ? (item.category as Category).name
                : 'General';

            return (
              <div
                key={item._id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3 shadow-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shadow-sm">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <Utensils className="h-6 w-6 text-amber-500/60" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-slate-100 text-sm truncate">{item.name}</p>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border shrink-0 ${
                          item.isAvailable
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            item.isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                          }`}
                        />
                        {item.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-block rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/20">
                        {categoryName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                      Price
                    </span>
                    <span className="font-mono font-extrabold text-amber-400 text-base">
                      Rs. {item.price.toFixed(2)}
                    </span>
                  </div>
                  {canManage && (
                    <div className="flex items-center space-x-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(item)}
                        className="h-8 px-2.5 text-xs text-slate-300 border-slate-700 bg-slate-800 hover:text-amber-400 hover:border-amber-500/40 rounded-xl cursor-pointer"
                      >
                        <Edit2 className="h-3.5 w-3.5 mr-1" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(item)}
                        className="h-8 w-8 p-0 text-rose-400 hover:bg-rose-500/10 rounded-xl cursor-pointer"
                        title="Delete Item"
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

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 px-1">
        <div className="flex items-center space-x-2">
          <span>Show</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="h-8 rounded-lg border border-slate-800 bg-slate-900 px-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value={10}>10 rows</option>
            <option value={20}>20 rows</option>
            <option value={50}>50 rows</option>
          </select>
          <span>per page • Total <strong className="text-slate-200">{totalCount}</strong> items</span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="h-8 border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-40 text-xs rounded-lg cursor-pointer"
          >
            Previous
          </Button>

          <span className="text-xs font-semibold text-slate-300">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="h-8 border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-40 text-xs rounded-lg cursor-pointer"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
