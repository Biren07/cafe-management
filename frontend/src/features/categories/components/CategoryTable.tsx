'use client';

import Image from 'next/image';
import { Category } from '@/types/category';
import { Edit2, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Grid, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface CategoryTableProps {
  data: Category[];
  totalCount: number;
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
  onSortChange: (column: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryTable({
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
}: CategoryTableProps) {
  const { hasPermission } = useAuth();
  const canManage = hasPermission('categories:manage');
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const renderSortIcon = (colKey: string) => {
    if (sortBy !== colKey) return <ArrowUpDown className="h-3 w-3 ml-1 text-slate-600 inline" />;
    return sortOrder === 'asc' ? (
      <ArrowUp className="h-3 w-3 ml-1 text-amber-400 inline" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1 text-amber-400 inline" />
    );
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="px-4 py-3.5 select-none">Image</th>
              <th className="px-4 py-3.5 select-none">
                <button
                  type="button"
                  onClick={() => onSortChange('name')}
                  className="flex items-center font-bold hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <span>Category Name</span>
                  {renderSortIcon('name')}
                </button>
              </th>
              <th className="px-4 py-3.5 select-none">
                <button
                  type="button"
                  onClick={() => onSortChange('status')}
                  className="flex items-center font-bold hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <span>Status</span>
                  {renderSortIcon('status')}
                </button>
              </th>
              <th className="px-4 py-3.5 select-none">
                <button
                  type="button"
                  onClick={() => onSortChange('createdAt')}
                  className="flex items-center font-bold hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <span>Created Date</span>
                  {renderSortIcon('createdAt')}
                </button>
              </th>
              {canManage && <th className="px-4 py-3.5 text-right select-none">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {data.length === 0 ? (
              <tr>
                <td colSpan={canManage ? 5 : 4} className="p-8 text-center text-xs text-slate-500">
                  No categories found. {canManage && 'Click "Add New Category" to create one.'}
                </td>
              </tr>
            ) : (
              data.map((category) => {
                const isActive = category.status === 'ACTIVE' || category.isActive;
                const dateStr = category.createdAt
                  ? new Date(category.createdAt).toLocaleDateString([], {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : '—';

                return (
                  <tr key={category._id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Image */}
                    <td className="px-4 py-3 align-middle">
                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
                        {category.image ? (
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <Grid className="h-5 w-5 text-slate-600" />
                        )}
                      </div>
                    </td>

                    {/* Name & Slug */}
                    <td className="px-4 py-3 align-middle">
                      <div>
                        <p className="font-bold text-slate-100">{category.name}</p>
                        <span className="inline-block text-[10px] font-mono text-amber-400/90 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          /{category.slug}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 align-middle">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                          }`}
                        />
                        {isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 align-middle">
                      <div className="flex items-center space-x-1 text-slate-400 text-xs font-medium">
                        <Calendar className="h-3 w-3" />
                        <span>{dateStr}</span>
                      </div>
                    </td>

                    {/* Actions (Owner & Manager ONLY) */}
                    {canManage && (
                      <td className="px-4 py-3 align-middle text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(category)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(category)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                            title="Delete Category"
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
            No categories found. {canManage && 'Click "Add New Category" to create one.'}
          </div>
        ) : (
          data.map((category) => {
            const isActive = category.status === 'ACTIVE' || category.isActive;
            const dateStr = category.createdAt
              ? new Date(category.createdAt).toLocaleDateString([], {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : '—';

            return (
              <div
                key={category._id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3 shadow-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shadow-sm">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <Grid className="h-6 w-6 text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-slate-100 text-sm truncate">{category.name}</p>
                        <span className="inline-block text-[10px] font-mono text-amber-400/90 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 mt-1">
                          /{category.slug}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border shrink-0 ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                          }`}
                        />
                        {isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-medium">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    <span>{dateStr}</span>
                  </div>
                  {canManage && (
                    <div className="flex items-center space-x-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(category)}
                        className="h-8 px-2.5 text-xs text-slate-300 border-slate-700 bg-slate-800 hover:text-amber-400 hover:border-amber-500/40 rounded-xl cursor-pointer"
                      >
                        <Edit2 className="h-3.5 w-3.5 mr-1" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(category)}
                        className="h-8 w-8 p-0 text-rose-400 hover:bg-rose-500/10 rounded-xl cursor-pointer"
                        title="Delete Category"
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

      {/* Pagination Bar */}
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
