'use client';

import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';
import { SearchModal } from './SearchModal';
import { NotificationsDropdown } from './NotificationsDropdown';
import { ThemeToggle } from './ThemeToggle';
import { ProfileDropdown } from './ProfileDropdown';

interface HeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onToggleMobileMenu: () => void;
}

export function Header({
  isCollapsed,
  onToggleCollapse,
  onToggleMobileMenu,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 backdrop-blur-md transition-all shadow-xs">
      {/* Left controls */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Mobile menu drawer trigger */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 lg:hidden transition-colors cursor-pointer shadow-xs"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop sidebar collapse trigger */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer shadow-xs"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label="Toggle Sidebar Collapse"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>

        {/* Breadcrumb path */}
        <Breadcrumb />
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <SearchModal />
        <NotificationsDropdown />
        <ThemeToggle />
        <ProfileDropdown />
      </div>
    </header>
  );
}
