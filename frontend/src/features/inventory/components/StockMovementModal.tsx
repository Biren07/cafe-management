'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { InventoryItem } from '../types/inventory.types';
import { useStockInMutation, useStockOutMutation } from '../services/inventoryApi';
import { X, ArrowDownRight, ArrowUpRight, CheckCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StockMovementModalProps {
  isOpen: boolean;
  item: InventoryItem | null;
  mode: 'IN' | 'OUT';
  onClose: () => void;
}

export function StockMovementModal({
  isOpen,
  item,
  mode,
  onClose,
}: StockMovementModalProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>('');

  const [stockIn, { isLoading: isStockInLoading }] = useStockInMutation();
  const [stockOut, { isLoading: isStockOutLoading }] = useStockOutMutation();

  const isLoading = isStockInLoading || isStockOutLoading;

  if (!isOpen || !item) return null;

  const isStockIn = mode === 'IN';

  const handleSubmit = async () => {
    if (!quantity || quantity <= 0) {
      toast.error('Quantity must be greater than 0.');
      return;
    }

    try {
      if (isStockIn) {
        const res = await stockIn({
          id: item._id,
          quantity: Number(quantity),
          reason: reason || undefined,
        }).unwrap();

        if (res.success) {
          toast.success(`Added ${quantity} ${item.unit} to "${item.itemName}" stock.`);
          onClose();
        } else {
          toast.error(res.message || 'Failed to record stock in.');
        }
      } else {
        const res = await stockOut({
          id: item._id,
          quantity: Number(quantity),
          reason: reason || undefined,
        }).unwrap();

        if (res.success) {
          toast.success(`Deducted ${quantity} ${item.unit} from "${item.itemName}" stock.`);
          onClose();
        } else {
          toast.error(res.message || 'Failed to record stock out.');
        }
      }
    } catch (err: unknown) {
      const errorMsg = (err as { data?: { message?: string } })?.data?.message || 'Failed to record stock movement.';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                isStockIn
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
            >
              {isStockIn ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-slate-100">
                {isStockIn ? 'Stock In (Add Stock)' : 'Stock Out (Reduce Stock)'}
              </h3>
              <p className="text-xs text-slate-400 font-semibold">{item.itemName}</p>
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

        {/* Current Stock info */}
        <div className="my-4 p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-400">Current Stock</span>
          <span className="font-mono font-bold text-amber-400 text-sm">
            {item.currentStock} {item.unit}
          </span>
        </div>

        {/* Form Body */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Quantity to {isStockIn ? 'Add' : 'Deduct'} ({item.unit}) *
            </label>
            <Input
              type="number"
              min={0.1}
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="h-10 bg-slate-950 border-slate-800 text-xs font-mono text-slate-100 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Reason / Notes (Optional)
            </label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                isStockIn
                  ? 'e.g. Supplier delivery, Monthly restocking'
                  : 'e.g. Daily kitchen consumption, Spoilage/waste'
              }
              className="h-10 bg-slate-950 border-slate-800 text-xs text-slate-100 rounded-xl"
            />
          </div>

          {/* New Stock Preview */}
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Projected New Stock</span>
            <span className="font-mono font-extrabold text-slate-100 text-sm">
              {isStockIn ? item.currentStock + (Number(quantity) || 0) : Math.max(0, item.currentStock - (Number(quantity) || 0))} {item.unit}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
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
              onClick={handleSubmit}
              disabled={isLoading}
              className={`font-bold text-xs rounded-xl shadow-md cursor-pointer ${
                isStockIn
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/20'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <CheckCircle className="h-4 w-4" />
                  <span>Confirm {isStockIn ? 'Stock In' : 'Stock Out'}</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
