'use client';

import { Bill, BillStatus } from '../types/billing.types';
import { BILL_STATUS_CONFIG } from '../utils/status.utils';
import { Order } from '@/types/order';
import { Printer, Split, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BillingTableProps {
  bills: Bill[];
  totalCount: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onPrint: (bill: Bill) => void;
  onSplit: (bill: Bill) => void;
  onStatusChange: (billId: string, status: BillStatus) => Promise<void>;
}

export function BillingTable({
  bills,
  totalCount,
  page,
  limit,
  onPageChange,
  onLimitChange,
  onPrint,
  onSplit,
  onStatusChange,
}: BillingTableProps) {
  const totalPages = Math.ceil(totalCount / limit) || 1;

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th scope="col" className="px-5 py-4">Receipt #</th>
              <th scope="col" className="px-5 py-4">Order / Table</th>
              <th scope="col" className="px-5 py-4">Breakdown</th>
              <th scope="col" className="px-5 py-4">Grand Total</th>
              <th scope="col" className="px-5 py-4">Status</th>
              <th scope="col" className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {bills.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                  No invoices or bills found matching your filters.
                </td>
              </tr>
            ) : (
              bills.map((bill) => {
                const config = BILL_STATUS_CONFIG[bill.status] || BILL_STATUS_CONFIG.PENDING;
                const orderObj = typeof bill.order === 'object' && bill.order ? (bill.order as Order) : null;
                const tableObj = orderObj && typeof orderObj.table === 'object' && orderObj.table ? orderObj.table : null;

                return (
                  <tr key={bill._id} className="hover:bg-slate-800/40 transition-colors group">
                    {/* Receipt # */}
                    <td className="px-5 py-4 font-mono font-bold text-amber-400 whitespace-nowrap">
                      #{bill.receiptNumber}
                      {bill.isSplit && (
                        <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Split
                        </span>
                      )}
                    </td>

                    {/* Order & Table */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-200">
                        {orderObj ? `Order #${orderObj.orderNumber || orderObj._id.slice(-6)}` : 'N/A'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {tableObj ? `Table #${tableObj.tableNumber}` : orderObj?.orderType || 'Take-Away'}
                      </div>
                    </td>

                    {/* Financial Breakdown */}
                    <td className="px-5 py-4 text-[11px] text-slate-400">
                      <div>Subtotal: <span className="font-mono text-slate-200">Rs.{(bill.subtotal || 0).toFixed(2)}</span></div>
                      <div>
                        Tax: Rs.{bill.tax || 0} | Disc: Rs.{bill.discount || 0}
                      </div>
                    </td>

                    {/* Grand Total */}
                    <td className="px-5 py-4 font-mono font-extrabold text-amber-400 text-sm whitespace-nowrap">
                      Rs.{(bill.grandTotal || 0).toFixed(2)}
                    </td>

                    {/* Status Pill with Quick Select */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="relative inline-block">
                        <select
                          value={bill.status}
                          onChange={(e) => onStatusChange(bill._id, e.target.value as BillStatus)}
                          className={`appearance-none h-7 pl-2.5 pr-6 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500 ${config.badgeClass}`}
                        >
                          <option value="PENDING" className="bg-slate-900 text-amber-400">Pending</option>
                          <option value="PAID" className="bg-slate-900 text-emerald-400">Paid</option>
                          <option value="CANCELLED" className="bg-slate-900 text-rose-400">Cancelled</option>
                        </select>
                        <ChevronDown className={`pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${config.colorClass}`} />
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {/* Print Receipt */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onPrint(bill)}
                          className="h-8 px-2.5 rounded-lg text-slate-300 hover:text-amber-400 hover:bg-amber-400/10 text-xs cursor-pointer"
                          title="Print Thermal Receipt"
                        >
                          <Printer className="h-3.5 w-3.5 mr-1" />
                          <span>Print</span>
                        </Button>

                        {/* Split Bill */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => onSplit(bill)}
                          className="h-8 w-8 rounded-lg text-slate-400 hover:text-purple-400 hover:bg-purple-400/10 cursor-pointer"
                          title="Split Bill"
                        >
                          <Split className="h-4 w-4" />
                        </Button>

                        {/* Quick Mark Paid */}
                        {bill.status === 'PENDING' && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => onStatusChange(bill._id, 'PAID')}
                            className="h-8 w-8 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 cursor-pointer"
                            title="Mark as Paid"
                          >
                            <CheckCircle2 className="h-4 w-4" />
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
        {bills.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center text-xs text-slate-500">
            No invoices or bills found matching your filters.
          </div>
        ) : (
          bills.map((bill) => {
            const config = BILL_STATUS_CONFIG[bill.status] || BILL_STATUS_CONFIG.PENDING;
            const orderObj = typeof bill.order === 'object' && bill.order ? (bill.order as Order) : null;
            const tableObj = orderObj && typeof orderObj.table === 'object' && orderObj.table ? orderObj.table : null;

            return (
              <div
                key={bill._id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3 shadow-lg"
              >
                {/* Header: Receipt #, Order, and Status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 text-sm">
                        #{bill.receiptNumber}
                      </span>
                      {bill.isSplit && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Split
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-200 mt-1">
                      {orderObj ? `Order #${orderObj.orderNumber || orderObj._id.slice(-6)}` : 'N/A'}
                      <span className="text-slate-400 text-[11px] font-normal ml-2">
                        {tableObj ? `Table #${tableObj.tableNumber}` : orderObj?.orderType || 'Take-Away'}
                      </span>
                    </p>
                  </div>

                  {/* Status Dropdown */}
                  <div className="shrink-0">
                    <div className="relative inline-block">
                      <select
                        value={bill.status}
                        onChange={(e) => onStatusChange(bill._id, e.target.value as BillStatus)}
                        className={`appearance-none h-7 pl-2 pr-5 rounded-lg text-[11px] font-semibold border cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500 ${config.badgeClass}`}
                      >
                        <option value="PENDING" className="bg-slate-900 text-amber-400">Pending</option>
                        <option value="PAID" className="bg-slate-900 text-emerald-400">Paid</option>
                        <option value="CANCELLED" className="bg-slate-900 text-rose-400">Cancelled</option>
                      </select>
                      <ChevronDown className={`pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 ${config.colorClass}`} />
                    </div>
                  </div>
                </div>

                {/* Financial breakdown */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                  <span>Subtotal: <strong className="text-slate-200 font-mono">Rs.{(bill.subtotal || 0).toFixed(2)}</strong></span>
                  <span>Tax: Rs.{bill.tax || 0}</span>
                  <span>Disc: Rs.{bill.discount || 0}</span>
                </div>

                {/* Footer: Grand total & actions */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Total</span>
                    <span className="font-mono font-extrabold text-amber-400 text-base">
                      Rs. {(bill.grandTotal || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onPrint(bill)}
                      className="h-8 px-2.5 rounded-xl border-slate-700 bg-slate-800 text-slate-200 hover:text-amber-400 text-xs cursor-pointer"
                    >
                      <Printer className="h-3.5 w-3.5 mr-1" />
                      <span>Print</span>
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onSplit(bill)}
                      className="h-8 w-8 rounded-xl text-slate-400 hover:text-purple-400 hover:bg-purple-400/10 cursor-pointer"
                      title="Split Bill"
                    >
                      <Split className="h-4 w-4" />
                    </Button>

                    {bill.status === 'PENDING' && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onStatusChange(bill._id, 'PAID')}
                        className="h-8 w-8 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 cursor-pointer"
                        title="Mark as Paid"
                      >
                        <CheckCircle2 className="h-4 w-4" />
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
