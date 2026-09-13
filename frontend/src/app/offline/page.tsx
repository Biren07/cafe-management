'use client';

import { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, Coffee, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function OfflinePage() {
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      window.location.reload();
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const handleRetry = () => {
    setIsChecking(true);
    if (navigator.onLine) {
      window.location.reload();
    } else {
      setTimeout(() => {
        setIsChecking(false);
      }, 1000);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-xl">
        {/* Brand emblem */}
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/80 shadow-xs">
          <Coffee className="h-7 w-7 stroke-[2.2]" />
        </div>

        {/* Offline Status Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1 text-xs font-semibold text-rose-800">
          <WifiOff className="h-3.5 w-3.5" />
          <span>You are currently offline</span>
        </div>

        <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900">
          No Internet Connection
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Artisan Cafe Management requires an active network connection to process live orders, sync table statuses, and manage billing securely.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex w-full flex-col gap-3">
          <Button
            onClick={handleRetry}
            disabled={isChecking}
            className="w-full h-11 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Checking Connection...' : 'Retry Connection'}</span>
          </Button>

          <Link
            href="/"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>

        <p className="mt-6 text-[11px] text-slate-400">
          The app will automatically reload as soon as your device reconnects to Wi-Fi or mobile data.
        </p>
      </div>
    </div>
  );
}
