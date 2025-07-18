'use client';

import { Costs } from '@/components/Costs';
import { SectionErrorBoundary } from '@/components/error-boundaries';

export default function CostsPage() {
    return (
        <SectionErrorBoundary
            sectionName="i costi"
            description="Errore nel caricamento del modulo costi."
        >
            <Costs />
        </SectionErrorBoundary>
    );
} 