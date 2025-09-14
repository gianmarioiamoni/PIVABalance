import { useCallback, useMemo } from "react";
import {
  useProfessionalFunds,
  useProfessionalFundUtils,
} from "@/hooks/useProfessionalFunds";
import {
  ProfessionalFund,
  ProfessionalFundParameters,
} from "@/services/professionalFundService";

/**
 * Props for useProfessionalFundSelection hook
 */
interface UseProfessionalFundSelectionProps {
  value?: string;
  onChange: (fundId: string) => void;
  onFundChange: (fund: ProfessionalFund | null) => void;
  onParametersChange?: (params: ProfessionalFundParameters | null) => void;
}

/**
 * Hook for managing professional fund selection and parameters
 *
 * Follows Single Responsibility Principle - only handles fund selection logic.
 * Provides fund data, selection handling, and parameter management.
 *
 * @param props - Configuration for fund selection
 * @returns Object with fund data, selection handlers, and computed states
 */
export const useProfessionalFundSelection = ({
  value = "",
  onChange,
  onFundChange,
  onParametersChange,
}: UseProfessionalFundSelectionProps) => {
  const {
    data: funds = [],
    isLoading,
    error: loadError,
  } = useProfessionalFunds();
  const { findFundByCode, getCurrentParameters } = useProfessionalFundUtils();

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

  /**
   * Handle fund selection with proper callbacks
   * Uses useCallback to prevent unnecessary re-renders
   */
  const handleFundSelection = useCallback(
    (fundCode: string) => {
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
    },
    [
      funds,
      findFundByCode,
      getCurrentParameters,
      onChange,
      onFundChange,
      onParametersChange,
    ]
  );

  // Note: useEffect was removed to prevent infinite loops

  return {
    // Data
    funds,
    selectedFund,
    currentParameters,

    // States
    isLoading,
    loadError,

    // Handlers
    handleFundSelection,
  };
};
