/**
 * Native IndexedDB wrapper for Artisan Cafe Offline Queue
 * Zero external dependencies, typed, with multi-user isolation & automatic cleanup
 */

export const DB_NAME = 'ArtisanCafeOfflineDB';
export const DB_VERSION = 1;
export const QUEUE_STORE = 'offline_queue';

export type QueueActionType =
  | 'CREATE_ORDER'
  | 'LOG_EXPENSE'
  | 'STOCK_ADJUSTMENT'
  | 'EMPLOYEE_ATTENDANCE';

export type QueueStatus = 'PENDING' | 'SYNCING' | 'COMPLETED' | 'FAILED';

export interface OfflineQueueItem {
  id: string;
  idempotencyKey: string;
  userId: string;
  type: QueueActionType;
  endpoint: string;
  method: 'POST' | 'PUT' | 'PATCH';
  payload: Record<string, unknown>;
  createdAt: number;
  lastAttemptAt?: number;
  retryCount: number;
  maxRetries: number;
  status: QueueStatus;
  errorMessage?: string;
}

let dbInstance: IDBDatabase | null = null;

export async function openOfflineDB(): Promise<IDBDatabase> {
  if (typeof window === 'undefined') {
    throw new Error('IndexedDB is only accessible in browser runtime');
  }

  if (dbInstance) {
    return dbInstance;
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(QUEUE_STORE)) {
        const store = db.createObjectStore(QUEUE_STORE, { keyPath: 'id' });
        store.createIndex('userId', 'userId', { unique: false });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('idempotencyKey', 'idempotencyKey', { unique: true });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

/**
 * Enqueue a new offline action
 */
export async function enqueueAction(item: Omit<OfflineQueueItem, 'id' | 'createdAt' | 'retryCount' | 'maxRetries' | 'status'>): Promise<OfflineQueueItem> {
  const db = await openOfflineDB();
  const queueItem: OfflineQueueItem = {
    ...item,
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `queue_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: Date.now(),
    retryCount: 0,
    maxRetries: 3,
    status: 'PENDING',
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([QUEUE_STORE], 'readwrite');
    const store = transaction.objectStore(QUEUE_STORE);
    const request = store.add(queueItem);

    request.onsuccess = () => resolve(queueItem);
    request.onerror = (e) => reject((e.target as IDBRequest).error);
  });
}

/**
 * Get all pending actions for the specified authenticated user (Multi-User Isolation)
 */
export async function getPendingActionsForUser(userId: string): Promise<OfflineQueueItem[]> {
  const db = await openOfflineDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([QUEUE_STORE], 'readonly');
    const store = transaction.objectStore(QUEUE_STORE);
    const index = store.index('userId');
    const request = index.getAll(IDBKeyRange.only(userId));

    request.onsuccess = () => {
      const items: OfflineQueueItem[] = request.result || [];
      // Return pending or syncing items sorted by creation time
      const pending = items
        .filter((item) => item.status === 'PENDING' || item.status === 'SYNCING')
        .sort((a, b) => a.createdAt - b.createdAt);
      resolve(pending);
    };

    request.onerror = (e) => reject((e.target as IDBRequest).error);
  });
}

/**
 * Update an existing action's state (e.g. SYNCING, COMPLETED, FAILED)
 */
export async function updateActionStatus(
  id: string,
  status: QueueStatus,
  errorMessage?: string
): Promise<void> {
  const db = await openOfflineDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([QUEUE_STORE], 'readwrite');
    const store = transaction.objectStore(QUEUE_STORE);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const item: OfflineQueueItem | undefined = getRequest.result;
      if (!item) {
        resolve();
        return;
      }

      item.status = status;
      item.lastAttemptAt = Date.now();
      if (status === 'FAILED' || status === 'SYNCING') {
        item.retryCount += 1;
      }
      if (errorMessage) {
        item.errorMessage = errorMessage;
      }

      const putRequest = store.put(item);
      putRequest.onsuccess = () => resolve();
      putRequest.onerror = (e) => reject((e.target as IDBRequest).error);
    };

    getRequest.onerror = (e) => reject((e.target as IDBRequest).error);
  });
}

/**
 * Remove completed action or manually discarded action
 */
export async function removeAction(id: string): Promise<void> {
  const db = await openOfflineDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([QUEUE_STORE], 'readwrite');
    const store = transaction.objectStore(QUEUE_STORE);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = (e) => reject((e.target as IDBRequest).error);
  });
}

/**
 * Clean up old completed or expired failed items (>7 days) to prevent storage leaks
 */
export async function pruneOldQueueItems(): Promise<void> {
  try {
    const db = await openOfflineDB();
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const transaction = db.transaction([QUEUE_STORE], 'readwrite');
    const store = transaction.objectStore(QUEUE_STORE);
    const request = store.openCursor();

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        const item: OfflineQueueItem = cursor.value;
        if (
          (item.status === 'COMPLETED' && item.lastAttemptAt && item.lastAttemptAt < Date.now() - 24 * 60 * 60 * 1000) ||
          (item.status === 'FAILED' && item.createdAt < sevenDaysAgo)
        ) {
          cursor.delete();
        }
        cursor.continue();
      }
    };
  } catch (err) {
    console.warn('[Offline DB] Error pruning old items:', err);
  }
}
