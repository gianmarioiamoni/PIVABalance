import React from 'react';
import { TaxCalculationResult } from '@/types/tax';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

/**
 * Props for TaxSummarySection component
 */
interface TaxSummarySectionProps {
    calculationResult: TaxCalculationResult;
    selectedYear: number;
    taxRegime?: string;
    isLoading: boolean;
    className?: string;
}

/**
 * Tax Summary Section Component
 * 
 * Follows Single Responsibility Principle - only handles summary display.
 * Provides a comprehensive summary of tax calculations with key metrics.
 * 
 * Features:
 * - Net income calculation (income - taxes)
 * - Tax pressure percentage
 * - Tax regime display
 * - Responsive grid layout
 * - Conditional rendering based on data availability
 * - Consistent formatting for all values
 * 
 * @param calculationResult - Tax calculation results
 * @param selectedYear - Currently selected year
 * @param taxRegime - Current tax regime
 * @param isLoading - Whether calculations are loading
 * @param className - Additional CSS classes
 */
export const TaxSummarySection: React.FC<TaxSummarySectionProps> = ({
    calculationResult,
    selectedYear,
    taxRegime,
    isLoading,
    className = ""
}) => {
    // Don't render if loading or no income
    if (isLoading || calculationResult.totalIncome === 0) {
        return null;
    }

    const netIncome = calculationResult.totalIncome - calculationResult.totalTaxes;

    return (
        <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 ${className}`}>
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Riepilogo Fiscale {selectedYear}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {/* Net Income */}
                <div>
                    <span className="text-blue-700 font-medium">Reddito Netto:</span>
                    <div className="text-lg font-bold text-blue-900">
                        {formatCurrency(netIncome)}
                    </div>
                </div>

                {/* Tax Pressure */}
                <div>
                    <span className="text-blue-700 font-medium">Pressione Fiscale:</span>
                    <div className="text-lg font-bold text-blue-900">
                        {formatPercentage(calculationResult.effectiveRate)}
                    </div>
                </div>

                {/* Tax Regime */}
                <div>
                    <span className="text-blue-700 font-medium">Regime Fiscale:</span>
                    <div className="text-lg font-bold text-blue-900 capitalize">
                        {taxRegime || 'Non definito'}
                    </div>
                </div>
            </div>
        </div>
    );
}; 