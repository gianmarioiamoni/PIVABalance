'use client';

import React from 'react';
import { useProfessionalFundSelection } from '@/hooks/tax-settings';
import { FieldLabel, SelectField, ErrorDisplay } from '@/components/ui';
import { ProfessionalFundParameters } from './ProfessionalFundParameters';
import { ProfessionalFund, ProfessionalFundParameters as IProfessionalFundParameters } from '@/services/professionalFundService';
import { professionalFundInfo } from '@/components/tooltips/TooltipsText';

/**
 * Props for ProfessionalFundSelector component
 * Following Interface Segregation Principle - only required props
 */
interface ProfessionalFundSelectorProps {
  value?: string;
  onChange: (fundId: string) => void;
  onFundChange: (fund: ProfessionalFund | null) => void;
  onParametersChange?: (params: IProfessionalFundParameters | null) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

/**
 * Professional Fund Selector Component
 * 
 * Refactored to follow SOLID principles:
 * - Single Responsibility: Orchestrates professional fund selection UI composition
 * - Open/Closed: Extensible through props and composition
 * - Dependency Inversion: Depends on abstractions (hooks, components)
 * 
 * Features:
 * - WCAG accessibility compliance
 * - TypeScript strict typing (zero 'any')
 * - Modern UX with loading states and transitions
 * - Responsive design (mobile-first)
 * - React Query for efficient data fetching
 * - Consistent currency formatting
 * - Modular component architecture
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
  /**
   * Generate unique IDs for accessibility - must be called before any early returns
   * Ensures proper labeling and description relationships
   */
  const componentId = React.useId();
  const selectId = `professional-fund-select-${componentId}`;
  const errorId = error ? `${selectId}-error` : undefined;

  // Professional fund selection hook with all business logic
  const {
    funds,
    selectedFund,
    currentParameters,
    isLoading,
    loadError,
    handleFundSelection
  } = useProfessionalFundSelection({
    value,
    onChange,
    onFundChange,
    onParametersChange
  });

  // Calculate accessibility IDs after currentParameters is available
  const parametersId = currentParameters ? `${selectId}-parameters` : undefined;
  const combinedAriaDescribedBy = [ariaDescribedBy, errorId, parametersId]
    .filter(Boolean)
    .join(' ') || undefined;

  /**
   * Error state rendering
   * Using reusable ErrorDisplay component
   */
  if (loadError) {
    return (
      <div className={`space-y-2 ${className}`}>
        <FieldLabel htmlFor={selectId} tooltip={professionalFundInfo}>
          Cassa Professionale
        </FieldLabel>
        <ErrorDisplay
          message="Errore nel caricamento delle casse professionali. Riprova più tardi."
        />
      </div>
    );
  }

  // Prepare options for SelectField
  const selectOptions = funds.map((fund) => ({
    value: fund.code,
    label: fund.description ? `${fund.name} - ${fund.description}` : fund.name
  }));

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label with tooltip */}
      <FieldLabel
        htmlFor={selectId}
        tooltip={professionalFundInfo}
      >
        Cassa Professionale
      </FieldLabel>

      {/* Select field */}
      <SelectField
        id={selectId}
        value={value}
        onChange={handleFundSelection}
        options={selectOptions}
        placeholder="Seleziona una cassa professionale"
        disabled={disabled}
        loading={isLoading}
        error={error}
        aria-label={ariaLabel}
        aria-describedby={combinedAriaDescribedBy}
      />

      {/* Current parameters display */}
      {selectedFund && currentParameters && (
        <ProfessionalFundParameters
          fund={selectedFund}
          parameters={currentParameters}
          parametersId={parametersId}
        />
      )}
    </div>
  );
});

ProfessionalFundSelector.displayName = 'ProfessionalFundSelector';

export default ProfessionalFundSelector;
