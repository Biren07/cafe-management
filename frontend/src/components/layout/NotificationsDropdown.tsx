'use client';

import { useState } from 'react';
import { Bell, AlertTriangle, ShoppingBag, Info, Check, Trash2 } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'warning' | 'info' | 'success';
  read: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Low Stock Alert',
    message: 'Espresso Beans stock is below minimum threshold (2 kg left).',
    time: '10m ago',
    type: 'warning',
    read: false,
  },
  {
    id: '2',
    title: 'New Order Received',
    message: 'Order #ORD-20260807-0042 placed at Table #4.',
    time: '25m ago',
    type: 'info',
    read: false,
  },
  {
    id: '3',
    title: 'Daily Summary Ready',
    message: "Yesterday's sales total was successfully calculated.",
    time: '2h ago',
    type: 'success',
    read: true,
  },
];

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus:outline-none transition-all cursor-pointer shadow-xs"
        aria-label="View Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close popover */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Popover Card */}
          <div className="absolute right-0 mt-2 z-50 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl ring-1 ring-slate-900/5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50/80">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-amber-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-200/80">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2 text-xs">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer text-[11px]"
                    title="Mark all as read"
                  >
                    <Check className="h-3 w-3" /> Mark read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                    title="Clear all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No notifications at the moment.
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-start space-x-3 p-3.5 transition-colors ${
                      item.read ? 'bg-white opacity-80' : 'bg-slate-50/50'
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                        item.type === 'warning'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200/80'
                          : item.type === 'info'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200/80'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                      }`}
                    >
                      {item.type === 'warning' ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : item.type === 'info' ? (
                        <ShoppingBag className="h-4 w-4" />
                      ) : (
                        <Info className="h-4 w-4" />
                      )}
                    </div>

                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                        <span className="text-[10px] text-slate-400">{item.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-snug">{item.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
