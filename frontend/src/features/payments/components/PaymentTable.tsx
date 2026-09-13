'use client';

import { Payment, PaymentStatus } from '../types/payment.types';
import { PAYMENT_STATUS_CONFIG, PAYMENT_METHOD_CONFIG } from '../utils/status.utils';
import { Order } from '@/types/order';
import { Eye, ChevronDown, ChevronLeft, ChevronRight, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaymentTableProps {
  payments: Payment[];
  totalCount: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onViewInvoice: (payment: Payment) => void;
  onStatusChange: (paymentId: string, status: PaymentStatus) => Promise<void>;
}

export function PaymentTable({
  payments,
  totalCount,
  page,
  limit,
  onPageChange,
  onLimitChange,
  onViewInvoice,
  onStatusChange,
}: PaymentTableProps) {
  const totalPages = Math.ceil(totalCount / limit) || 1;

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th scope="col" className="px-5 py-4">Invoice #</th>
              <th scope="col" className="px-5 py-4">Order #</th>
              <th scope="col" className="px-5 py-4">Method</th>
              <th scope="col" className="px-5 py-4">Amount</th>
              <th scope="col" className="px-5 py-4">Status</th>
              <th scope="col" className="px-5 py-4">Reference</th>
              <th scope="col" className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                  No payment transactions found matching your filters.
                </td>
              </tr>
            ) : (
              payments.map((p) => {
                const statusCfg = PAYMENT_STATUS_CONFIG[p.paymentStatus] || PAYMENT_STATUS_CONFIG.COMPLETED;
                const methodCfg = PAYMENT_METHOD_CONFIG[p.paymentMethod] || PAYMENT_METHOD_CONFIG.CASH;
                const MethodIcon = methodCfg.icon;

                const orderObj = typeof p.order === 'object' && p.order ? (p.order as Order) : null;
                const dateStr = new Date(p.createdAt).toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <tr key={p._id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="px-5 py-4 font-mono font-bold text-amber-400 whitespace-nowrap">
                      #{p.invoiceNumber}
                      <span className="block text-[10px] text-slate-400 font-normal">{dateStr}</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-mono font-semibold text-slate-200">
                      {orderObj ? `#${orderObj.orderNumber || orderObj._id.slice(-6)}` : 'N/A'}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${methodCfg.badgeClass}`}>
                          <MethodIcon className="h-3.5 w-3.5" />
                          <span>{methodCfg.label}</span>
                        </span>
                        {p.paymentMethod === 'ONLINE' && p.onlineProvider && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300">
                            {p.onlineProvider}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono font-extrabold text-emerald-400 text-sm whitespace-nowrap">
                      Rs.{(p.amount || 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="relative inline-block">
                        <select
                          value={p.paymentStatus}
                          onChange={(e) => onStatusChange(p._id, e.target.value as PaymentStatus)}
                          className={`appearance-none h-7 pl-2.5 pr-6 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500 ${statusCfg.badgeClass}`}
                        >
                          <option value="COMPLETED" className="bg-slate-900 text-emerald-400">Completed</option>
                          <option value="PENDING" className="bg-slate-900 text-amber-400">Pending</option>
                          <option value="FAILED" className="bg-slate-900 text-rose-400">Failed</option>
                          <option value="REFUNDED" className="bg-slate-900 text-purple-400">Refunded</option>
                        </select>
                        <ChevronDown className={`pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${statusCfg.colorClass}`} />
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {p.referenceNumber ? p.referenceNumber : <span className="text-slate-600 italic">None</span>}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewInvoice(p)}
                        className="h-8 px-2.5 rounded-lg text-slate-300 hover:text-amber-400 hover:bg-amber-400/10 text-xs cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        <span>Invoice</span>
                      </Button>
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
        {payments.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center text-xs text-slate-500">
            No payment transactions found matching your filters.
          </div>
        ) : (
          payments.map((p) => {
            const statusCfg = PAYMENT_STATUS_CONFIG[p.paymentStatus] || PAYMENT_STATUS_CONFIG.COMPLETED;
            const methodCfg = PAYMENT_METHOD_CONFIG[p.paymentMethod] || PAYMENT_METHOD_CONFIG.CASH;
            const MethodIcon = methodCfg.icon;
            const orderObj = typeof p.order === 'object' && p.order ? (p.order as Order) : null;
            const dateStr = new Date(p.createdAt).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={p._id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3 shadow-lg"
              >
                {/* Header: Invoice # & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      #{p.invoiceNumber}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{dateStr}</p>
                  </div>

                  {/* Status Dropdown */}
                  <div className="shrink-0">
                    <div className="relative inline-block">
                      <select
                        value={p.paymentStatus}
                        onChange={(e) => onStatusChange(p._id, e.target.value as PaymentStatus)}
                        className={`appearance-none h-7 pl-2 pr-5 rounded-lg text-[11px] font-semibold border cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500 ${statusCfg.badgeClass}`}
                      >
                        <option value="COMPLETED" className="bg-slate-900 text-emerald-400">Completed</option>
                        <option value="PENDING" className="bg-slate-900 text-amber-400">Pending</option>
                        <option value="FAILED" className="bg-slate-900 text-rose-400">Failed</option>
                        <option value="REFUNDED" className="bg-slate-900 text-purple-400">Refunded</option>
                      </select>
                      <ChevronDown className={`pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 ${statusCfg.colorClass}`} />
                    </div>
                  </div>
                </div>

                {/* Details row: Order & Method */}
                <div className="flex items-center justify-between gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Order</span>
                    <span className="font-mono font-semibold text-slate-200">
                      {orderObj ? `#${orderObj.orderNumber || orderObj._id.slice(-6)}` : 'N/A'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Method</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${methodCfg.badgeClass}`}>
                        <MethodIcon className="h-3 w-3" />
                        <span>{methodCfg.label}</span>
                      </span>
                      {p.paymentMethod === 'ONLINE' && p.onlineProvider && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300">
                          {p.onlineProvider}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer: Amount & Invoice Action */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Amount</span>
                    <span className="font-mono font-extrabold text-emerald-400 text-base">
                      Rs. {(p.amount || 0).toFixed(2)}
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onViewInvoice(p)}
                    className="h-8 px-3 rounded-xl border-slate-700 bg-slate-800 text-slate-200 hover:text-amber-400 text-xs cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    <span>View Invoice</span>
                  </Button>
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
