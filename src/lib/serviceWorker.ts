/**
 * Service Worker Registration
 * SRP: Handles service worker lifecycle and registration
 */

'use client';

/**
 * Register service worker for caching and offline support
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('Service Worker not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('Service Worker registered successfully:', registration);

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            console.log('New version available! Refresh to update.');
            
            // You could show a notification to the user here
            showUpdateNotification();
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
};

/**
 * Unregister service worker
 */
export const unregisterServiceWorker = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const result = await registration.unregister();
      console.log('Service Worker unregistered:', result);
      return result;
    }
    return false;
  } catch (error) {
    console.error('Service Worker unregistration failed:', error);
    return false;
  }
};

/**
 * Check if app is running in standalone mode (PWA)
 */
export const isStandalone = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
};

/**
 * Show update notification to user
 */
const showUpdateNotification = () => {
  // Create a simple notification
  const notification = document.createElement('div');
  notification.className = `
    fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50
    flex items-center space-x-3 animate-slide-in-right
  `;
  
  notification.innerHTML = `
    <div>
      <p class="font-medium">Aggiornamento disponibile!</p>
      <p class="text-sm opacity-90">Ricarica la pagina per aggiornare</p>
    </div>
    <button 
      onclick="window.location.reload()" 
      class="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
    >
      Aggiorna
    </button>
    <button 
      onclick="this.parentElement.remove()" 
      class="text-white hover:text-gray-200"
    >
      ✕
    </button>
  `;

  document.body.appendChild(notification);

  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 10000);
};

/**
 * Request background sync for offline actions
 */
export const requestBackgroundSync = async (tag: string = 'background-sync'): Promise<void> => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    if ('sync' in registration) {
      await (registration as any).sync.register(tag);
      console.log('Background sync requested:', tag);
    }
  } catch (error) {
    console.error('Background sync request failed:', error);
  }
};

/**
 * Clear all caches
 */
export const clearAllCaches = async (): Promise<void> => {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return;
  }

  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('All caches cleared');
  } catch (error) {
    console.error('Failed to clear caches:', error);
  }
};

/**
 * Get cache storage usage
 */
export const getCacheStorageUsage = async (): Promise<{ used: number; quota: number } | null> => {
  if (typeof window === 'undefined' || !('navigator' in window) || !('storage' in navigator)) {
    return null;
  }

  try {
    const estimate = await navigator.storage.estimate();
    return {
      used: estimate.usage || 0,
      quota: estimate.quota || 0,
    };
  } catch (error) {
    console.error('Failed to get storage usage:', error);
    return null;
  }
};

/**
 * Preload critical routes
 */
export const preloadCriticalRoutes = async (routes: string[]): Promise<void> => {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return;
  }

  try {
    const cache = await caches.open('piva-balance-preload-v1');
    const requests = routes.map(route => new Request(route));
    
    await Promise.all(
      requests.map(async (request) => {
        try {
          const response = await fetch(request);
          if (response.ok) {
            await cache.put(request, response);
          }
        } catch (error) {
          console.warn(`Failed to preload route: ${request.url}`, error);
        }
      })
    );
    
    console.log('Critical routes preloaded:', routes);
  } catch (error) {
    console.error('Failed to preload critical routes:', error);
  }
};
