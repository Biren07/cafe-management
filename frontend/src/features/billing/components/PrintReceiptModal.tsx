'use client';

import { useRef } from 'react';
import { Bill } from '../types/billing.types';
import { Order } from '@/types/order';
import { X, Printer, Receipt, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PrintReceiptModalProps {
  isOpen: boolean;
  bill: Bill | null;
  onClose: () => void;
}

export function PrintReceiptModal({ isOpen, bill, onClose }: PrintReceiptModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !bill) return null;

  const orderObj = typeof bill.order === 'object' && bill.order ? (bill.order as Order) : null;
  const tableObj = orderObj && typeof orderObj.table === 'object' && orderObj.table ? orderObj.table : null;
  const createdAt = new Date(bill.createdAt).toLocaleString();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Printer className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold text-slate-100">Print Receipt Preview</h3>
              <p className="text-[11px] text-slate-400 font-mono">#{bill.receiptNumber}</p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Thermal Receipt Printable Container */}
        <div className="flex-1 overflow-y-auto my-4 p-4 rounded-2xl bg-white text-slate-900 font-mono text-xs shadow-inner select-none print:shadow-none" ref={printRef}>
          {/* Cafe Branding Header */}
          <div className="text-center pb-3 border-b border-dashed border-slate-400">
            <h2 className="font-extrabold text-base tracking-wider uppercase">CAFE MANAGEMENT</h2>
            <p className="text-[10px] text-slate-600">123 Main Street, Suite 100</p>
            <p className="text-[10px] text-slate-600">Tel: +1 (555) 019-2834</p>
          </div>

          {/* Bill Metadata */}
          <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>Receipt #:</span>
              <span className="font-bold">{bill.receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{createdAt}</span>
            </div>
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="font-bold">{orderObj?.orderType || 'DINE_IN'}</span>
            </div>
            {tableObj && (
              <div className="flex justify-between">
                <span>Table:</span>
                <span className="font-bold">#{tableObj.tableNumber} - {tableObj.tableName}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Payment Status:</span>
              <span className="font-bold uppercase text-slate-800">{bill.status}</span>
            </div>
          </div>

          {/* Itemized Order List */}
          <div className="py-3 border-b border-dashed border-slate-400 space-y-2">
            <div className="flex justify-between font-bold text-[10px] uppercase text-slate-700">
              <span>Item Qty</span>
              <span>Price</span>
              <span>Amount</span>
            </div>

            {orderObj?.items && orderObj.items.length > 0 ? (
              orderObj.items.map((item, idx) => {
                const name = item.name || (typeof item.menuItem === 'object' ? item.menuItem.name : 'Item');
                return (
                  <div key={idx} className="space-y-0.5">
                    <div className="font-bold">{name}</div>
                    <div className="flex justify-between text-[11px] text-slate-700">
                      <span>{item.quantity} x Rs.{item.price.toFixed(2)}</span>
                      <span>Rs.{(item.subtotal || item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-slate-500 italic text-center py-2">Item details included in POS order</div>
            )}
          </div>

          {/* Financial Breakdown */}
          <div className="py-3 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs.{(bill.subtotal || 0).toFixed(2)}</span>
            </div>
            {bill.tax > 0 && (
              <div className="flex justify-between">
                <span>Tax</span>
                <span>Rs.{bill.tax.toFixed(2)}</span>
              </div>
            )}
            {bill.serviceCharge > 0 && (
              <div className="flex justify-between">
                <span>Service Charge</span>
                <span>Rs.{bill.serviceCharge.toFixed(2)}</span>
              </div>
            )}
            {bill.discount > 0 && (
              <div className="flex justify-between font-semibold">
                <span>Discount</span>
                <span>-Rs.{bill.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-extrabold pt-2 border-t border-slate-400">
              <span>TOTAL</span>
              <span>Rs.{(bill.grandTotal || 0).toFixed(2)}</span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-3 text-center text-[10px] text-slate-600 space-y-1">
            <p className="font-semibold">Thank you for dining with us!</p>
            <p>Please come again.</p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800 shrink-0">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={handlePrint}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Printer className="h-4 w-4 mr-1.5" />
            <span>Print Receipt</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
