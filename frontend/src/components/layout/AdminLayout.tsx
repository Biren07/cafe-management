'use client';

import { ReactNode, useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';

interface AdminLayoutProps {
  children: ReactNode;
}

const COLLAPSED_STORAGE_KEY = 'cafe_admin_sidebar_collapsed';

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(COLLAPSED_STORAGE_KEY);
      if (saved !== null) {
        setIsCollapsed(saved === 'true');
      }
    }
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem(COLLAPSED_STORAGE_KEY, String(next));
      }
      return next;
    });
  };

  const handleToggleMobileMenu = () => {
    setIsMobileOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex flex-1 flex-col transition-all duration-200 ease-in-out ${
          isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <Header
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
          onToggleMobileMenu={handleToggleMobileMenu}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>

        <Footer />
      </div>
    </div>
  );
}
