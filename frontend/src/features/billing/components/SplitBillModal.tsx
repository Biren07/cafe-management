'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Bill } from '../types/billing.types';
import { useSplitBillMutation } from '../services/billingApi';
import { X, Split, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SplitBillModalProps {
  isOpen: boolean;
  bill: Bill | null;
  onClose: () => void;
}

export function SplitBillModal({ isOpen, bill, onClose }: SplitBillModalProps) {
  const [splitCount, setSplitCount] = useState<number>(2);
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [customAmounts, setCustomAmounts] = useState<number[]>([0, 0]);

  const [splitBill, { isLoading }] = useSplitBillMutation();

  if (!isOpen || !bill) return null;

  const grandTotal = bill.grandTotal || 0;
  const equalAmount = (grandTotal / splitCount).toFixed(2);

  const handleSplitCountChange = (count: number) => {
    const validCount = Math.max(2, Math.min(10, count));
    setSplitCount(validCount);

    const baseAmount = Number((grandTotal / validCount).toFixed(2));
    const newCustoms = Array(validCount).fill(baseAmount);
    setCustomAmounts(newCustoms);
  };

  const handleCustomAmountChange = (index: number, val: number) => {
    setCustomAmounts((prev) => {
      const updated = [...prev];
      updated[index] = val;
      return updated;
    });
  };

  const customSum = customAmounts.reduce((a, b) => a + (Number(b) || 0), 0);
  const isCustomSumValid = Math.abs(customSum - grandTotal) < 0.05;

  const handleConfirmSplit = async () => {
    try {
      const payload: { id: string; splitCount: number; customAmounts?: number[] } = {
        id: bill._id,
        splitCount,
      };

      if (splitType === 'custom') {
        if (!isCustomSumValid) {
          toast.error(`Custom split total (Rs.${customSum.toFixed(2)}) must equal Grand Total (Rs.${grandTotal.toFixed(2)}).`);
          return;
        }
        payload.customAmounts = customAmounts.map((a) => Number(a));
      }

      const res = await splitBill(payload).unwrap();
      if (res.success) {
        toast.success(`Bill #${bill.receiptNumber} split into ${splitCount} payments successfully!`);
        onClose();
      } else {
        toast.error(res.message || 'Failed to split bill.');
      }
    } catch (err: unknown) {
      const errorMsg = (err as { data?: { message?: string } })?.data?.message || 'Failed to split bill.';
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Split className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-slate-100">Split Bill</h3>
              <p className="text-xs text-slate-400 font-mono">Receipt #{bill.receiptNumber}</p>
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

        {/* Form Body */}
        <div className="mt-4 space-y-4">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Bill Grand Total</span>
            <span className="font-mono text-base font-extrabold text-amber-400">
              Rs.{grandTotal.toFixed(2)}
            </span>
          </div>

          {/* Number of People */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1">
              <Users className="h-3.5 w-3.5 text-purple-400" />
              <span>Split Among (Number of Guests)</span>
            </label>
            <div className="flex items-center space-x-2">
              {[2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleSplitCountChange(num)}
                  className={`flex-1 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    splitCount === num
                      ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-purple-500/50'
                  }`}
                >
                  {num} Guests
                </button>
              ))}
            </div>
          </div>

          {/* Split Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setSplitType('equal')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                splitType === 'equal' ? 'bg-slate-800 text-slate-100 font-bold' : 'text-slate-400'
              }`}
            >
              Equal Shares (Rs.{equalAmount} / person)
            </button>
            <button
              type="button"
              onClick={() => setSplitType('custom')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                splitType === 'custom' ? 'bg-slate-800 text-slate-100 font-bold' : 'text-slate-400'
              }`}
            >
              Custom Amounts
            </button>
          </div>

          {/* Breakdown Preview */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3.5 space-y-2 max-h-40 overflow-y-auto">
            {splitType === 'equal' ? (
              [...Array(splitCount)].map((_, i) => (
                <div key={i} className="flex justify-between items-center text-xs text-slate-300">
                  <span>Guest #{i + 1} Share</span>
                  <span className="font-mono font-bold text-purple-300">Rs.{equalAmount}</span>
                </div>
              ))
            ) : (
              <div className="space-y-2">
                {[...Array(splitCount)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-slate-400">Guest #{i + 1}</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={customAmounts[i] || ''}
                      onChange={(e) => handleCustomAmountChange(i, Number(e.target.value))}
                      className="h-8 text-xs font-mono bg-slate-900 border-slate-800 text-slate-100 rounded-lg w-32"
                    />
                  </div>
                ))}
                {!isCustomSumValid && (
                  <p className="text-[11px] text-rose-400 flex items-center space-x-1 mt-1">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>Sum: Rs.{customSum.toFixed(2)} (Diff: Rs.{(grandTotal - customSum).toFixed(2)})</span>
                  </p>
                )}
              </div>
            )}
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
              onClick={handleConfirmSplit}
              disabled={isLoading || (splitType === 'custom' && !isCustomSumValid)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-600/20 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Splitting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <CheckCircle className="h-4 w-4" />
                  <span>Confirm Split ({splitCount} Shares)</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
