import { useState } from "react";
import { costService, CreateCostData } from "@/services/costService";

interface UseCostFormOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface UseCostFormReturn {
  showForm: boolean;
  loading: boolean;
  error: string | null;
  openForm: () => void;
  closeForm: () => void;
  submitForm: (costData: CreateCostData) => Promise<void>;
}

/**
 * Custom hook for managing cost form state and operations
 * Follows SRP by handling only form-related logic
 * Uses functional programming principles for state management
 */
export const useCostForm = (
  options: UseCostFormOptions = {}
): UseCostFormReturn => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openForm = (): void => {
    setShowForm(true);
    setError(null);
  };

  const closeForm = (): void => {
    setShowForm(false);
    setError(null);
  };

  const submitForm = async (costData: CreateCostData): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await costService.createCost(costData);

      setShowForm(false);
      options.onSuccess?.();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Errore nella creazione del costo";

      setError(errorMessage);
      options.onError?.(errorMessage);
      console.error("Error creating cost:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    showForm,
    loading,
    error,
    openForm,
    closeForm,
    submitForm,
  };
};
