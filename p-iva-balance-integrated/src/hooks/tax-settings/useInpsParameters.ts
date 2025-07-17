import { useState, useEffect } from "react";
import { InpsParameters, inpsService } from "@/services/inpsService";

/**
 * Hook for managing INPS parameters fetching and state
 *
 * Follows Single Responsibility Principle - only handles INPS parameters concerns.
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
  const [parameters, setParameters] = useState<InpsParameters | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadParameters = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = await inpsService.getCurrentParameters();
        setParameters(params);

        // Apply default rate if callback provided and no existing selection
        if (onDefaultSelection) {
          const defaultRate = inpsService.getDefaultRate();
          onDefaultSelection(
            defaultRate.type,
            defaultRate.rate,
            params.minContributions[defaultRate.type] || 0
          );
        }
      } catch (err) {
        const errorMessage = "Errore nel caricamento dei parametri INPS";
        setError(errorMessage);
        console.error("INPS parameters loading error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadParameters();
  }, [onDefaultSelection]);

  return {
    parameters,
    loading,
    error,
    retry: () => {
      setError(null);
      setLoading(true);
      // Re-trigger useEffect by changing state
    },
  };
};
