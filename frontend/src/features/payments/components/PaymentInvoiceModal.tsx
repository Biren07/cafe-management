'use client';

import { Payment } from '../types/payment.types';
import { PAYMENT_STATUS_CONFIG, PAYMENT_METHOD_CONFIG } from '../utils/status.utils';
import { Order } from '@/types/order';
import { X, Printer, Receipt, Calendar, CreditCard, Banknote, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaymentInvoiceModalProps {
  isOpen: boolean;
  payment: Payment | null;
  onClose: () => void;
}

export function PaymentInvoiceModal({
  isOpen,
  payment,
  onClose,
}: PaymentInvoiceModalProps) {
  if (!isOpen || !payment) return null;

  const statusConfig = PAYMENT_STATUS_CONFIG[payment.paymentStatus] || PAYMENT_STATUS_CONFIG.COMPLETED;
  const methodConfig = PAYMENT_METHOD_CONFIG[payment.paymentMethod] || PAYMENT_METHOD_CONFIG.CASH;
  const MethodIcon = methodConfig.icon;

  const orderObj = typeof payment.order === 'object' && payment.order ? (payment.order as Order) : null;
  const createdAt = new Date(payment.createdAt).toLocaleString();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-base font-bold text-slate-100 font-mono">
                Invoice #{payment.invoiceNumber}
              </h2>
              <p className="text-xs text-slate-400 flex items-center space-x-1">
                <Calendar className="h-3 w-3 text-slate-500" />
                <span>{createdAt}</span>
              </p>
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

        {/* Invoice Metadata Body */}
        <div className="my-5 space-y-3 text-xs">
          {/* Status & Method Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Payment Method</span>
              <div className="mt-1 flex items-center space-x-1.5 font-bold text-slate-200">
                <MethodIcon className="h-4 w-4 text-amber-400" />
                <span>{methodConfig.label}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Status</span>
              <div className="mt-1">
                <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusConfig.badgeClass}`}>
                  <statusConfig.icon className="h-3.5 w-3.5" />
                  <span>{statusConfig.label}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Reference # if available */}
          {payment.referenceNumber && (
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400 text-[11px]">Transaction Reference:</span>
              <span className="font-mono font-bold text-amber-300 text-xs">{payment.referenceNumber}</span>
            </div>
          )}

          {/* Order Details */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-300 font-semibold border-b border-slate-800 pb-2">
              <span>Associated Order</span>
              <span className="font-mono text-amber-400">
                {orderObj ? `#${orderObj.orderNumber || orderObj._id.slice(-6)}` : 'N/A'}
              </span>
            </div>

            {orderObj && (
              <div className="space-y-1 text-slate-400 text-[11px]">
                <div className="flex justify-between">
                  <span>Order Type:</span>
                  <span className="text-slate-200">{orderObj.orderType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order Total:</span>
                  <span className="font-mono text-slate-200">Rs.{orderObj.total.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Total Paid */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-baseline font-extrabold text-sm">
            <span className="text-slate-100">Total Amount Paid</span>
            <span className="font-mono text-emerald-400 text-lg">Rs.{(payment.amount || 0).toFixed(2)}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
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
            <span>Print Invoice</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
