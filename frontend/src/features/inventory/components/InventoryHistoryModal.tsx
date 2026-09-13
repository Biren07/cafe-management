'use client';

import { InventoryItem } from '../types/inventory.types';
import { useGetItemHistoryQuery } from '../services/inventoryApi';
import { X, History, ArrowDownRight, ArrowUpRight, Sliders, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InventoryHistoryModalProps {
  isOpen: boolean;
  item: InventoryItem | null;
  onClose: () => void;
}

export function InventoryHistoryModal({
  isOpen,
  item,
  onClose,
}: InventoryHistoryModalProps) {
  const { data: historyResponse, isLoading } = useGetItemHistoryQuery(item?._id || '', {
    skip: !isOpen || !item,
  });

  if (!isOpen || !item) return null;

  const historyList = historyResponse?.data?.history || item.history || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-slate-100">Stock Movement History</h3>
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

        {/* History List Body */}
        <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-1">
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 rounded-2xl bg-slate-950 border border-slate-800 animate-pulse" />
              ))}
            </div>
          ) : historyList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-xs">
              <History className="h-8 w-8 mb-2 opacity-40" />
              <p>No transaction history logs found for this item.</p>
            </div>
          ) : (
            historyList.map((log, idx) => {
              const isIn = log.type === 'IN';
              const isOut = log.type === 'OUT';
              const dateStr = new Date(log.createdAt).toLocaleString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                        isIn
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : isOut
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                      }`}
                    >
                      {isIn ? (
                        <ArrowDownRight className="h-4 w-4" />
                      ) : isOut ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <Sliders className="h-4 w-4" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-100">
                          {isIn ? `+${log.quantity}` : isOut ? `-${log.quantity}` : log.quantity} {item.unit}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({log.previousStock} → {log.newStock})
                        </span>
                      </div>
                      {log.reason && (
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{log.reason}</p>
                      )}
                    </div>
                  </div>

                  <div className="text-right text-[10px] text-slate-500 shrink-0">
                    <div className="flex items-center space-x-1 justify-end">
                      <Calendar className="h-3 w-3" />
                      <span>{dateStr}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-slate-800 shrink-0">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
