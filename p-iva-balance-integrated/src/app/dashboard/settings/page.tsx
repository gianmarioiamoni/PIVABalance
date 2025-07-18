'use client';

import { Suspense } from 'react';
import TaxSettings from '@/components/tax-settings/main/TaxSettings';
import { LoadingSpinner } from '@/components/ui';
import { SectionErrorBoundary } from '@/components/error-boundaries';

// Disable prerendering for this page to avoid SSR issues with React Query
export const dynamic = 'force-dynamic';

/**
 * Settings Page (Client Component with Suspense)
 * 
 * Wrapped with Suspense to handle SSR compatibility issues
 * with useSearchParams in nested components.
 */
export default function SettingsPage() {
    return (
        <SectionErrorBoundary 
            sectionName="le impostazioni fiscali" 
            description="Errore nel caricamento delle impostazioni fiscali."
        >
            <Suspense fallback={<LoadingSpinner />}>
                <div>
                    <TaxSettings
                        activeTab="settings"
                        attemptedTab={undefined}
                        onTabChange={() => { }}
                        onCancelTabChange={() => { }}
                    />
                </div>
            </Suspense>
        </SectionErrorBoundary>
    );
} 