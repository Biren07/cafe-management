'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { X, Receipt, ShoppingBag, CheckCircle, Percent } from 'lucide-react';
import { useGetOrdersQuery } from '@/features/orders/services/orderApi';
import { useGenerateBillMutation } from '../services/billingApi';
import { Order } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface GenerateBillModalProps {
  isOpen: boolean;
  preselectedOrder?: Order | null;
  onClose: () => void;
}

export function GenerateBillModal({
  isOpen,
  preselectedOrder,
  onClose,
}: GenerateBillModalProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(preselectedOrder?._id || '');
  const [taxVal, setTaxVal] = useState<number>(preselectedOrder?.tax || 0);
  const [serviceChargeVal, setServiceChargeVal] = useState<number>(preselectedOrder?.serviceCharge || 0);
  const [discountVal, setDiscountVal] = useState<number>(preselectedOrder?.discount || 0);

  // Fetch orders without bill generated or pending status
  const { data: ordersResponse } = useGetOrdersQuery({ limit: 100 });
  const ordersList = ordersResponse?.data?.items || [];
  const activeOrders = ordersList.filter((o) => o.status !== 'CANCELLED');

  const [generateBill, { isLoading }] = useGenerateBillMutation();

  if (!isOpen) return null;

  const currentOrder = ordersList.find((o) => o._id === selectedOrderId) || preselectedOrder;
  const subtotal = currentOrder?.subtotal || currentOrder?.total || 0;
  const grandTotal = Math.max(0, subtotal + taxVal + serviceChargeVal - discountVal);

  const handleGenerate = async () => {
    if (!selectedOrderId && !preselectedOrder) {
      toast.error('Please select an order to generate a bill.');
      return;
    }

    try {
      const targetId = selectedOrderId || preselectedOrder!._id;
      const res = await generateBill({
        order: targetId,
        tax: taxVal,
        serviceCharge: serviceChargeVal,
        discount: discountVal,
      }).unwrap();

      if (res.success) {
        toast.success(`Bill generated successfully! Receipt #${res.data.receiptNumber || ''}`);
        onClose();
      } else {
        toast.error(res.message || 'Failed to generate bill.');
      }
    } catch (err: unknown) {
      const errorMsg = (err as { data?: { message?: string } })?.data?.message || 'Failed to generate bill.';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
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
              <h2 className="font-heading text-lg font-bold text-slate-100">Generate Invoice / Bill</h2>
              <p className="text-xs text-slate-400">Finalize order billing calculations</p>
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

        {/* Order Selector */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1">
              <ShoppingBag className="h-3.5 w-3.5 text-amber-400" />
              <span>Select Active Order *</span>
            </label>
            <select
              value={selectedOrderId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedOrderId(id);
                const ord = ordersList.find((o) => o._id === id);
                if (ord) {
                  setTaxVal(ord.tax || 0);
                  setServiceChargeVal(ord.serviceCharge || 0);
                  setDiscountVal(ord.discount || 0);
                }
              }}
              className="w-full h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="">-- Choose Order --</option>
              {activeOrders.map((o) => (
                <option key={o._id} value={o._id}>
                  Order #{o.orderNumber || o._id.slice(-6)} - {o.orderType} (Rs.{o.total.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {currentOrder && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                <span className="text-slate-400">Order Subtotal</span>
                <span className="font-mono font-bold text-slate-200">Rs.{subtotal.toFixed(2)}</span>
              </div>

              {/* Adjustments Grid */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Tax (Rs.)</label>
                  <Input
                    type="number"
                    min={0}
                    value={taxVal}
                    onChange={(e) => setTaxVal(Number(e.target.value))}
                    className="h-8 text-xs bg-slate-900 border-slate-800 text-slate-100 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Service Charge (Rs.)</label>
                  <Input
                    type="number"
                    min={0}
                    value={serviceChargeVal}
                    onChange={(e) => setServiceChargeVal(Number(e.target.value))}
                    className="h-8 text-xs bg-slate-900 border-slate-800 text-slate-100 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Discount (Rs.)</label>
                  <Input
                    type="number"
                    min={0}
                    value={discountVal}
                    onChange={(e) => setDiscountVal(Number(e.target.value))}
                    className="h-8 text-xs bg-slate-900 border-slate-800 text-slate-100 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline font-extrabold text-sm">
                <span className="text-slate-100">Calculated Grand Total</span>
                <span className="font-mono text-amber-400 text-base">Rs. {grandTotal.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading || !currentOrder}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  <span>Generating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <CheckCircle className="h-4 w-4" />
                  <span>Confirm Generate Bill</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
