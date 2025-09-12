/**
 * Lazy Loading Components
 * SRP: Dynamic imports for performance optimization ONLY
 */

'use client';

import dynamic from 'next/dynamic';
import { ComponentType, ReactElement } from 'react';

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-sm text-gray-600">Caricamento...</span>
  </div>
);

// Loading skeleton for dashboard components
const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
        ))}
      </div>
    </div>
  </div>
);

// Lazy loaded components with optimized loading
export const LazyCustomizableDashboard = dynamic(
  () => import('@/components/dashboard/CustomizableDashboard').then(mod => ({ default: mod.CustomizableDashboard })),
  {
    loading: () => <DashboardSkeleton />,
    ssr: false, // Disable SSR for heavy interactive components
  }
);

export const LazyPerformanceDashboard = dynamic(
  () => import('@/components/monitoring/PerformanceDashboard').then(mod => ({ default: mod.PerformanceDashboard })),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const LazySecurityDashboard = dynamic(
  () => import('@/components/monitoring/SecurityDashboard').then(mod => ({ default: mod.SecurityDashboard })),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const LazyWidgetLibrary = dynamic(
  () => import('@/components/dashboard/WidgetLibrary'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

// Charts and heavy visualization components
export const LazyChartComponents = {
  LineChart: dynamic(() => import('recharts').then(mod => ({ default: mod.LineChart })), {
    loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded"></div>,
    ssr: false,
  }),
  BarChart: dynamic(() => import('recharts').then(mod => ({ default: mod.BarChart })), {
    loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded"></div>,
    ssr: false,
  }),
  PieChart: dynamic(() => import('recharts').then(mod => ({ default: mod.PieChart })), {
    loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded"></div>,
    ssr: false,
  }),
};

// Heavy form components
export const LazyCostForm = dynamic(
  () => import('@/components/costs/CostForm').then(mod => ({ default: mod.CostForm })),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const LazyInvoiceForm = dynamic(
  () => import('@/components/invoices/NewInvoiceForm'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

// Placeholder for future analytics components
// TODO: Add proper default exports to analytics components for lazy loading

/**
 * Higher-order component for lazy loading with error boundary
 */
export function withLazyLoading<T extends object>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  fallback: () => ReactElement = LoadingSpinner
): ComponentType<T> {
  return dynamic(importFn, {
    loading: fallback,
    ssr: false,
  });
}

/**
 * Preload component for critical routes
 */
export const preloadComponent = (importFn: () => Promise<unknown>) => {
  if (typeof window !== 'undefined') {
    // Preload on idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => importFn());
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => importFn(), 1);
    }
  }
};
