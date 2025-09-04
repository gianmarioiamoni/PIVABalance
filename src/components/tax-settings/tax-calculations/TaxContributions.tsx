'use client';

import React from 'react';
import { useTaxCalculations, useYearSelection } from '@/hooks/tax-settings';
import { ErrorDisplay } from '@/components/ui';

// Import from same directory (relative paths)
import { TaxCalculationsHeader } from './TaxCalculationsHeader';
import { TaxCalculationsGrid } from './TaxCalculationsGrid';
import { TaxSummarySection } from './TaxSummarySection';
import { TaxEmptyState } from './TaxEmptyState';

/**
 * Props for TaxContributions component
 */
interface TaxContributionsProps {
    className?: string;
    defaultYear?: number;
}

/**
 * Tax Contributions Component
 * 
 * Refactored to follow SOLID principles:
 * - Single Responsibility: Orchestrates tax calculations UI composition
 * - Open/Closed: Extensible through props and composition
 * - Dependency Inversion: Depends on abstractions (hooks, components)
 * 
 * Features:
 * - Year selection with validation
 * - Real-time tax calculations
 * - Visual breakdown of costs and taxes
 * - Accessible data presentation
 * - Mobile-responsive design
 * - Loading states and error feedback
 * - Modular component architecture
 * 
 * @example
 * ```tsx
 * <TaxContributions defaultYear={2025} />
 * ```
 */
const TaxContributions: React.FC<TaxContributionsProps> = React.memo(({
    className = '',
    defaultYear = new Date().getFullYear(),
}) => {
    // Year selection hook
    const {
        selectedYear,
        availableYears,
        handleYearChange
    } = useYearSelection(defaultYear);

    // Tax calculations hook with all business logic
    const {
        calculationResult,
        settings,
        isLoading,
        hasError,
        errorMessage,
        handleRefreshCalculations
    } = useTaxCalculations(selectedYear);

    /**
     * Generate unique IDs for accessibility
     */
    const componentId = React.useId();
    const errorId = hasError ? `tax-error-${componentId}` : undefined;

    return (
        <div
            className={`space-y-6 ${className}`}
            role="main"
            aria-labelledby={`tax-contributions-title-${componentId}`}
            aria-describedby={errorId}
        >
            {/* Header Section */}
            <TaxCalculationsHeader
                selectedYear={selectedYear}
                availableYears={availableYears}
                isLoading={isLoading}
                onYearChange={handleYearChange}
                onRefresh={handleRefreshCalculations}
            />

            {/* Error Message */}
            {hasError && (
                <div id={errorId}>
                    <ErrorDisplay
                        message={errorMessage || 'Errore nel caricamento dei dati'}
                        title="Errore nel caricamento dei dati"
                    />
                </div>
            )}

            {/* Calculation Cards Grid */}
            <TaxCalculationsGrid
                calculationResult={calculationResult}
                selectedYear={selectedYear}
                settings={settings}
                isLoading={isLoading}
            />

            {/* Summary Section */}
            <TaxSummarySection
                calculationResult={calculationResult}
                selectedYear={selectedYear}
                taxRegime={settings?.taxRegime}
                isLoading={isLoading}
            />

            {/* Empty State */}
            {!isLoading && calculationResult.totalIncome === 0 && !hasError && (
                <TaxEmptyState year={selectedYear} />
            )}
        </div>
    );
});

TaxContributions.displayName = 'TaxContributions';

export default TaxContributions; 