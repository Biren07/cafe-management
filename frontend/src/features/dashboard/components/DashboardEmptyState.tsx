import Link from 'next/link';
import { Coffee, PlusCircle, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

export function DashboardEmptyState() {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center backdrop-blur-md">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4 shadow-xl">
        <Coffee className="h-8 w-8" />
      </div>

      <h3 className="font-heading text-xl font-bold text-slate-100 mb-2">
        Welcome to your Cafe Admin Dashboard
      </h3>

      <p className="max-w-md text-xs sm:text-sm text-slate-400 mb-6">
        No sales analytics or order activity recorded yet. Get started by populating your menu catalog or placing your first customer order!
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <Button asChild className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl">
          <Link href={ROUTES.DASHBOARD.ORDERS}>
            <PlusCircle className="h-4 w-4 mr-1.5" /> Create First Order
          </Link>
        </Button>

        <Button asChild variant="outline" className="border-slate-800 bg-slate-900 text-slate-300 text-xs rounded-xl">
          <Link href={ROUTES.DASHBOARD.MENU}>
            <UtensilsCrossed className="h-4 w-4 mr-1.5" /> Manage Menu Catalog
          </Link>
        </Button>
      </div>
    </div>
  );
}
