'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';

const DISMISSAL_KEY = 'artisan_cafe_pwa_install_dismissed_at';
const COOLDOWN_DAYS = 7;

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

function checkIsStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const nav = window.navigator as NavigatorWithStandalone;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    nav.standalone === true ||
    document.referrer.includes('android-app://')
  );
}

function checkIsIos(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent.toLowerCase();
  const isIosDevice = /iphone|ipad|ipod/.test(ua);
  const isSafari = /safari/.test(ua) && !/chrome|crios|fxios|edge|edg|opr/.test(ua);
  return isIosDevice && isSafari && !checkIsStandalone();
}

function checkIsDismissed(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const dismissedAt = localStorage.getItem(DISMISSAL_KEY);
    if (!dismissedAt) return false;
    const daysPassed = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
    return daysPassed < COOLDOWN_DAYS;
  } catch {
    return false;
  }
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // Sync standalone check with external media query store
  const isStandalone = useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia('(display-mode: standalone)');
      media.addEventListener('change', callback);
      return () => media.removeEventListener('change', callback);
    },
    checkIsStandalone,
    () => false
  );

  const isIos = useSyncExternalStore(
    () => () => {},
    checkIsIos,
    () => false
  );

  const isDismissed = useSyncExternalStore(
    (callback) => {
      window.addEventListener('storage', callback);
      window.addEventListener('pwa-dismissal-change', callback);
      return () => {
        window.removeEventListener('storage', callback);
        window.removeEventListener('pwa-dismissal-change', callback);
      };
    },
    checkIsDismissed,
    () => true
  );

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      try {
        localStorage.removeItem(DISMISSAL_KEY);
        window.dispatchEvent(new Event('pwa-dismissal-change'));
      } catch {
        // Storage disabled fallback
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }
    } catch (err) {
      console.warn('[PWA] Installation prompt error:', err);
    }
    return false;
  }, [deferredPrompt]);

  const dismissPrompt = useCallback(() => {
    try {
      localStorage.setItem(DISMISSAL_KEY, Date.now().toString());
      window.dispatchEvent(new Event('pwa-dismissal-change'));
    } catch {
      // Storage disabled fallback
    }
  }, []);

  return {
    isInstallable: isInstallable || isIos,
    isInstalled: isStandalone,
    isIos,
    isDismissed,
    canPromptNative: !!deferredPrompt,
    promptInstall,
    dismissPrompt,
  };
}
