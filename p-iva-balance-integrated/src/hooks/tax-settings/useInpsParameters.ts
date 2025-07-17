import { useEffect } from "react";
import useSWR from "swr";
import { InpsParameters, inpsService } from "@/services/inpsService";

/**
 * Hook for managing INPS parameters fetching and state
 *
 * Follows Single Responsibility Principle - only handles INPS parameters concerns.
 * Uses SWR for optimized data fetching with caching and revalidation.
 * Provides loading states, error handling, and parameter data management.
 *
 * @param onDefaultSelection - Callback when default rate should be applied
 * @returns Object with parameters state and loading/error states
 */
export const useInpsParameters = (
  onDefaultSelection?: (
    type: string,
    rate: number,
    minContribution: number
  ) => void
) => {
  // Use SWR for data fetching with automatic caching and revalidation
  const {
    data: parameters,
    error,
    isLoading: loading,
    mutate: retry,
  } = useSWR<InpsParameters>(
    'inps-parameters',
    () => inpsService.getCurrentParameters(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes cache
      errorRetryCount: 3,
    }
  );

  // Apply default selection when parameters are loaded
  useEffect(() => {
    if (parameters && onDefaultSelection) {
      const defaultRate = inpsService.getDefaultRate();
      onDefaultSelection(
        defaultRate.type,
        defaultRate.rate,
        parameters.minContributions[defaultRate.type] || 0
      );
    }
  }, [parameters, onDefaultSelection]);

  return {
    parameters: parameters || null,
    loading,
    error: error ? "Errore nel caricamento dei parametri INPS" : null,
    retry,
  };
};
