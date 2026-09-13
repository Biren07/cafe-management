'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Download, X, Coffee, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function InstallPWA() {
  const { isInstallable, isInstalled, isIos, isDismissed, canPromptNative, promptInstall, dismissPrompt } =
    usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    dismissPrompt();
  }, [dismissPrompt]);

  const handleInstallClick = useCallback(async () => {
    const installed = await promptInstall();
    if (installed) {
      setIsVisible(false);
    }
  }, [promptInstall]);

  useEffect(() => {
    if (!isInstallable || isInstalled || isDismissed) {
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isInstallable, isInstalled, isDismissed]);

  // Keyboard accessibility: Escape to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, handleDismiss]);

  if (!isVisible || isInstalled || isDismissed || !isInstallable) {
    return null;
  }

  return (
    <aside
      role="region"
      aria-label="Install Application Banner"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-sm w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
              <Coffee className="h-5 w-5 stroke-[2.2]" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold text-slate-900 leading-tight">
                Install Artisan Cafe
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Fast POS billing &amp; offline reliability
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Close install prompt"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {isIos ? (
          <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-600 space-y-1">
            <p className="font-medium text-slate-800 flex items-center gap-1.5">
              <Share className="h-3.5 w-3.5 text-amber-700 shrink-0" aria-hidden="true" />
              <span>Install on your iOS device:</span>
            </p>
            <ol className="text-[11px] text-slate-500 pl-4 space-y-0.5 list-decimal">
              <li>Tap the <strong className="text-slate-800">Share</strong> icon in Safari.</li>
              <li>Select <strong className="text-slate-800">&quot;Add to Home Screen&quot;</strong>.</li>
              <li>Tap <strong className="text-slate-800">&quot;Add&quot;</strong> in the top right.</li>
            </ol>
          </div>
        ) : (
          <div className="mt-3.5 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDismiss}
              className="h-8 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Maybe Later
            </Button>
            {canPromptNative && (
              <Button
                type="button"
                size="sm"
                onClick={handleInstallClick}
                className="h-8 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Install App</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
