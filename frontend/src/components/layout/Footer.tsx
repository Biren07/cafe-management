import { SITE_CONFIG } from '@/constants/site-config';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/60 bg-slate-950/60 px-4 sm:px-6 py-4 text-xs text-slate-400">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-300">System Operational</span>
          <span className="text-slate-600">•</span>
          <span>{SITE_CONFIG.name} POS Engine</span>
        </div>

        <div className="flex items-center space-x-4 text-[11px] text-slate-500">
          <span>&copy; {new Date().getFullYear()} All Rights Reserved</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
