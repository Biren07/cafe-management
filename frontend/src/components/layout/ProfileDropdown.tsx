'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { User, Settings, LogOut, ChevronDown, Shield } from 'lucide-react';

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isOwner, isManager, logout } = useAuth();

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'OWNER':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'MANAGER':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center space-x-2.5 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 text-left hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-xs"
      >
        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white font-bold text-xs shadow-xs">
          {initials}
          <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>
        <div className="hidden md:block">
          <p className="text-xs font-semibold text-slate-900 leading-tight">{user?.name || 'User'}</p>
          <p className="text-[10px] text-slate-500 capitalize">{user?.role?.toLowerCase() || 'Staff'}</p>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="absolute right-0 mt-2 z-50 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-slate-900/5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Header info */}
            <div className="p-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${getRoleBadgeColor(
                    user?.role
                  )}`}
                >
                  {user?.role}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">{user?.email}</p>
            </div>

            {/* Links */}
            <div className="py-1 space-y-0.5">
              {isOwner && (
                <Link
                  href={ROUTES.DASHBOARD.SETTINGS}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  <span>Store Settings</span>
                </Link>
              )}

              {(isOwner || isManager) && (
                <Link
                  href={ROUTES.DASHBOARD.USERS}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <Shield className="h-4 w-4 text-slate-400" />
                  <span>Manage Staff Users</span>
                </Link>
              )}
            </div>

            {/* Logout */}
            <div className="border-t border-slate-100 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="flex w-full items-center space-x-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
