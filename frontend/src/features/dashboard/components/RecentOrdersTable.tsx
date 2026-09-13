'use client';

import Link from 'next/link';
import { Order, OrderStatus } from '@/types/order';
import { ROUTES } from '@/constants/routes';
import { Clock, ArrowRight, ShoppingBag } from 'lucide-react';

interface RecentOrdersTableProps {
  orders?: Order[];
}

export function RecentOrdersTable({ orders = [] }: RecentOrdersTableProps) {
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-50 text-amber-800 border-amber-200/80';
      case 'PREPARING':
        return 'bg-blue-50 text-blue-800 border-blue-200/80';
      case 'SERVED':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200/80';
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-800 border-rose-200/80';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const formatCurrency = (val: number) => `Rs.${val.toFixed(2)}`;

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-4 w-4 text-blue-600" />
            <h3 className="font-heading text-base font-bold text-slate-900">
              Recent Orders Feed
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Latest orders processed across tables and take-away counter
          </p>
        </div>

        <Link
          href={ROUTES.DASHBOARD.ORDERS}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        {orders.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No recent orders recorded today
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Table / Notes</th>
                <th className="pb-3 font-semibold">Total</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {orders.slice(0, 7).map((order) => {
                const tableName = typeof order.table === 'object' && order.table ? order.table.tableName || order.table.tableNumber : order.table || 'Takeaway';
                const formattedTime = new Date(order.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <tr key={order._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 font-mono font-bold text-amber-700">
                      {order.orderNumber}
                    </td>
                    <td className="py-3">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                        {order.orderType}
                      </span>
                    </td>
                    <td className="py-3 font-medium text-slate-700">
                      {tableName}
                    </td>
                    <td className="py-3 font-bold text-slate-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right text-slate-400 font-medium">
                      <div className="inline-flex items-center gap-1 justify-end">
                        <Clock className="h-3 w-3" />
                        <span>{formattedTime}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-2.5 sm:hidden">
        {orders.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No recent orders recorded today
          </div>
        ) : (
          orders.slice(0, 7).map((order) => {
            const tableName = typeof order.table === 'object' && order.table ? order.table.tableName || order.table.tableNumber : order.table || 'Takeaway';
            const formattedTime = new Date(order.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={order._id}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-700">{order.orderNumber}</span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>{order.orderType} • {tableName}</span>
                  <span className="flex items-center gap-1 font-mono text-slate-400">
                    <Clock className="h-2.5 w-2.5" />
                    {formattedTime}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-200 font-bold">
                  <span className="text-slate-500 text-[11px]">Total</span>
                  <span className="font-mono text-amber-700">{formatCurrency(order.total)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
