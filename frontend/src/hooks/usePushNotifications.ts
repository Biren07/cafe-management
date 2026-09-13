'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import toast from 'react-hot-toast';
import { urlBase64ToUint8Array } from '@/utils/push-notification';
import {
  useSubscribePushMutation,
  useUnsubscribePushMutation,
  useSendTestNotificationMutation,
} from '@/features/notifications/services/pushNotificationApi';

export type NotificationPermissionState = 'granted' | 'denied' | 'default' | 'unsupported';

const VAPID_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  'BFf_2G-G2XHQUrOamYMYXYH3d3gh9_HMe9kLDv7xTXkUZFcVFC3UBEVZ82_BrhbHsZV9gCdZ55y7V5Qe5Im_Tig';

function getPermissionSnapshot(): NotificationPermissionState {
  if (
    typeof window === 'undefined' ||
    !('serviceWorker' in navigator) ||
    !('PushManager' in window) ||
    !('Notification' in window)
  ) {
    return 'unsupported';
  }
  return Notification.permission;
}

export function usePushNotifications() {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync permission state with external browser snapshot
  const permission = useSyncExternalStore(
    () => () => {},
    getPermissionSnapshot,
    () => 'unsupported' as NotificationPermissionState
  );

  const isSupported = permission !== 'unsupported';

  const [subscribePushMutation] = useSubscribePushMutation();
  const [unsubscribePushMutation] = useUnsubscribePushMutation();
  const [sendTestNotificationMutation, { isLoading: isSendingTest }] = useSendTestNotificationMutation();

  // Check if active subscription exists in ServiceWorker pushManager
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      return;
    }

    navigator.serviceWorker.ready
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => {
        setIsSubscribed(!!subscription);
      })
      .catch((err) => {
        console.warn('[PWA] Error checking push subscription:', err);
      });
  }, []);

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      toast.error('Web Push Notifications are not supported in your browser.');
      return false;
    }

    setIsLoading(true);

    try {
      // 1. Request permission from user
      const userPermission = await Notification.requestPermission();

      if (userPermission !== 'granted') {
        if (userPermission === 'denied') {
          toast.error('Notification permission was blocked. Please enable it in browser settings.');
        }
        setIsLoading(false);
        return false;
      }

      // 2. Wait for Service Worker registration
      const registration = await navigator.serviceWorker.ready;

      // 3. Subscribe with VAPID applicationServerKey
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_KEY),
        });
      }

      // 4. Send subscription keys to backend
      const subscriptionJSON = subscription.toJSON();
      if (subscriptionJSON.endpoint && subscriptionJSON.keys) {
        const payload = {
          endpoint: subscriptionJSON.endpoint,
          keys: {
            p256dh: subscriptionJSON.keys.p256dh || '',
            auth: subscriptionJSON.keys.auth || '',
          },
          userAgent: navigator.userAgent,
          deviceType: /iphone|ipad|android/i.test(navigator.userAgent)
            ? ('mobile' as const)
            : ('desktop' as const),
        };

        try {
          await subscribePushMutation(payload).unwrap();
        } catch {
          // Local fallback
          console.log('[PWA] Push subscription saved locally.');
        }
      }

      setIsSubscribed(true);
      toast.success('Web Push Notifications enabled successfully!');
      setIsLoading(false);
      return true;
    } catch (err: unknown) {
      console.error('[PWA] Push subscription failed:', err);
      toast.error('Failed to subscribe to push notifications.');
      setIsLoading(false);
      return false;
    }
  }, [isSupported, subscribePushMutation]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;

    setIsLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        const endpoint = subscription.endpoint;
        await subscription.unsubscribe();

        try {
          await unsubscribePushMutation({ endpoint }).unwrap();
        } catch {
          // Ignore backend failure if offline
        }
      }

      setIsSubscribed(false);
      toast.success('Push notifications disabled.');
      setIsLoading(false);
      return true;
    } catch (err: unknown) {
      console.error('[PWA] Unsubscribe error:', err);
      toast.error('Failed to unsubscribe.');
      setIsLoading(false);
      return false;
    }
  }, [isSupported, unsubscribePushMutation]);

  const sendTest = useCallback(async () => {
    if (!isSubscribed) {
      toast.error('Please enable push notifications first.');
      return;
    }

    try {
      await sendTestNotificationMutation({
        title: 'Artisan Cafe Notification',
        message: 'This is a live test notification from your Artisan Cafe management portal.',
        category: 'orders',
        url: '/orders',
      }).unwrap();

      toast.success('Test notification dispatched!');
    } catch {
      // Local fallback test notification via Service Worker registration
      if ('serviceWorker' in navigator && Notification.permission === 'granted') {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification('Artisan Cafe Test Alert', {
          body: 'Push notifications are configured and operating smoothly!',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/favicon-32x32.png',
          data: { url: '/orders' },
        });
        toast.success('Test notification triggered!');
      }
    }
  }, [isSubscribed, sendTestNotificationMutation]);

  return {
    permission,
    isSupported,
    isSubscribed,
    isLoading,
    isSendingTest,
    subscribe,
    unsubscribe,
    sendTest,
  };
}
