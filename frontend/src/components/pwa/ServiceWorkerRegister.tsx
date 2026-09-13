'use client';

import { useEffect } from 'react';
import toast from 'react-hot-toast';

export function ServiceWorkerRegister() {
  useEffect(() => {
    // 1. SSR & Feature Support Check
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    let refreshing = false;

    // 2. Listen for controller change (triggers seamless reload after update)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });

    // 3. Register Service Worker on window load
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        // Handle update detection
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.addEventListener('statechange', () => {
            if (
              installingWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              // Non-intrusive update notification
              toast(
                (t) => (
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-medium text-slate-800">
                      New update available!
                    </span>
                    <button
                      onClick={() => {
                        toast.dismiss(t.id);
                        if (registration.waiting) {
                          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                        }
                      }}
                      className="rounded-lg bg-amber-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-amber-700 transition-colors cursor-pointer"
                    >
                      Update
                    </button>
                  </div>
                ),
                {
                  id: 'sw-update-toast',
                  duration: 8000,
                  position: 'bottom-right',
                }
              );
            }
          });
        });
      } catch (err) {
        console.warn('[PWA] Service Worker registration skipped or failed:', err);
      }
    };

    // 4. Online / Offline network status notifications
    const handleOnline = () => {
      toast.success('Internet connection restored.', {
        id: 'network-status',
        duration: 3000,
      });
    };

    const handleOffline = () => {
      toast.error('You are currently offline. Running in offline mode.', {
        id: 'network-status',
        duration: 4000,
      });
    };

    window.addEventListener('load', registerSW);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('load', registerSW);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return null;
}
