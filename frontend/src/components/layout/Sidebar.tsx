'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, X, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { SITE_CONFIG } from '@/constants/site-config';
import { NAV_GROUPS, NavItem } from './nav-config';

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ isCollapsed, isMobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { user, isStaff, hasRole, hasPermissionCheck, logout } = useAuth();

  // Filter items according to permissions & roles
  const filteredGroups = NAV_GROUPS.map((group) => {
    const validItems = group.items.filter((item) => {
      if (item.roles && !hasRole(item.roles)) return false;
      if (item.permission && !hasPermissionCheck(item.permission)) return false;
      return true;
    });
    return { ...group, items: validItems };
  }).filter((group) => group.items.length > 0);

  const sidebarContent = (
    <div className="flex h-full w-full flex-col justify-between p-3 sm:p-4 text-slate-900">
      {/* Top Brand Header */}
      <div className="flex items-center justify-between pb-5 pt-1 border-b border-slate-200/80">
        <Link
          href={isStaff ? '/orders' : '/dashboard'}
          className="flex items-center space-x-3 overflow-hidden group"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white font-bold shadow-xs transition-transform group-hover:scale-105">
            <Coffee className="h-5 w-5 stroke-[2.2]" />
          </div>

          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col whitespace-nowrap overflow-hidden"
              >
                <span className="font-heading text-base font-bold tracking-tight text-slate-900">
                  {SITE_CONFIG.name}
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">
                  POS &amp; Operations
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav List Container */}
      <div className="flex-1 overflow-y-auto py-4 space-y-5 scrollbar-thin">
        {filteredGroups.map((group) => (
          <div key={group.groupLabel} className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {group.groupLabel}
              </p>
            )}

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`group relative flex items-center rounded-xl px-3 py-2 text-xs font-medium transition-all cursor-pointer ${
                      isCollapsed ? 'justify-center' : 'justify-between'
                    } ${
                      isActive
                        ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200/80 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                    }`}
                    title={isCollapsed ? item.title : undefined}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive ? 'text-amber-700' : 'text-slate-400 group-hover:text-slate-700'
                        }`}
                      />

                      {!isCollapsed && (
                        <span className="truncate transition-colors">{item.title}</span>
                      )}
                    </div>

                    {!isCollapsed && isActive && (
                      <ChevronRight className="h-3.5 w-3.5 text-amber-700" />
                    )}

                    {/* Tooltip on Collapsed Hover */}
                    {isCollapsed && (
                      <div className="pointer-events-none absolute left-full ml-3 z-50 hidden rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-xl whitespace-nowrap group-hover:block">
                        {item.title}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Footer Card */}
      <div className="pt-3 border-t border-slate-200/80">
        <div
          className={`flex items-center rounded-xl bg-slate-50 p-2.5 border border-slate-200/80 ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200/80">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col whitespace-nowrap overflow-hidden">
                <span className="text-xs font-semibold text-slate-900 truncate">{user?.name}</span>
                <span className="text-[10px] text-slate-500 font-medium capitalize">{user?.role?.toLowerCase()}</span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              type="button"
              onClick={logout}
              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Animated Sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? 80 : 260 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200/80 shadow-xs"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 shadow-2xl lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
