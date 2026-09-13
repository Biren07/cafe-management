'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Command, ArrowRight } from 'lucide-react';
import { NAV_GROUPS } from './nav-config';

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const allItems = NAV_GROUPS.flatMap((group) => group.items);

  const filteredItems = query.trim() === ''
    ? allItems
    : allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.href.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (href: string) => {
    router.push(href);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <>
      {/* Trigger Bar */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex h-9 w-full max-w-[200px] lg:max-w-[260px] items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-3 text-xs text-slate-500 hover:bg-slate-100 hover:border-slate-300 hover:text-slate-900 transition-all cursor-pointer shadow-xs"
      >
        <div className="flex items-center space-x-2">
          <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="truncate">Search modules...</span>
        </div>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 font-mono text-[10px] font-medium text-slate-500 shadow-2xs">
          <Command className="h-2.5 w-2.5" /> K
        </kbd>
      </button>

      {/* Modal Dialog Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div
            className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl ring-1 ring-slate-900/5 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input Header */}
            <div className="flex items-center border-b border-slate-100 px-4 py-3.5">
              <Search className="h-4 w-4 text-amber-600 shrink-0 mr-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search modules, pages, or tools..."
                autoFocus
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Navigation Results List */}
            <div className="max-h-[360px] overflow-y-auto p-2 space-y-0.5">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No matching module found for &quot;<span className="text-slate-700 font-semibold">{query}</span>&quot;
                </div>
              ) : (
                filteredItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() => handleSelect(item.href)}
                      className="group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-amber-800 transition-all cursor-pointer text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-amber-900">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-slate-400">{item.href}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer hints */}
            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2 text-[10px] text-slate-500 bg-slate-50/80">
              <span>Quick jump with Enter</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
