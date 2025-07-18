'use client';

import TaxContributions from '@/components/tax-settings/tax-calculations/TaxContributions';
import { SectionErrorBoundary } from '@/components/error-boundaries';

/**
 * Taxes Page (Client Component with Error Boundary)
 * 
 * Simple page component that renders the TaxContributions component.
 * Converted to client component to support error boundaries.
 */
export default function TaxesPage() {
    return (
        <SectionErrorBoundary 
            sectionName="il calcolo delle tasse" 
            description="Errore nel caricamento del modulo calcolo tasse e contributi."
        >
            <TaxContributions />
        </SectionErrorBoundary>
    );
} 