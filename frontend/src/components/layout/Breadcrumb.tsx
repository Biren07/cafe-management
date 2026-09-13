'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

const routeTitleMap: Record<string, string> = {
  dashboard: 'Overview',
  orders: 'Order Management',
  menu: 'Menu Catalog',
  categories: 'Food Categories',
  billing: 'Billing & POS',
  inventory: 'Stock Inventory',
  tables: 'Dining Tables',
  employees: 'Employee HR',
  expenses: 'Expenses',
  users: 'Staff Users',
  settings: 'Store Settings',
};

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return (
      <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
        <Home className="h-3.5 w-3.5 text-amber-400" />
        <span>Dashboard</span>
      </div>
    );
  }

  let cumulativePath = '';

  return (
    <nav aria-label="Breadcrumb" className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
      <Link
        href={ROUTES.DASHBOARD.OVERVIEW}
        className="flex items-center text-slate-400 hover:text-amber-400 transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>

      {segments.map((segment, index) => {
        cumulativePath += `/${segment}`;
        const isLast = index === segments.length - 1;
        const title = routeTitleMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

        return (
          <div key={cumulativePath} className="flex items-center space-x-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-slate-600 shrink-0" />
            {isLast ? (
              <span className="text-slate-200 font-semibold truncate max-w-[150px] sm:max-w-none">
                {title}
              </span>
            ) : (
              <Link
                href={cumulativePath}
                className="text-slate-400 hover:text-amber-400 transition-colors capitalize"
              >
                {title}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
