'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  OfflineQueueItem,
  getPendingActionsForUser,
  updateActionStatus,
  removeAction,
  pruneOldQueueItems,
  enqueueAction,
  QueueActionType,
} from '@/utils/offline-queue-db';
import toast from 'react-hot-toast';

interface SyncManager {
  register(tag: string): Promise<void>;
}

interface ServiceWorkerRegistrationWithSync extends ServiceWorkerRegistration {
  sync?: SyncManager;
}

export function useOfflineQueue() {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const userId = user?._id || '';

  const [pendingItems, setPendingItems] = useState<OfflineQueueItem[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Refresh pending items list
  const refreshQueue = useCallback(async () => {
    if (!userId) {
      setPendingItems([]);
      return;
    }
    try {
      const items = await getPendingActionsForUser(userId);
      setPendingItems(items);
    } catch (err) {
      console.warn('[Offline Queue] Error loading queue items:', err);
    }
  }, [userId]);

  // Execute sync for all pending actions for current user
  const syncQueue = useCallback(async () => {
    if (!userId || !token || isSyncing || !navigator.onLine) {
      return;
    }

    const items = await getPendingActionsForUser(userId);
    if (items.length === 0) return;

    setIsSyncing(true);
    const syncToastId = toast.loading(`Syncing ${items.length} offline operation(s)...`, {
      id: 'offline-sync-status',
    });

    let successCount = 0;
    let failCount = 0;

    for (const item of items) {
      // If retry limit exceeded, mark FAILED
      if (item.retryCount >= item.maxRetries) {
        await updateActionStatus(item.id, 'FAILED', 'Maximum retry attempts exceeded.');
        failCount += 1;
        continue;
      }

      await updateActionStatus(item.id, 'SYNCING');

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const targetUrl = item.endpoint.startsWith('http')
          ? item.endpoint
          : `${apiUrl}${item.endpoint.startsWith('/') ? item.endpoint : `/${item.endpoint}`}`;

        const response = await fetch(targetUrl, {
          method: item.method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'Idempotency-Key': item.idempotencyKey,
            'X-Offline-Queued-At': item.createdAt.toString(),
          },
          body: JSON.stringify(item.payload),
        });

        if (response.ok || response.status === 200 || response.status === 201) {
          await removeAction(item.id);
          successCount += 1;
        } else if (response.status >= 400 && response.status < 500 && response.status !== 408 && response.status !== 429) {
          // Client-side validation or business logic error (do not retry indefinitely)
          const errorData = await response.json().catch(() => ({}));
          const errMsg = errorData.message || `Request rejected with status ${response.status}`;
          await updateActionStatus(item.id, 'FAILED', errMsg);
          failCount += 1;
        } else {
          // Server error / network blip -> keep in queue for next backoff
          await updateActionStatus(item.id, 'PENDING', `Server error (${response.status})`);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Network error during sync';
        await updateActionStatus(item.id, 'PENDING', msg);
      }
    }

    setIsSyncing(false);
    toast.dismiss(syncToastId);

    if (successCount > 0) {
      toast.success(`Successfully synced ${successCount} offline action(s)!`, {
        id: 'offline-sync-success',
      });
    }
    if (failCount > 0) {
      toast.error(`${failCount} action(s) could not be synced. Please check failed queue.`, {
        id: 'offline-sync-error',
      });
    }

    await refreshQueue();
    await pruneOldQueueItems();
  }, [userId, token, isSyncing, refreshQueue]);

  // Queue a new safe offline action
  const queueAction = useCallback(
    async (
      type: QueueActionType,
      endpoint: string,
      method: 'POST' | 'PUT' | 'PATCH',
      payload: Record<string, unknown>
    ): Promise<OfflineQueueItem | null> => {
      if (!userId) {
        toast.error('You must be logged in to queue offline actions.');
        return null;
      }

      const idempotencyKey =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `idemp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

      const queued = await enqueueAction({
        idempotencyKey,
        userId,
        type,
        endpoint,
        method,
        payload,
      });

      toast.success('Action saved locally. Will sync automatically when online.', {
        id: `queued-${queued.id}`,
      });

      await refreshQueue();

      // Register Background Sync if supported
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        try {
          const reg = (await navigator.serviceWorker.ready) as ServiceWorkerRegistrationWithSync;
          if (reg.sync) {
            await reg.sync.register('artisan-sync-queue');
          }
        } catch {
          // sync registration fallback
        }
      }

      return queued;
    },
    [userId, refreshQueue]
  );

  // Sync automatically when online or on user login
  useEffect(() => {
    let isMounted = true;

    const initialLoad = async () => {
      if (!userId) {
        if (isMounted) setPendingItems([]);
        return;
      }
      try {
        const items = await getPendingActionsForUser(userId);
        if (isMounted) setPendingItems(items);
      } catch (err) {
        console.warn('[Offline Queue] Error loading queue items:', err);
      }
    };

    initialLoad();

    const handleOnline = () => {
      syncQueue();
    };

    window.addEventListener('online', handleOnline);
    return () => {
      isMounted = false;
      window.removeEventListener('online', handleOnline);
    };
  }, [userId, syncQueue]);

  return {
    pendingCount: pendingItems.length,
    pendingItems,
    isSyncing,
    queueAction,
    syncQueue,
    refreshQueue,
  };
}
