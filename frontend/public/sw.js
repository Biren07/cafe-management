/**
 * Artisan Cafe Management - Production Service Worker
 * Version: 1.0.0
 * Next.js 16 App Router Production PWA
 */

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAMES = {
  STATIC: `artisan-static-${CACHE_VERSION}`,
  IMAGES: `artisan-images-${CACHE_VERSION}`,
  FONTS: `artisan-fonts-${CACHE_VERSION}`,
  PAGES: `artisan-pages-${CACHE_VERSION}`,
};

const MAX_CACHE_ENTRIES = {
  IMAGES: 60,
  PAGES: 25,
};

// Core app shell precache list
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable-192x192.png',
  '/icons/icon-maskable-512x512.png',
  '/icons/apple-touch-icon.png',
  '/icons/favicon-32x32.png',
  '/icons/favicon-16x16.png',
  '/screenshots/desktop.png',
  '/screenshots/mobile.png',
  '/favicon.ico',
];

// Helper: Trim cache to limit storage growth
async function trimCache(cacheName, maxItems) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > maxItems) {
      await cache.delete(keys[0]);
      await trimCache(cacheName, maxItems);
    }
  } catch (error) {
    console.warn('[PWA SW] Cache trim error:', error);
  }
}

// 1. INSTALL LIFECYCLE
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAMES.STATIC)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.warn('[PWA SW] Pre-cache installation warning:', err);
      })
  );
});

// 2. ACTIVATE LIFECYCLE (Purge obsolete cache versions)
self.addEventListener('activate', (event) => {
  const currentCaches = Object.values(CACHE_NAMES);
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!currentCaches.includes(cacheName)) {
              console.log('[PWA SW] Purging obsolete cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// 3. MESSAGE LISTENER (For immediate manual updates)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 4. FETCH INTERCEPTION & INTELLIGENT CACHING
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // A. Only process HTTP/HTTPS GET requests
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // B. STRICT SECURITY POLICY: ZERO CACHING FOR ALL SENSITIVE & API ENDPOINTS
  // Network-Only for:
  // - Backend API requests (/api/*, /api/v1/*, port 5000)
  // - Authentication endpoints (/auth/*, login, logout, refresh-token, profile)
  // - Financial & Payment endpoints (/payments/*, /billing/*, /expenses/*)
  // - Business data endpoints (/orders/*, /tables/*, /inventory/*, /employees/*, /users/*, /dashboard/*)
  const isApiRequest =
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('/api/v1') ||
    url.pathname.startsWith('/auth/') ||
    url.pathname.includes('/auth') ||
    url.port === '5000' ||
    url.hostname.includes('localhost:5000');

  if (isApiRequest) {
    // Direct network passthrough without touching CacheStorage
    return;
  }

  // C. Next.js Static Assets & Chunks (/_next/static/*) -> Cache-First
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.open(CACHE_NAMES.STATIC).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) {
          return cached;
        }
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          return cached;
        }
      })
    );
    return;
  }

  // D. Fonts (Google Fonts, CDN, local woff2/woff) -> Cache-First
  const isFont =
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.ttf');

  if (isFont) {
    event.respondWith(
      caches.open(CACHE_NAMES.FONTS).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) {
          return cached;
        }
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          return cached;
        }
      })
    );
    return;
  }

  // E. Images & PWA Icons (Cloudinary, /icons/*, png, jpg, svg, webp) -> Stale-While-Revalidate
  const isImage =
    url.pathname.startsWith('/icons/') ||
    url.hostname.includes('cloudinary.com') ||
    /\.(png|jpg|jpeg|svg|webp|ico|gif)$/i.test(url.pathname);

  if (isImage) {
    event.respondWith(
      caches.open(CACHE_NAMES.IMAGES).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
              trimCache(CACHE_NAMES.IMAGES, MAX_CACHE_ENTRIES.IMAGES);
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // F. HTML Page Document Navigations -> Network-First with /offline Fallback
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAMES.PAGES).then((cache) => {
              cache.put(request, responseClone);
              trimCache(CACHE_NAMES.PAGES, MAX_CACHE_ENTRIES.PAGES);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // If offline or network fails, attempt cache match or deliver precached /offline
          const cachedPage = await caches.match(request);
          if (cachedPage) {
            return cachedPage;
          }
          const offlineFallback = await caches.match('/offline');
          return offlineFallback || new Response('Offline - No Network Connection', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' },
          });
        })
    );
    return;
  }
});

// 5. WEB PUSH NOTIFICATIONS EVENT LISTENER
self.addEventListener('push', (event) => {
  let data = {
    title: 'Artisan Cafe Management',
    body: 'You have a new update in your cafe portal.',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/favicon-32x32.png',
    url: '/dashboard',
    tag: 'artisan-cafe-notification',
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      data = {
        title: payload.title || data.title,
        body: payload.body || payload.message || data.body,
        icon: payload.icon || data.icon,
        badge: payload.badge || data.badge,
        url: payload.url || payload.data?.url || data.url,
        tag: payload.tag || payload.category || data.tag,
        image: payload.image || undefined,
      };
    } catch {
      data.body = event.data.text() || data.body;
    }
  }

  const notificationOptions = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    tag: data.tag,
    image: data.image,
    data: {
      url: data.url,
    },
    vibrate: [100, 50, 100],
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(data.title, notificationOptions));
});

// 6. NOTIFICATION CLICK LISTENER
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // If an application window is already open, focus it and navigate
        for (const client of clientList) {
          const clientUrl = new URL(client.url);
          if (clientUrl.origin === self.location.origin && 'focus' in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
        // Otherwise open a new window
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});

// 7. BACKGROUND SYNC EVENT LISTENER
self.addEventListener('sync', (event) => {
  if (event.tag === 'artisan-sync-queue') {
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          client.postMessage({ type: 'TRIGGER_OFFLINE_SYNC' });
        }
      })
    );
  }
});


