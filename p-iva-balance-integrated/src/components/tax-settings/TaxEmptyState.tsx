import React from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';

/**
 * Props for TaxEmptyState component
 */
interface TaxEmptyStateProps {
    selectedYear: number;
    className?: string;
}

/**
 * Tax Empty State Component
 * 
 * Follows Single Responsibility Principle - only handles empty state display.
 * Provides user-friendly message when no tax data is available.
 * 
 * Features:
 * - Clear messaging about lack of data
 * - Year-specific information
 * - Accessibility compliant with proper ARIA attributes
 * - Centered layout with icon
 * - Consistent styling with other empty states
 * 
 * @param selectedYear - Currently selected year to display in message
 * @param className - Additional CSS classes
 */
export const TaxEmptyState: React.FC<TaxEmptyStateProps> = ({
    selectedYear,
    className = ""
}) => {
    return (
        <div className={`text-center py-12 ${className}`}>
            <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
                Nessun dato per {selectedYear}
            </h3>
            <p className="mt-2 text-gray-500">
                Non sono presenti fatture per l&apos;anno selezionato.
            </p>
        </div>
    );
}; 