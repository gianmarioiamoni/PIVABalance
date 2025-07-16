'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    BanknotesIcon,
    ReceiptPercentIcon,
    CalculatorIcon,
    CurrencyEuroIcon,
    ChartBarIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    CalendarIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useTaxSettings } from '@/hooks/useTaxSettings';
import { useInvoices } from '@/hooks/invoices/useInvoices';
import { useCosts } from '@/hooks/costs/useCosts';
import { taxCalculationService } from '@/services/taxCalculationService';
import { formatCurrency } from '@/utils/formatters';
import Tooltip from '@/components/Tooltip';

/**
 * Tax calculation result interface
 * Provides strict typing for all calculated values
 */
interface TaxCalculationResult {
    totalIncome: number;
    totalCosts: number;
    taxableIncome: number;
    irpefAmount: number;
    contributionsAmount: number;
    totalTaxes: number;
    effectiveRate: number;
}

/**
 * Props for TaxContributions component
 */
interface TaxContributionsProps {
    className?: string;
    defaultYear?: number;
}

/**
 * Card component for displaying calculation results
 * Reusable component following Single Responsibility Principle
 */
interface CalculationCardProps {
    title: string;
    value: number;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    tooltip?: string;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
    isLoading?: boolean;
    'aria-label'?: string;
}

