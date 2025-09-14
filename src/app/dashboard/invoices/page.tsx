'use client';

import React, { Suspense, lazy } from 'react';
import { LoadingSpinner } from '@/components/ui';
import { SectionErrorBoundary } from '@/components/error-boundaries';
import { BusinessProtection } from '@/components/auth/BusinessProtection';

// Disable prerendering for this page to avoid SSR issues with React Query
export const dynamic = 'force-dynamic';

// ✅ Code splitting: Lazy load Invoices component
const Invoices = lazy(() => import('@/components/invoices/Invoices'));

/**
 * Enhanced Invoices Page with Code Splitting
 * 
 * Performance optimizations:
 * - React.lazy() for Invoices component
 * - Suspense boundary with loading state
 * - Error boundary for resilience
 * 
 * Expected impact: 149 kB → ~105 kB (-30%)
 */
export default function InvoicesPage() {
    return (
        <BusinessProtection>
            <SectionErrorBoundary
                sectionName="le fatture"
                description="Errore nel caricamento del modulo fatture."
            >
                <Suspense fallback={
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <LoadingSpinner size="lg" />
                            <p className="mt-4 text-gray-600">Caricamento gestione fatture...</p>
                        </div>
                    </div>
                }>
                    <Invoices />
                </Suspense>
            </SectionErrorBoundary>
        </BusinessProtection>
    );
} 