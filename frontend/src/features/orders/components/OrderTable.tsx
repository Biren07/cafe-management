'use client';

import { Order, OrderStatus } from '../types/order.types';
import { ORDER_STATUS_CONFIG } from '../utils/status.utils';
import { ShoppingBag, Armchair, Eye, ChevronDown, ChevronLeft, ChevronRight, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface OrderTableProps {
  orders: Order[];
  totalCount: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onViewDetails: (order: Order) => void;
  onStatusChange: (orderId: string, status: OrderStatus) => Promise<void>;
}

export function OrderTable({
  orders,
  totalCount,
  page,
  limit,
  onPageChange,
  onLimitChange,
  onViewDetails,
  onStatusChange,
}: OrderTableProps) {
  const { hasPermission } = useAuth();
  const canManage = hasPermission('orders:manage');
  const totalPages = Math.ceil(totalCount / limit) || 1;

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3.5 select-none">Order #</th>
              <th className="px-5 py-3.5 select-none">Type</th>
              <th className="px-5 py-3.5 select-none">Items</th>
              <th className="px-5 py-3.5 select-none">Total</th>
              <th className="px-5 py-3.5 select-none">Status</th>
              <th className="px-5 py-3.5 select-none">Time</th>
              <th className="px-5 py-3.5 text-right select-none">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-xs text-slate-500">
                  No orders found matching your filters.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const config = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.PENDING;
                const tableInfo = typeof order.table === 'object' && order.table ? order.table : null;
                const dateStr = new Date(order.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <tr key={order._id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="px-5 py-4 font-mono font-bold text-amber-400 whitespace-nowrap">
                      #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {order.orderType === 'DINE_IN' ? (
                        <div className="flex items-center space-x-1.5 text-slate-200">
                          <Armchair className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          <span className="font-semibold">Dine-In</span>
                          {tableInfo && <span className="ml-1 px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300">#{tableInfo.tableNumber}</span>}
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1.5 text-slate-300">
                          <ShoppingBag className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                          <span className="font-semibold">Take-Away</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <div className="text-slate-200 font-medium truncate">{order.items.map((i) => i.name || (typeof i.menuItem === 'object' ? i.menuItem.name : 'Item')).join(', ')}</div>
                      <div className="text-[10px] text-slate-400">{order.items.reduce((acc, i) => acc + i.quantity, 0)} items total</div>
                    </td>
                    <td className="px-5 py-4 font-mono font-extrabold text-slate-100 whitespace-nowrap text-sm">Rs.{(order.total || 0).toFixed(2)}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {canManage ? (
                        <div className="relative inline-block">
                          <select value={order.status} onChange={(e) => onStatusChange(order._id, e.target.value as OrderStatus)} className={`appearance-none h-7 pl-2.5 pr-6 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500 ${config.badgeClass}`}>
                            <option value="PENDING" className="bg-slate-900 text-amber-400">Pending</option>
                            <option value="PREPARING" className="bg-slate-900 text-sky-400">Preparing</option>
                            <option value="SERVED" className="bg-slate-900 text-indigo-400">Served</option>
                            <option value="COMPLETED" className="bg-slate-900 text-emerald-400">Completed</option>
                            <option value="CANCELLED" className="bg-slate-900 text-rose-400">Cancelled</option>
                          </select>
                          <ChevronDown className={`pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${config.colorClass}`} />
                        </div>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${config.badgeClass}`}>{config.label}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-400 whitespace-nowrap text-[11px]">{dateStr}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Button type="button" variant="ghost" size="sm" onClick={() => onViewDetails(order)} className="h-8 px-2.5 rounded-lg text-slate-300 hover:text-amber-400 hover:bg-amber-400/10 text-xs cursor-pointer">
                          <Eye className="h-3.5 w-3.5 mr-1" /> Details
                        </Button>
                        {canManage && order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
                          <Button type="button" variant="ghost" size="icon" onClick={() => onStatusChange(order._id, 'CANCELLED')} className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 cursor-pointer" title="Cancel Order">
                            <XCircle className="h-4 w-4" />
                          </Button>
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
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center text-xs text-slate-500">
            No orders found matching your filters.
          </div>
        ) : (
          orders.map((order) => {
            const config = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.PENDING;
            const tableInfo = typeof order.table === 'object' && order.table ? order.table : null;
            const dateStr = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div key={order._id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3 shadow-lg">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 text-sm">#{order.orderNumber || order._id.slice(-6).toUpperCase()}</span>
                      {order.orderType === 'DINE_IN' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-semibold text-slate-200">
                          <Armchair className="h-3 w-3 text-amber-400" />
                          <span>Dine-In {tableInfo ? `(#${tableInfo.tableNumber})` : ''}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-semibold text-sky-300">
                          <ShoppingBag className="h-3 w-3 text-sky-400" />
                          <span>Take-Away</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-500" />
                      <span>{dateStr}</span>
                    </p>
                  </div>
                  <div className="shrink-0">
                    {canManage ? (
                      <div className="relative inline-block">
                        <select value={order.status} onChange={(e) => onStatusChange(order._id, e.target.value as OrderStatus)} className={`appearance-none h-7 pl-2 pr-5 rounded-lg text-[11px] font-semibold border cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500 ${config.badgeClass}`}>
                          <option value="PENDING" className="bg-slate-900 text-amber-400">Pending</option>
                          <option value="PREPARING" className="bg-slate-900 text-sky-400">Preparing</option>
                          <option value="SERVED" className="bg-slate-900 text-indigo-400">Served</option>
                          <option value="COMPLETED" className="bg-slate-900 text-emerald-400">Completed</option>
                          <option value="CANCELLED" className="bg-slate-900 text-rose-400">Cancelled</option>
                        </select>
                        <ChevronDown className={`pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 ${config.colorClass}`} />
                      </div>
                    ) : (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${config.badgeClass}`}>{config.label}</span>
                    )}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800/80 text-xs">
                  <p className="text-slate-300 font-medium line-clamp-2">{order.items.map((i) => `${i.quantity}x ${i.name || (typeof i.menuItem === 'object' ? i.menuItem.name : 'Item')}`).join(', ')}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{order.items.reduce((acc, i) => acc + i.quantity, 0)} items total</p>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Total</span>
                    <span className="font-mono font-extrabold text-slate-100 text-base">Rs. {(order.total || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Button type="button" variant="outline" size="sm" onClick={() => onViewDetails(order)} className="h-8 px-2.5 rounded-xl border-slate-700 bg-slate-800 text-slate-200 hover:text-amber-400 hover:border-amber-500/40 text-xs cursor-pointer">
                      <Eye className="h-3.5 w-3.5 mr-1" /> Details
                    </Button>
                    {canManage && order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => onStatusChange(order._id, 'CANCELLED')} className="h-8 px-2 text-rose-400 hover:bg-rose-500/10 rounded-xl text-xs cursor-pointer" title="Cancel Order">
                        <XCircle className="h-3.5 w-3.5 mr-1" /> Cancel
                      </Button>
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl text-slate-400 text-xs">
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
