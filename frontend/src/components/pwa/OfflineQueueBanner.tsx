'use client';

import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import { CloudUpload, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export function OfflineQueueBanner() {
  const { pendingCount, isSyncing, syncQueue } = useOfflineQueue();
  const { isOffline } = useNetworkStatus();

  if (pendingCount === 0 && !isSyncing) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md px-3.5 py-2.5 shadow-lg">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-xl ${
            isSyncing
              ? 'bg-amber-50 text-amber-700'
              : isOffline
              ? 'bg-slate-100 text-slate-700'
              : 'bg-emerald-50 text-emerald-700'
          }`}
        >
          {isSyncing ? (
            <RefreshCw className="h-4 w-4 animate-spin stroke-[2.2]" />
          ) : isOffline ? (
            <CloudUpload className="h-4 w-4 stroke-[2.2]" />
          ) : (
            <CheckCircle2 className="h-4 w-4 stroke-[2.2]" />
          )}
        </div>

        <div className="text-xs">
          <p className="font-bold text-slate-900 leading-tight">
            {isSyncing
              ? 'Syncing offline actions...'
              : `${pendingCount} action${pendingCount > 1 ? 's' : ''} queued offline`}
          </p>
          <p className="text-[11px] text-slate-500">
            {isOffline ? 'Will auto-sync when online' : 'Ready to synchronize'}
          </p>
        </div>

        {!isOffline && !isSyncing && (
          <button
            type="button"
            onClick={() => syncQueue()}
            className="rounded-lg bg-amber-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-amber-700 transition-colors cursor-pointer shadow-2xs"
          >
            Sync Now
          </button>
        )}
      </div>
    </div>
  );
}