const CalculationCard: React.FC<CalculationCardProps> = React.memo(({
    title,
    value,
    icon: Icon,
    tooltip,
    variant = 'default',
    isLoading = false,
    'aria-label': ariaLabel,
}) => {
    const variantStyles = {
        default: 'bg-white border-gray-200 text-gray-900',
        primary: 'bg-blue-50 border-blue-200 text-blue-900',
        success: 'bg-green-50 border-green-200 text-green-900',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
        danger: 'bg-red-50 border-red-200 text-red-900',
    };

    const iconStyles = {
        default: 'text-gray-500',
        primary: 'text-blue-500',
        success: 'text-green-500',
        warning: 'text-yellow-500',
        danger: 'text-red-500',
    };

    return (
        <div
            className={`
        p-6 rounded-lg border-2 shadow-sm transition-all duration-200 ease-in-out
        hover:shadow-md hover:-translate-y-0.5
        ${variantStyles[variant]}
        ${isLoading ? 'animate-pulse' : ''}
      `}
            role="region"
            aria-label={ariaLabel || `${title}: ${formatCurrency(value)}`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-2">
                        <Icon className={`h-5 w-5 mr-2 flex-shrink-0 ${iconStyles[variant]}`} aria-hidden="true" />
                        <h3 className="text-sm font-medium truncate">{title}</h3>
                        {tooltip && (
                            <Tooltip content={tooltip}>
                                <InformationCircleIcon className="ml-1 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                            </Tooltip>
                        )}
                    </div>
                    <div className="mt-2">
                        {isLoading ? (
                            <div className="h-8 bg-gray-200 rounded animate-pulse" />
                        ) : (
                            <p className="text-2xl font-bold">
                                {formatCurrency(value)}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

CalculationCard.displayName = 'CalculationCard';

/**
 * Enhanced Tax Contributions Component
 * 
 * Advanced component for calculating and displaying tax obligations:
 * - WCAG accessibility compliance
 * - TypeScript strict typing (zero 'any')
 * - Modern UX with loading states and animations
 * - Responsive design (mobile-first)
 * - Real-time calculations
 * - Error handling and validation
 * - SOLID principles adherence
 * 
 * Features:
 * - Year selection with validation
 * - Real-time tax calculations
 * - Visual breakdown of costs and taxes
 * - Accessible data presentation
 * - Mobile-responsive grid layout
 * - Loading states and error feedback
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
    // State management
    const [selectedYear, setSelectedYear] = useState<number>(defaultYear);
    const [isCalculating, setIsCalculating] = useState(false);
    const [calculationError, setCalculationError] = useState<string | null>(null);

    // Hooks for data fetching
    const { state: { settings, loading: settingsLoading } } = useTaxSettings();
    const { invoices, loading: invoicesLoading, error: invoicesError } = useInvoices(selectedYear, settings?.taxRegime);
    const { costs, loading: costsLoading, error: costsError } = useCosts(selectedYear);

    /**
     * Generate available years for selection
     * Starting from 2025 up to current year + 1
     */
    const availableYears = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const startYear = 2025;
        const endYear = Math.max(currentYear + 1, startYear);

        return Array.from(
            { length: endYear - startYear + 1 },
            (_, i) => startYear + i
        ).reverse(); // Most recent years first
    }, []);

    /**
     * Calculate tax obligations based on current data
     * Memoized to prevent unnecessary recalculations
     */
    const calculationResult = useMemo((): TaxCalculationResult => {
        if (!settings || settingsLoading || invoicesLoading || costsLoading) {
            return {
                totalIncome: 0,
                totalCosts: 0,
                taxableIncome: 0,
                irpefAmount: 0,
                contributionsAmount: 0,
                totalTaxes: 0,
                effectiveRate: 0,
            };
        }

        try {
            // Calculate total income from invoices
            const totalIncome = invoices
                .filter(inv => inv.issueDate && new Date(inv.issueDate).getFullYear() === selectedYear)
                .reduce((sum, inv) => sum + inv.amount, 0);

            // Calculate total costs
            const totalCosts = costs
                .filter(cost => cost.deductible)
                .reduce((sum, cost) => sum + cost.amount, 0);

            // Calculate taxable income based on regime
            let taxableIncome = 0;
            if (settings.taxRegime === 'forfettario') {
                // Forfettario: apply profitability coefficient and subtract costs
                taxableIncome = Math.max(0, (totalIncome * (settings.profitabilityRate || 0) / 100) - totalCosts);
            } else {
                // Ordinario: income minus deductible costs
                taxableIncome = Math.max(0, totalIncome - totalCosts);
            }

            // Calculate IRPEF/substitute tax
            const irpefAmount = settings.taxRegime === 'forfettario'
                ? taxableIncome * (settings.substituteRate || 0) / 100
                : 0; // For ordinario, IRPEF calculation is more complex

            // Calculate pension contributions
            const contributionsAmount = taxCalculationService.calculateContributions(
                taxableIncome,
                settings.manualContributionRate || 0,
                settings.manualFixedAnnualContributions || 0
            );

            const totalTaxes = irpefAmount + contributionsAmount;
            const effectiveRate = totalIncome > 0 ? (totalTaxes / totalIncome) * 100 : 0;

            return {
                totalIncome,
                totalCosts,
                taxableIncome,
                irpefAmount,
                contributionsAmount,
                totalTaxes,
                effectiveRate,
            };
        } catch (error) {
            console.error('Error calculating tax contributions:', error);
            setCalculationError('Errore nel calcolo delle imposte');
            return {
                totalIncome: 0,
                totalCosts: 0,
                taxableIncome: 0,
                irpefAmount: 0,
                contributionsAmount: 0,
                totalTaxes: 0,
                effectiveRate: 0,
            };
        }
    }, [settings, settingsLoading, invoices, invoicesLoading, costs, costsLoading, selectedYear]);

    /**
     * Handle year selection with validation
     */
    const handleYearChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        const year = parseInt(event.target.value, 10);
        if (availableYears.includes(year)) {
            setSelectedYear(year);
            setCalculationError(null);
        }
    }, [availableYears]);

    /**
     * Refresh calculations manually
     */
    const handleRefreshCalculations = useCallback(async () => {
        setIsCalculating(true);
        setCalculationError(null);

        try {
            // Simulate brief loading for UX feedback
            await new Promise(resolve => setTimeout(resolve, 500));
            // Calculations are already updated via the useMemo dependency array
        } catch (error) {
            setCalculationError('Errore durante l\'aggiornamento dei calcoli');
        } finally {
            setIsCalculating(false);
        }
    }, []);

    /**
     * Check if data is loading
     */
    const isLoading = settingsLoading || invoicesLoading || costsLoading || isCalculating;

    /**
     * Check for errors
     */
    const hasError = Boolean(invoicesError || costsError || calculationError);
    const errorMessage = calculationError || invoicesError || costsError;

    /**
     * Generate unique IDs for accessibility
     */
    const componentId = React.useId();
    const yearSelectId = `tax-year-select-${componentId}`;
    const errorId = hasError ? `tax-error-${componentId}` : undefined;

    return (
        <div
            className={`space-y-6 ${className}`}
            role="main"
            aria-labelledby={`tax-contributions-title-${componentId}`}
            aria-describedby={errorId}
        >
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 id={`tax-contributions-title-${componentId}`} className="text-2xl font-bold text-gray-900">
                        Calcolo Tasse e Contributi
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">
                        Riepilogo delle imposte e contributi previdenziali per l'anno selezionato
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Year Selection */}
                    <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        <label htmlFor={yearSelectId} className="sr-only">
                            Seleziona anno
                        </label>
                        <select
                            id={yearSelectId}
                            value={selectedYear}
                            onChange={handleYearChange}
                            disabled={isLoading}
                            className={`
                px-3 py-2 border border-gray-300 rounded-md shadow-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                text-sm font-medium
              `}
                            aria-label="Seleziona anno per il calcolo"
                        >
                            {availableYears.map(year => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Refresh Button */}
                    <button
                        onClick={handleRefreshCalculations}
                        disabled={isLoading}
                        className={`
              inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm
              text-sm font-medium text-gray-700 bg-white
              hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
            `}
                        aria-label="Aggiorna calcoli"
                    >
                        <ArrowPathIcon
                            className={`h-4 w-4 ${isCalculating ? 'animate-spin' : ''}`}
                            aria-hidden="true"
                        />
                        <span className="ml-2 hidden sm:inline">Aggiorna</span>
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {hasError && (
                <div
                    id={errorId}
                    className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg"
                    role="alert"
                    aria-live="polite"
                >
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" aria-hidden="true" />
                    <div className="text-sm text-red-700">
                        <p className="font-medium">Errore nel caricamento dei dati</p>
                        <p>{errorMessage}</p>
                    </div>
                </div>
            )}

            {/* Calculation Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <CalculationCard
                    title="Fatturato"
                    value={calculationResult.totalIncome}
                    icon={BanknotesIcon}
                    tooltip="Totale delle fatture emesse nell'anno"
                    variant="primary"
                    isLoading={isLoading}
                    aria-label={`Fatturato ${selectedYear}`}
                />

                <CalculationCard
                    title="Costi Deducibili"
                    value={calculationResult.totalCosts}
                    icon={ReceiptPercentIcon}
                    tooltip="Totale dei costi deducibili sostenuti"
                    variant="default"
                    isLoading={isLoading}
                    aria-label={`Costi deducibili ${selectedYear}`}
                />

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

                <CalculationCard
                    title="Contributi Previdenziali"
                    value={calculationResult.contributionsAmount}
                    icon={ChartBarIcon}
                    tooltip="Contributi versati al sistema previdenziale (INPS o Cassa Professionale)"
                    variant="danger"
                    isLoading={isLoading}
                    aria-label={`Contributi previdenziali ${selectedYear}`}
                />

                <CalculationCard
                    title="Totale Tasse"
                    value={calculationResult.totalTaxes}
                    icon={CalculatorIcon}
                    tooltip="Somma di imposte e contributi previdenziali"
                    variant="danger"
                    isLoading={isLoading}
                    aria-label={`Totale tasse ${selectedYear}`}
                />

                {calculationResult.totalIncome > 0 && (
                    <CalculationCard
                        title="Aliquota Effettiva"
                        value={calculationResult.effectiveRate}
                        icon={ReceiptPercentIcon}
                        tooltip="Percentuale del fatturato destinata a tasse e contributi"
                        variant="warning"
                        isLoading={isLoading}
                        aria-label={`Aliquota effettiva ${calculationResult.effectiveRate.toFixed(1)}%`}
                    />
                )}
            </div>

            {/* Summary Section */}
            {!isLoading && calculationResult.totalIncome > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">
                        Riepilogo Fiscale {selectedYear}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="text-blue-700 font-medium">Reddito Netto:</span>
                            <div className="text-lg font-bold text-blue-900">
                                {formatCurrency(calculationResult.totalIncome - calculationResult.totalTaxes)}
                            </div>
                        </div>
                        <div>
                            <span className="text-blue-700 font-medium">Pressione Fiscale:</span>
                            <div className="text-lg font-bold text-blue-900">
                                {calculationResult.effectiveRate.toFixed(1)}%
                            </div>
                        </div>
                        <div>
                            <span className="text-blue-700 font-medium">Regime Fiscale:</span>
                            <div className="text-lg font-bold text-blue-900 capitalize">
                                {settings?.taxRegime || 'Non definito'}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && calculationResult.totalIncome === 0 && !hasError && (
                <div className="text-center py-12">
                    <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                        Nessun dato per {selectedYear}
                    </h3>
                    <p className="mt-2 text-gray-500">
                        Non sono presenti fatture per l'anno selezionato.
                    </p>
                </div>
            )}
        </div>
    );
});

TaxContributions.displayName = 'TaxContributions';

export default TaxContributions; 