import React from 'react';
// ✅ Ottimizzazione: Uso sistema Icon dinamico
import { Icon } from '@/components/ui';

/**
 * Props for TaxEmptyState component
 */
interface TaxEmptyStateProps {
    year: number;
}

/**
 * Empty state component for tax calculations with optimized icon
 */
export const TaxEmptyState: React.FC<TaxEmptyStateProps> = ({ year }) => {
    return (
        <div className="text-center py-12">
            <Icon name="ChartBarIcon" className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nessun dato disponibile
            </h3>
            <p className="mt-1 text-sm text-gray-500">
                Non ci sono dati fiscali per l&apos;anno {year}. 
                Assicurati di aver inserito fatture e costi.
            </p>
        </div>
    );
}; 