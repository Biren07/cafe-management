import Link from 'next/link';
import {
  Coffee,
  CircleUserRound,
  ArrowRight,
  ClipboardList,
  Package,
  BarChart3,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

/* ─────────────────────────────────────────────
   Feature card data
───────────────────────────────────────────── */
const features = [
  {
    icon: ClipboardList,
    title: 'Easy Ordering',
    description: 'Manage orders quickly and efficiently with an intuitive interface designed for speed.',
    accent: 'text-amber-400',
    glow: 'group-hover:shadow-amber-500/20',
    border: 'group-hover:border-amber-500/40',
    iconBg: 'bg-amber-500/10',
    iconBorder: 'border-amber-500/20',
  },
  {
    icon: Package,
    title: 'Smart Inventory',
    description: 'Keep track of ingredients and stock levels in real time to avoid shortages.',
    accent: 'text-orange-400',
    glow: 'group-hover:shadow-orange-500/20',
    border: 'group-hover:border-orange-500/40',
    iconBg: 'bg-orange-500/10',
    iconBorder: 'border-orange-500/20',
  },
  {
    icon: BarChart3,
    title: 'Powerful Management',
    description: 'Manage employees, sales, expenses, tables, and all cafe operations from one place.',
    accent: 'text-yellow-400',
    glow: 'group-hover:shadow-yellow-500/20',
    border: 'group-hover:border-yellow-500/40',
    iconBg: 'bg-yellow-500/10',
    iconBorder: 'border-yellow-500/20',
  },
] as const;

/* ─────────────────────────────────────────────
   HomePage – Server Component
───────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">

      {/* ── TOP NAVIGATION ───────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group select-none"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600 text-white font-bold shadow-xs transition-transform group-hover:scale-105">
              <Coffee size={19} strokeWidth={2.2} />
            </span>
            <span className="font-heading text-lg font-bold tracking-tight text-slate-900">
              Artisan Cafe
            </span>
          </Link>

          {/* Login icon / CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-slate-800 active:scale-95"
            >
              <CircleUserRound size={16} />
              <span>Staff Login</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* ── MAIN CONTENT ────────────────────────── */}
      <main className="flex flex-1 flex-col items-center">

        {/* ── HERO ─────────────────────────────────── */}
        <section className="relative w-full overflow-hidden border-b border-slate-200/60 bg-gradient-to-b from-white to-slate-50/50">
          <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 pb-20 pt-16 text-center sm:pt-24 sm:pb-24">
            {/* Badge */}
            <Badge className="mb-6 gap-1.5 px-3.5 py-1 text-xs font-semibold border-amber-200/80 bg-amber-50 text-amber-800 shadow-2xs">
              <Coffee size={13} className="text-amber-700" />
              Enterprise Cafe Management System
            </Badge>

            {/* Heading */}
            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
              Fresh Coffee.{' '}
              <span className="text-amber-600">
                Effortless Operations.
              </span>
            </h1>

            {/* Sub-text */}
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Manage dining tables, quick POS billing, live kitchen orders, inventory levels, and financial summaries — all in one modern, unified platform.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-7 py-3 text-sm font-semibold text-white shadow-xs transition-all hover:bg-amber-700 hover:shadow-sm hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Launch Dashboard
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-3 text-sm font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900 active:scale-[0.98]"
              >
                Sign In to Portal
              </Link>
            </div>
          </div>
        </section>

        {/* ── FEATURE HIGHLIGHTS ───────────────────── */}
        <section className="w-full py-20">
          <div className="mx-auto max-w-5xl px-5">
            <p className="mb-10 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
              Core Cafe Capabilities
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200/70">
                    <Icon size={22} strokeWidth={2.2} />
                  </div>
                  <h3 className="mb-2 font-heading text-base font-bold text-slate-900">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ───────────────────────────────── */}
      <footer className="border-t border-slate-200/80 bg-white py-6">
        <p className="text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Artisan Cafe Management Suite. Built for modern cafe operations.
        </p>
      </footer>

    </div>
  );
}
