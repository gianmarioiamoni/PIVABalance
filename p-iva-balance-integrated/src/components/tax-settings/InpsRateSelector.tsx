import React, { useCallback } from 'react';
import { InpsRate } from '@/services/inpsService';
import { useInpsParameters } from '@/hooks/tax-settings';
import { FormLoadingState, ErrorDisplay } from '@/components/ui';
import { InpsRateList } from './InpsRateList';

/**
 * Props for InpsRateSelector component
 * Following Interface Segregation Principle
 */
interface InpsRateSelectorProps {
  value?: string;
  onChange: (type: string, rate: number, minContribution: number) => void;
  className?: string;
}

/**
 * INPS Rate Selector Component
 * 
 * Refactored to follow SOLID principles:
 * - Single Responsibility: Orchestrates INPS rate selection UI composition
 * - Open/Closed: Extensible through props and composition
 * - Dependency Inversion: Depends on abstractions (hooks, components)
 * 
 * Features:
 * - WCAG accessibility compliance with semantic radio groups
 * - Keyboard navigation (arrow keys, home/end)
 * - Screen reader support with proper ARIA attributes
 * - Loading and error states with consistent UI
 * - Automatic default selection
 * - Reusable components for consistent styling
 * 
 * @param value - Currently selected rate type
 * @param onChange - Callback when rate selection changes
 * @param className - Additional CSS classes
 */
export const InpsRateSelector: React.FC<InpsRateSelectorProps> = ({
  value,
  onChange,
  className = ""
}) => {
  // Handle default selection when no value is provided
  const handleDefaultSelection = useCallback((type: string, rate: number, minContribution: number) => {
    if (!value) {
      onChange(type, rate, minContribution);
    }
  }, [value, onChange]);

  // INPS parameters hook with loading and error states
  const { parameters, loading, error } = useInpsParameters(handleDefaultSelection);

  // Handle rate selection
  const handleRateSelect = useCallback((rate: InpsRate) => {
    if (parameters) {
      onChange(
        rate.type,
        rate.rate,
        parameters.minContributions[rate.type] || 0
      );
    }
  }, [parameters, onChange]);

  /**
   * Loading state rendering
   * Using reusable FormLoadingState component
   */
  if (loading) {
    return (
      <FormLoadingState
        message="Caricamento parametri INPS..."
        minHeight="min-h-[100px]"
        className={className}
      />
    );
  }

  /**
   * Error state rendering
   * Using reusable ErrorDisplay component
   */
  if (error || !parameters) {
    return (
      <ErrorDisplay
        message={error || 'Errore nel caricamento dei parametri INPS'}
        className={className}
      />
    );
  }

  /**
   * Main component rendering
   * Using extracted InpsRateList component for accessibility and modularity
   */
  return (
    <div className={className}>
      <InpsRateList
        parameters={parameters}
        selectedValue={value}
        onRateSelect={handleRateSelect}
      />
    </div>
  );
};
