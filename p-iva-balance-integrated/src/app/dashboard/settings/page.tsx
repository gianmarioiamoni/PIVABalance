'use client';

import React, { Suspense, lazy } from 'react';
import { LoadingSpinner } from '@/components/ui';
import { SectionErrorBoundary } from '@/components/error-boundaries';

// Disable prerendering for this page to avoid SSR issues with React Query
export const dynamic = 'force-dynamic';

// ✅ Code splitting: Lazy load TaxSettings component
const TaxSettings = lazy(() => import('@/components/tax-settings/main/TaxSettings'));

/**
 * Enhanced Settings Page with Code Splitting
 * 
 * Performance optimizations:
 * - React.lazy() for TaxSettings component
 * - Suspense boundary with loading state
 * - Error boundary for resilience
 * 
 * Expected impact: 177 kB → ~120 kB (-32%)
 */
export default function SettingsPage() {
    return (
        <SectionErrorBoundary
            sectionName="le impostazioni fiscali"
            description="Errore nel caricamento delle impostazioni fiscali."
        >
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <LoadingSpinner size="lg" />
                        <p className="mt-4 text-gray-600">Caricamento impostazioni fiscali...</p>
                    </div>
                </div>
            }>
                <TaxSettings
                    activeTab="settings"
                    attemptedTab={undefined}
                    onTabChange={() => { }}
                    onCancelTabChange={() => { }}
                />
            </Suspense>
        </SectionErrorBoundary>
    );
} 