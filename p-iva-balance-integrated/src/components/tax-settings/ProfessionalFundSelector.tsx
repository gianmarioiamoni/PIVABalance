'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import { ChevronDownIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useProfessionalFunds, useProfessionalFundUtils } from '@/hooks/useProfessionalFunds';
import { ProfessionalFund, ProfessionalFundParameters } from '@/services/professionalFundService';
import { Tooltip } from '@/components/ui/Tooltip';
import { professionalFundInfo } from '@/components/tooltips/TooltipsText';

/**
 * Props for ProfessionalFundSelector component
 * Following Interface Segregation Principle - only required props
 */
interface ProfessionalFundSelectorProps {
  value?: string;
  onChange: (fundId: string) => void;
  onFundChange: (fund: ProfessionalFund | null) => void;
  onParametersChange?: (params: ProfessionalFundParameters | null) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

/**
 * Professional Fund Selector Component
 * 
 * Enhanced component for selecting professional pension funds with:
 * - WCAG accessibility compliance
 * - TypeScript strict typing (zero 'any')
 * - Modern UX with loading states and transitions
 * - Responsive design (mobile-first)
 * - React Query for efficient data fetching
 * - SOLID principles adherence
 * 
 * @example
 * ```tsx
 * <ProfessionalFundSelector
 *   value={settings.professionalFundId}
 *   onChange={(fundId) => handleChange('professionalFundId', fundId)}
 *   onFundChange={(fund) => {
 *     // Handle fund selection logic
 *   }}
 *   onParametersChange={(params) => {
 *     // Handle parameter updates
 *   }}
 * />
 * ```
 */
const ProfessionalFundSelector: React.FC<ProfessionalFundSelectorProps> = React.memo(({
  value = '',
  onChange,
  onFundChange,
  onParametersChange,
  error,
  disabled = false,
  className = '',
  'aria-label': ariaLabel = 'Seleziona cassa professionale',
  'aria-describedby': ariaDescribedBy,
}) => {
  const { data: funds = [], isLoading, error: loadError } = useProfessionalFunds();
  const { findFundByCode, getCurrentParameters } = useProfessionalFundUtils();

  /**
   * Generate unique IDs for accessibility - must be called before any early returns
   * Ensures proper labeling and description relationships
   */
  const componentId = React.useId();
  const selectId = `professional-fund-select-${componentId}`;
  const errorId = error ? `${selectId}-error` : undefined;

  /**
   * Find selected fund using memoized computation
   * Optimizes performance by avoiding recalculation on every render
   */
  const selectedFund = useMemo(() => {
    if (!value || !funds.length) return null;
    return findFundByCode(funds, value) || null;
  }, [value, funds, findFundByCode]);

  /**
   * Get current parameters for selected fund
   * Memoized to prevent unnecessary recalculations
   */
  const currentParameters = useMemo(() => {
    if (!selectedFund) return null;
    return getCurrentParameters(selectedFund);
  }, [selectedFund, getCurrentParameters]);

  // Calculate accessibility IDs after currentParameters is available
  const parametersId = currentParameters ? `${selectId}-parameters` : undefined;
  const combinedAriaDescribedBy = [ariaDescribedBy, errorId, parametersId]
    .filter(Boolean)
    .join(' ') || undefined;

  /**
   * Handle fund selection with proper callbacks
   * Uses useCallback to prevent unnecessary re-renders
   */
  const handleFundSelection = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const fundCode = event.target.value;
    const fund = fundCode ? findFundByCode(funds, fundCode) || null : null;

    // Update parent components with selected fund and parameters
    onChange(fundCode);
    onFundChange(fund);

    if (fund && onParametersChange) {
      const params = getCurrentParameters(fund);
      onParametersChange(params);
    } else if (onParametersChange) {
      onParametersChange(null);
    }
  }, [funds, findFundByCode, getCurrentParameters, onChange, onFundChange, onParametersChange]);

