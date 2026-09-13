'use client';

import { useState } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import {
  Bell,
  BellRing,
  BellOff,
  ShieldCheck,
  Send,
  AlertTriangle,
  ShoppingBag,
  CreditCard,
  Boxes,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export function PushNotificationSettings() {
  const {
    permission,
    isSupported,
    isSubscribed,
    isLoading,
    isSendingTest,
    subscribe,
    unsubscribe,
    sendTest,
  } = usePushNotifications();

  // Category notification preferences (local & persistent state)
  const [categories, setCategories] = useState({
    orders: true,
    payments: true,
    lowStock: true,
    reports: true,
  });

  const handleCategoryToggle = (key: keyof typeof categories) => {
    setCategories((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      toast.success('Notification preferences updated.');
      return updated;
    });
  };

  if (!isSupported) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-3 text-slate-500">
          <BellOff className="h-6 w-6 text-slate-400" />
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900">
              Web Push Unsupported
            </h3>
            <p className="text-xs text-slate-500">
              Your current browser does not support the Web Push Notification API. Please try Google Chrome, Microsoft Edge, or Safari on iOS 16.4+.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Main Subscription Card ─────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-start space-x-3.5">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                isSubscribed
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                  : 'bg-amber-50 text-amber-700 border border-amber-200/80'
              }`}
            >
              {isSubscribed ? (
                <BellRing className="h-5 w-5 stroke-[2.2]" />
              ) : (
                <Bell className="h-5 w-5 stroke-[2.2]" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-base font-bold text-slate-900">
                  Web Push Notifications
                </h3>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    isSubscribed
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : permission === 'denied'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isSubscribed
                        ? 'bg-emerald-500'
                        : permission === 'denied'
                        ? 'bg-rose-500'
                        : 'bg-slate-400'
                    }`}
                  />
                  <span>
                    {isSubscribed
                      ? 'Active & Receiving'
                      : permission === 'denied'
                      ? 'Permission Blocked'
                      : 'Disabled'}
                  </span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Receive real-time alerts for live kitchen orders, customer digital payments, and low stock warnings even when the tab is in background.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {isSubscribed ? (
              <Button
                type="button"
                variant="outline"
                onClick={unsubscribe}
                disabled={isLoading}
                className="h-9 rounded-xl text-xs font-semibold text-rose-700 border-rose-200 hover:bg-rose-50 cursor-pointer"
              >
                Disable Notifications
              </Button>
            ) : (
              <Button
                type="button"
                onClick={subscribe}
                disabled={isLoading || permission === 'denied'}
                className="h-9 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                {isLoading ? 'Requesting...' : 'Enable Notifications'}
              </Button>
            )}

            {isSubscribed && (
              <Button
                type="button"
                onClick={sendTest}
                disabled={isSendingTest}
                className="h-9 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSendingTest ? 'Sending...' : 'Test Alert'}</span>
              </Button>
            )}
          </div>
        </div>

        {/* ── Blocked Permission Warning ────────────── */}
        {permission === 'denied' && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 flex items-start gap-3 text-xs text-rose-800">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <div>
              <p className="font-semibold">Notification permission is blocked by your browser</p>
              <p className="text-rose-700 mt-0.5">
                To enable alerts, click the lock / settings icon in your browser address bar and set <strong>Notifications</strong> to <strong>Allow</strong>.
              </p>
            </div>
          </div>
        )}

        {/* ── Notification Category Subscriptions ───── */}
        <div className="space-y-3 pt-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Notification Categories
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* 1. Live Orders */}
            <label className="flex items-start space-x-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={categories.orders}
                onChange={() => handleCategoryToggle('orders')}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ShoppingBag className="h-3.5 w-3.5 text-blue-600" />
                  Live Table &amp; Kitchen Orders
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Instant sound alert when a customer or staff submits a new dining order
                </p>
              </div>
            </label>

            {/* 2. Payment Confirmations */}
            <label className="flex items-start space-x-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={categories.payments}
                onChange={() => handleCategoryToggle('payments')}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
                  Payment Confirmations
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Alerts on eSewa, Fonepay, and cash counter bill settlements
                </p>
              </div>
            </label>

            {/* 3. Low Stock Alerts */}
            <label className="flex items-start space-x-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={categories.lowStock}
                onChange={() => handleCategoryToggle('lowStock')}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Boxes className="h-3.5 w-3.5 text-orange-600" />
                  Inventory Low Stock Alerts
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Warnings when critical coffee beans, milk, or ingredients reach reorder threshold
                </p>
              </div>
            </label>

            {/* 4. Daily Reports */}
            <label className="flex items-start space-x-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={categories.reports}
                onChange={() => handleCategoryToggle('reports')}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <BarChart3 className="h-3.5 w-3.5 text-indigo-600" />
                  Daily Revenue &amp; Closing Summaries
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  End-of-day sales totals and staff closing summaries for management
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* ── Security & Privacy Assurance ──────────── */}
        <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 flex items-center gap-3 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>
            Push subscriptions use end-to-end VAPID encryption with strict zero-logging of private credentials.
          </span>
        </div>
      </div>
    </div>
  );
}
