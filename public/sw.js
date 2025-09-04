/**
 * Service Worker for P.IVA Balance PWA
 * 
 * Features:
 * - Cache management for offline functionality
 * - Background sync for data updates
 * - Push notifications support
 * - Network-first strategy for API calls
 * - Cache-first strategy for static assets
 */

const CACHE_NAME = 'p-iva-balance-v1.0.0';
const API_CACHE_NAME = 'p-iva-balance-api-v1.0.0';
const IMAGES_CACHE_NAME = 'p-iva-balance-images-v1.0.0';

// Static assets to cache
const STATIC_CACHE_URLS = [
  '/',
  '/dashboard',
  '/dashboard/invoices',
  '/dashboard/costs',
  '/dashboard/settings',
  '/dashboard/taxes',
  '/manifest.json',
  // Add critical CSS and JS files
  '/favicon.ico'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /^\/api\/auth\/me$/,
  /^\/api\/settings$/,
  /^\/api\/invoices(\?.*)?$/,
  /^\/api\/costs(\?.*)?$/,
  /^\/api\/professional-funds(\?.*)?$/
];

// Images and assets to cache
const IMAGE_CACHE_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
  /^\/icons\//,
  /^\/screenshots\//
];

/**
 * Install Event
 * Cache static assets and activate immediately
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

/**
 * Activate Event
 * Clean up old caches and claim clients
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== CACHE_NAME &&
              cacheName !== API_CACHE_NAME &&
              cacheName !== IMAGES_CACHE_NAME
            ) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Claim all clients
      self.clients.claim()
    ])
  );
});

/**
 * Fetch Event Handler
 * Implement different caching strategies based on request type
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }
  
  // Handle different types of requests
  if (isAPIRequest(url.pathname)) {
    // API requests: Network-first strategy
    event.respondWith(handleAPIRequest(request));
  } else if (isImageRequest(url.pathname)) {
    // Images: Cache-first strategy
    event.respondWith(handleImageRequest(request));
  } else {
    // Static assets: Cache-first with network fallback
    event.respondWith(handleStaticRequest(request));
  }
});

/**
 * Check if request is for API endpoint
 */
function isAPIRequest(pathname) {
  return API_CACHE_PATTERNS.some(pattern => pattern.test(pathname));
}

/**
 * Check if request is for image/asset
 */
function isImageRequest(pathname) {
  return IMAGE_CACHE_PATTERNS.some(pattern => pattern.test(pathname));
}

/**
 * Handle API requests with network-first strategy
 */
async function handleAPIRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache for:', request.url);
    
    // Fallback to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API calls
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Offline - cached data not available',
        offline: true
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

/**
 * Handle image requests with cache-first strategy
 */
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGES_CACHE_NAME);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Fallback to network
    const networkResponse = await fetch(request);
    
    // Cache the response
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Failed to load image:', request.url);
    
    // Return placeholder for failed images
    return new Response('', {
      status: 404,
      statusText: 'Image Not Found'
    });
  }
}

/**
 * Handle static requests with cache-first strategy
 */
async function handleStaticRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Fallback to network
    const networkResponse = await fetch(request);
    
    // Cache the response
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Failed to load static asset:', request.url);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await cache.match('/');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    throw error;
  }
}

/**
 * Background Sync Event
 * Handle offline data synchronization
 */
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'invoice-sync') {
    event.waitUntil(syncInvoices());
  } else if (event.tag === 'cost-sync') {
    event.waitUntil(syncCosts());
  }
});

/**
 * Sync invoices when back online
 */
async function syncInvoices() {
  try {
    // Get pending invoice updates from IndexedDB
    const pendingInvoices = await getPendingInvoices();
    
    for (const invoice of pendingInvoices) {
      try {
        const response = await fetch('/api/invoices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getStoredToken()}`
          },
          body: JSON.stringify(invoice.data)
        });
        
        if (response.ok) {
          await removePendingInvoice(invoice.id);
        }
      } catch (error) {
        console.log('[SW] Failed to sync invoice:', error);
      }
    }
  } catch (error) {
    console.log('[SW] Sync invoices failed:', error);
  }
}

/**
 * Sync costs when back online
 */
async function syncCosts() {
  try {
    // Similar implementation for costs
    console.log('[SW] Syncing costs...');
    // Implementation details...
  } catch (error) {
    console.log('[SW] Sync costs failed:', error);
  }
}

/**
 * Push Notification Event
 * Handle push notifications (future feature)
 */
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: 'Hai nuove notifiche da P.IVA Balance',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    tag: 'p-iva-balance-notification',
    renotify: true,
    actions: [
      {
        action: 'open',
        title: 'Apri App'
      },
      {
        action: 'dismiss',
        title: 'Ignora'
      }
    ]
  };
  
  if (event.data) {
    const data = event.data.json();
    options.body = data.message || options.body;
    options.tag = data.tag || options.tag;
  }
  
  event.waitUntil(
    self.registration.showNotification('P.IVA Balance', options)
  );
});

/**
 * Notification Click Event
 * Handle notification interactions
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});

/**
 * Message Event
 * Handle messages from the main thread
 */
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Helper functions for IndexedDB operations (simplified)
async function getPendingInvoices() {
  // Implementation for getting pending invoices from IndexedDB
  return [];
}

async function removePendingInvoice(id) {
  // Implementation for removing synced invoice from IndexedDB
  console.log('Removed pending invoice:', id);
}

async function getStoredToken() {
  // Implementation for getting stored auth token
  return localStorage.getItem('auth_token');
}
