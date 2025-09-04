import React from 'react';
import {
    BanknotesIcon,
    ReceiptPercentIcon,
    CalculatorIcon,
    CurrencyEuroIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';
import { CalculationCard } from '@/components/ui';
import { TaxCalculationResult } from '@/types/tax';
import { formatPercentage } from '@/utils/formatters';

/**
 * Props for TaxCalculationsGrid component
 */
interface TaxCalculationsGridProps {
    calculationResult: TaxCalculationResult;
    selectedYear: number;
    settings?: {
        taxRegime?: string;
        profitabilityRate?: number;
        substituteRate?: number;
    };
    isLoading: boolean;
    className?: string;
}

/**
 * Tax Calculations Grid Component
 * 
 * Follows Single Responsibility Principle - only handles calculation cards grid display.
 * Provides a responsive grid of calculation cards with appropriate icons and tooltips.
 * 
 * Features:
 * - Responsive grid layout (1-4 columns based on screen size)
 * - Dynamic tooltips based on tax regime
 * - Conditional display of effective rate card
 * - Loading states for all cards
 * - Accessibility compliant with ARIA labels
 * 
 * @param calculationResult - Tax calculation results
 * @param selectedYear - Currently selected year for ARIA labels
 * @param settings - Tax settings for dynamic tooltips
 * @param isLoading - Whether calculations are loading
 * @param className - Additional CSS classes
 */
export const TaxCalculationsGrid: React.FC<TaxCalculationsGridProps> = ({
    calculationResult,
    selectedYear,
    settings,
    isLoading,
    className = ""
}) => {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
            {/* Total Income */}
            <CalculationCard
                title="Fatturato"
                value={calculationResult.totalIncome}
                icon={BanknotesIcon}
                tooltip="Totale delle fatture emesse nell'anno"
                variant="primary"
                isLoading={isLoading}
                aria-label={`Fatturato ${selectedYear}`}
            />

            {/* Deductible Costs */}
            <CalculationCard
                title="Costi Deducibili"
                value={calculationResult.totalCosts}
                icon={ReceiptPercentIcon}
                tooltip="Totale dei costi deducibili sostenuti"
                variant="default"
                isLoading={isLoading}
                aria-label={`Costi deducibili ${selectedYear}`}
            />

            {/* Taxable Income */}
            <CalculationCard
                title="Reddito Imponibile"
                value={calculationResult.taxableIncome}
                icon={CalculatorIcon}
                tooltip={
                    settings?.taxRegime === 'forfettario'
                        ? `Calcolato applicando il coefficiente di redditività (${settings.profitabilityRate}%) e sottraendo i costi`
                        : 'Calcolato sottraendo i costi deducibili dal fatturato'
                }
                variant="warning"
                isLoading={isLoading}
                aria-label={`Reddito imponibile ${selectedYear}`}
            />

            {/* IRPEF/Substitute Tax */}
            <CalculationCard
                title={settings?.taxRegime === 'forfettario' ? 'Imposta Sostitutiva' : 'IRPEF'}
                value={calculationResult.irpefAmount}
                icon={CurrencyEuroIcon}
                tooltip={
                    settings?.taxRegime === 'forfettario'
                        ? `Imposta sostitutiva al ${settings.substituteRate}%`
                        : 'Imposta sul reddito delle persone fisiche'
                }
                variant="danger"
                isLoading={isLoading}
                aria-label={`${settings?.taxRegime === 'forfettario' ? 'Imposta sostitutiva' : 'IRPEF'} ${selectedYear}`}
            />

            {/* Pension Contributions */}
            <CalculationCard
                title="Contributi Previdenziali"
                value={calculationResult.contributionsAmount}
                icon={ChartBarIcon}
                tooltip="Contributi versati al sistema previdenziale (INPS o Cassa Professionale)"
                variant="danger"
                isLoading={isLoading}
                aria-label={`Contributi previdenziali ${selectedYear}`}
            />

            {/* Total Taxes */}
            <CalculationCard
                title="Totale Tasse"
                value={calculationResult.totalTaxes}
                icon={CalculatorIcon}
                tooltip="Somma di imposte e contributi previdenziali"
                variant="danger"
                isLoading={isLoading}
                aria-label={`Totale tasse ${selectedYear}`}
            />

            {/* Effective Rate (conditional) */}
            {calculationResult.totalIncome > 0 && (
                <CalculationCard
                    title="Aliquota Effettiva"
                    value={calculationResult.effectiveRate}
                    icon={ReceiptPercentIcon}
                    tooltip="Percentuale del fatturato destinata a tasse e contributi"
                    variant="warning"
                    isLoading={isLoading}
                    aria-label={`Aliquota effettiva ${formatPercentage(calculationResult.effectiveRate)}`}
                />
            )}
        </div>
    );
}; 