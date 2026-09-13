import { ReactNode } from 'react';
import { Coffee, ShieldCheck, Zap, Layers } from 'lucide-react';
import { SITE_CONFIG } from '@/constants/site-config';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen w-full flex-col lg:flex-row bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Left Brand Panel (Desktop) */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 lg:p-16 bg-white border-r border-slate-200/80 shadow-xs">
        {/* Brand Header */}
        <div className="flex items-center space-x-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-600 text-white font-bold shadow-xs">
            <Coffee className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold tracking-tight text-slate-900">
              {SITE_CONFIG.name}
            </h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
              Management Suite &amp; POS
            </p>
          </div>
        </div>

        {/* Highlight Feature Showcase */}
        <div className="my-auto space-y-7 max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-800 shadow-2xs">
            <Zap className="h-3.5 w-3.5 text-amber-600" />
            <span>Complete Cafe Command Centre</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-slate-900">
            Run your cafe smarter, faster, every day.
          </h2>

          <p className="text-base text-slate-600 leading-relaxed">
            From the morning rush to closing time — manage dining tables, rapid POS billing, kitchen orders, inventory items, and real-time sales reports.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-start space-x-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 shadow-2xs">
              <ShieldCheck className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Role-Based Access</h4>
                <p className="text-xs text-slate-500 mt-0.5">Secure portals for Owner, Manager, and Cashier</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 shadow-2xs">
              <Layers className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Live POS &amp; Inventory</h4>
                <p className="text-xs text-slate-500 mt-0.5">Instant stock alerts, receipt prints, and fast billing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-6">
          <span>&copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</span>
          <span className="font-mono text-slate-400">v1.0.0</span>
        </div>
      </div>

      {/* Right Content Panel (Form container) */}
      <div className="relative flex flex-1 items-center justify-center p-4 sm:p-8 lg:p-12 z-10">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
