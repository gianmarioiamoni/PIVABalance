/**
 * Service Worker Provider
 * SRP: Manages service worker registration and lifecycle
 */

'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  registerServiceWorker, 
  unregisterServiceWorker, 
  preloadCriticalRoutes,
  isStandalone,
  getCacheStorageUsage 
} from '@/lib/serviceWorker';

interface ServiceWorkerContextType {
  isRegistered: boolean;
  isStandalone: boolean;
  cacheUsage: { used: number; quota: number } | null;
  updateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
  unregister: () => Promise<boolean>;
  clearCaches: () => Promise<void>;
  preloadRoutes: (routes: string[]) => Promise<void>;
}

const ServiceWorkerContext = createContext<ServiceWorkerContextType | null>(null);

interface ServiceWorkerProviderProps {
  children: ReactNode;
}

/**
 * Service Worker Provider Component
 * Handles service worker registration and provides context
 */
export const ServiceWorkerProvider: React.FC<ServiceWorkerProviderProps> = ({ children }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [cacheUsage, setCacheUsage] = useState<{ used: number; quota: number } | null>(null);
  const [isStandaloneMode] = useState(() => isStandalone());

  useEffect(() => {
    const initServiceWorker = async () => {
      try {
        const reg = await registerServiceWorker();
        if (reg) {
          setRegistration(reg);
          setIsRegistered(true);

          // Listen for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                }
              });
            }
          });

          // Preload critical routes
          await preloadCriticalRoutes([
            '/dashboard',
            '/dashboard/costs',
            '/dashboard/invoices',
            '/api/auth/me',
            '/api/settings',
          ]);
        }
      } catch (error) {
        console.error('Service Worker initialization failed:', error);
      }
    };

    // Only register in production or when explicitly enabled
    if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_SW === 'true') {
      initServiceWorker();
    }

    // Get cache usage
    getCacheStorageUsage().then(setCacheUsage);

    // Update cache usage periodically
    const interval = setInterval(() => {
      getCacheStorageUsage().then(setCacheUsage);
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  const handleUnregister = async (): Promise<boolean> => {
    const result = await unregisterServiceWorker();
    if (result) {
      setIsRegistered(false);
      setRegistration(null);
    }
    return result;
  };

  const handleClearCaches = async (): Promise<void> => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      setCacheUsage(null);
      // Refresh cache usage
      setTimeout(() => {
        getCacheStorageUsage().then(setCacheUsage);
      }, 1000);
    }
  };

  const handlePreloadRoutes = async (routes: string[]): Promise<void> => {
    await preloadCriticalRoutes(routes);
  };

  const contextValue: ServiceWorkerContextType = {
    isRegistered,
    isStandalone: isStandaloneMode,
    cacheUsage,
    updateAvailable,
    registration,
    unregister: handleUnregister,
    clearCaches: handleClearCaches,
    preloadRoutes: handlePreloadRoutes,
  };

  return (
    <ServiceWorkerContext.Provider value={contextValue}>
      {children}
      {updateAvailable && <UpdateNotification />}
    </ServiceWorkerContext.Provider>
  );
};

/**
 * Update notification component
 */
const UpdateNotification: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 bg-blue-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-sm">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold mb-1">Aggiornamento Disponibile!</h4>
          <p className="text-sm opacity-90 mb-3">
            Una nuova versione è disponibile. Ricarica per aggiornare.
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => window.location.reload()}
              className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Aggiorna Ora
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="bg-blue-700 text-white px-3 py-1 rounded text-sm hover:bg-blue-800 transition-colors"
            >
              Più Tardi
            </button>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white hover:text-gray-200 ml-2"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

/**
 * Hook to use Service Worker context
 */
export const useServiceWorker = (): ServiceWorkerContextType => {
  const context = useContext(ServiceWorkerContext);
  if (!context) {
    throw new Error('useServiceWorker must be used within a ServiceWorkerProvider');
  }
  return context;
};
