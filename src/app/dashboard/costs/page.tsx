'use client';

import React, { Suspense, lazy } from 'react';
import { LoadingSpinner } from '@/components/ui';
import { SectionErrorBoundary } from '@/components/error-boundaries';

// ✅ Code splitting: Lazy load Costs component
const Costs = lazy(() => import('@/components/Costs').then(module => ({ default: module.Costs })));

/**
 * Enhanced Costs Page with Code Splitting
 * 
 * Performance optimizations:
 * - React.lazy() for Costs component
 * - Suspense boundary with loading state
 * - Error boundary for resilience
 * 
 * Expected impact: 150 kB → ~110 kB (-27%)
 */
export default function CostsPage() {
    return (
        <SectionErrorBoundary
            sectionName="i costi"
            description="Errore nel caricamento del modulo costi."
        >
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <LoadingSpinner size="lg" />
                        <p className="mt-4 text-gray-600">Caricamento gestione costi...</p>
                    </div>
                </div>
            }>
                <Costs />
            </Suspense>
        </SectionErrorBoundary>
    );
} 