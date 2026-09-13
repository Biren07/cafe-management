'use client';

import { Order } from '../types/order.types';
import { ORDER_STATUS_CONFIG } from '../utils/status.utils';
import { X, Receipt, Armchair, ShoppingBag, Calendar, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderDetailsModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onGenerateBill?: (order: Order) => void;
}

export function OrderDetailsModal({
  isOpen,
  order,
  onClose,
  onGenerateBill,
}: OrderDetailsModalProps) {
  if (!isOpen || !order) return null;

  const config = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.PENDING;
  const tableInfo = typeof order.table === 'object' && order.table ? order.table : null;
  const createdAt = new Date(order.createdAt).toLocaleString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-100 font-mono">
                Order #{order.orderNumber || order._id.slice(-6).toUpperCase()}
              </h2>
              <p className="text-xs text-slate-400 flex items-center space-x-1">
                <Calendar className="h-3 w-3 inline text-slate-500" />
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

        {/* Metadata info */}
        <div className="my-4 grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Order Type</span>
            <div className="mt-1 flex items-center space-x-1.5 text-slate-200 font-bold">
              {order.orderType === 'DINE_IN' ? (
                <>
                  <Armchair className="h-4 w-4 text-amber-400" />
                  <span>Dine-In</span>
                  {tableInfo && (
                    <span className="ml-1 text-[11px] font-mono text-amber-300">
                      (Table #{tableInfo.tableNumber})
                    </span>
                  )}
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4 text-sky-400" />
                  <span>Take-Away</span>
                </>
              )}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Status</span>
            <div className="mt-1">
              <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${config.badgeClass}`}>
                <config.icon className="h-3.5 w-3.5" />
                <span>{config.label}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden my-4">
          <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
            <span>Item</span>
            <div className="space-x-8">
              <span>Qty x Price</span>
              <span>Subtotal</span>
            </div>
          </div>

          <div className="divide-y divide-slate-800/60 max-h-48 overflow-y-auto px-4 text-xs text-slate-200">
            {order.items.map((item, idx) => {
              const name = item.name || (typeof item.menuItem === 'object' ? item.menuItem.name : 'Menu Item');
              return (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <span className="font-semibold text-slate-100">{name}</span>
                  <div className="flex items-center space-x-8">
                    <span className="text-slate-400 font-mono">
                      {item.quantity} x Rs.{item.price.toFixed(2)}
                    </span>
                    <span className="font-mono font-bold text-amber-400">
                      Rs.{(item.subtotal || item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals Summary */}
          <div className="p-3.5 bg-slate-900/90 border-t border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span className="font-mono text-slate-200">Rs.{(order.subtotal || 0).toFixed(2)}</span>
            </div>
            {order.tax > 0 && (
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Tax</span>
                <span className="font-mono">Rs.{order.tax.toFixed(2)}</span>
              </div>
            )}
            {order.serviceCharge > 0 && (
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Service Charge</span>
                <span className="font-mono">Rs.{order.serviceCharge.toFixed(2)}</span>
              </div>
            )}
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-400 text-[11px]">
                <span>Discount</span>
                <span className="font-mono">-Rs.{order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-800 flex justify-between font-extrabold text-sm text-slate-100">
              <span>Grand Total</span>
              <span className="font-mono text-amber-400 text-base">Rs.{(order.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {order.notes && (
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start space-x-2">
            <FileText className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-300 block">Notes:</strong>
              <span>{order.notes}</span>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-5 flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            Close
          </Button>

          {onGenerateBill && (
            <Button
              type="button"
              onClick={() => {
                onClose();
                onGenerateBill(order);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Receipt className="h-4 w-4 mr-1.5" />
              <span>Generate Bill</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
