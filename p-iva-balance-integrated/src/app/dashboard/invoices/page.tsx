'use client';

import { Suspense } from 'react';
import Invoices from '@/components/invoices/Invoices';
import { LoadingSpinner } from '@/components/ui';
import { SectionErrorBoundary } from '@/components/error-boundaries';

// Disable prerendering for this page to avoid SSR issues with React Query
export const dynamic = 'force-dynamic';

export default function InvoicesPage() {
    return (
        <SectionErrorBoundary 
            sectionName="le fatture" 
            description="Errore nel caricamento del modulo fatture."
        >
            <Suspense fallback={<LoadingSpinner />}>
                <Invoices />
            </Suspense>
        </SectionErrorBoundary>
    );
} 