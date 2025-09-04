'use client';

import React, { Suspense, lazy } from 'react';
import { LoadingSpinner } from '@/components/ui';
import { SectionErrorBoundary } from '@/components/error-boundaries';

// ✅ Code splitting: Lazy load TaxContributions component
const TaxContributions = lazy(() => import('@/components/tax-settings/tax-calculations/TaxContributions'));

/**
 * Enhanced Taxes Page with Code Splitting
 * 
 * Performance optimizations:
 * - React.lazy() for TaxContributions component
 * - Suspense boundary with loading state
 * - Error boundary for resilience
 * 
 * Expected impact: 174 kB → ~115 kB (-34%)
 */
export default function TaxesPage() {
    return (
        <SectionErrorBoundary
            sectionName="il calcolo delle tasse"
            description="Errore nel caricamento del modulo calcolo tasse e contributi."
        >
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <LoadingSpinner size="lg" />
                        <p className="mt-4 text-gray-600">Caricamento calcoli fiscali...</p>
                    </div>
                </div>
            }>
                <TaxContributions />
            </Suspense>
        </SectionErrorBoundary>
    );
} 