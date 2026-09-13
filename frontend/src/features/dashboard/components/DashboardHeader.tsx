'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { RefreshCw, PlusCircle, Receipt, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  onRefresh?: () => void;
  isFetching?: boolean;
}

export function DashboardHeader({ onRefresh, isFetching }: DashboardHeaderProps) {
  const { user } = useAuth();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-800/80">
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 mb-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>{currentDate}</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
          Welcome back, <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-orange-300 bg-clip-text text-transparent">{user?.name || 'Manager'}</span> 👋
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Here is what is happening at your cafe today.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
            className="h-9 border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-amber-400 text-xs rounded-xl cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isFetching ? 'animate-spin text-amber-400' : ''}`} />
            <span>Refresh Data</span>
          </Button>
        )}

        <Button
          asChild
          size="sm"
          className="h-9 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20"
        >
          <Link href={ROUTES.DASHBOARD.ORDERS}>
            <PlusCircle className="h-3.5 w-3.5 mr-1.5 stroke-[2.5]" />
            <span>New Order</span>
          </Link>
        </Button>

        <Button
          asChild
          variant="secondary"
          size="sm"
          className="h-9 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl"
        >
          <Link href={ROUTES.DASHBOARD.BILLING}>
            <Receipt className="h-3.5 w-3.5 mr-1.5" />
            <span>POS Billing</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