  /**
   * Effect to sync external value changes with fund data
   * Ensures component state stays consistent with external updates
   */
  useEffect(() => {
    if (selectedFund && onParametersChange) {
      const params = getCurrentParameters(selectedFund);
      onParametersChange(params);
    }
  }, [selectedFund, getCurrentParameters, onParametersChange]);

  /**
   * Error state rendering
   * Provides accessible error feedback
   */
  if (loadError) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Cassa Professionale
          <Tooltip content={professionalFundInfo}>
            <InformationCircleIcon className="ml-1 inline h-4 w-4 text-gray-400" />
          </Tooltip>
        </label>
        <div
          className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg"
          role="alert"
          aria-live="polite"
        >
          <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" aria-hidden="true" />
          <span className="text-sm text-red-700">
            Errore nel caricamento delle casse professionali. Riprova più tardi.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label with tooltip */}
      <label htmlFor={selectId} className="block text-sm font-medium text-gray-700">
        Cassa Professionale
        <Tooltip content={professionalFundInfo}>
          <InformationCircleIcon className="ml-1 inline h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
        </Tooltip>
      </label>

      {/* Select field container */}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={handleFundSelection}
          disabled={disabled || isLoading}
          aria-label={ariaLabel}
          aria-describedby={combinedAriaDescribedBy}
          aria-invalid={Boolean(error)}
          className={`
            w-full rounded-lg border px-3 py-2.5 pr-10 
            bg-white text-gray-900 shadow-sm
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-offset-2
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
            ${isLoading ? 'animate-pulse' : ''}
            
            /* Mobile optimizations */
            text-base /* Prevents zoom on iOS */
            sm:text-sm /* Smaller text on larger screens */
            
            /* Enhanced accessibility */
            appearance-none /* Remove default browser styling */
          `}
        >
          <option value="" disabled={Boolean(value)}>
            {isLoading ? 'Caricamento...' : 'Seleziona una cassa professionale'}
          </option>
          {funds.map((fund) => (
            <option key={fund.id} value={fund.code}>
              {fund.name}
              {fund.description && ` - ${fund.description}`}
            </option>
          ))}
        </select>

        {/* Custom dropdown icon */}
        <ChevronDownIcon
          className={`
            absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 
            text-gray-400 pointer-events-none transition-transform duration-200
            ${disabled || isLoading ? 'opacity-50' : ''}
          `}
          aria-hidden="true"
        />

        {/* Loading indicator overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div
          id={errorId}
          className="flex items-center mt-2 text-sm text-red-600"
          role="alert"
          aria-live="polite"
        >
          <ExclamationCircleIcon className="h-4 w-4 mr-1 flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* Current parameters display */}
      {selectedFund && currentParameters && (
        <div
          id={parametersId}
          className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          role="region"
          aria-label="Parametri contributivi correnti"
        >
          <h4 className="font-medium text-blue-900 mb-3 flex items-center">
            <InformationCircleIcon className="h-4 w-4 mr-1" aria-hidden="true" />
            Parametri contributivi {currentParameters.year}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            <div className="space-y-1">
              <span className="font-medium text-blue-800">Aliquota contributiva:</span>
              <div className="text-blue-900">{currentParameters.contributionRate}%</div>
            </div>

            <div className="space-y-1">
              <span className="font-medium text-blue-800">Contributo minimo:</span>
              <div className="text-blue-900">
                €{currentParameters.minimumContribution.toLocaleString('it-IT')}
              </div>
            </div>

            {currentParameters.fixedAnnualContributions > 0 && (
              <div className="space-y-1">
                <span className="font-medium text-blue-800">Contributi fissi annui:</span>
                <div className="text-blue-900">
                  €{currentParameters.fixedAnnualContributions.toLocaleString('it-IT')}
                </div>
              </div>
            )}
          </div>

          {selectedFund.allowManualEdit && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
              <InformationCircleIcon className="h-3 w-3 inline mr-1" aria-hidden="true" />
              Questa cassa consente la modifica manuale dei parametri contributivi
            </div>
          )}
        </div>
      )}
    </div>
  );
});

ProfessionalFundSelector.displayName = 'ProfessionalFundSelector';

export default ProfessionalFundSelector;
