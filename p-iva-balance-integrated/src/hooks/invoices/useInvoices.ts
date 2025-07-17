/**
 * Custom hook for managing invoices list
 * Handles fetching, updating, and deleting invoices with React Query
 */

import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IInvoice } from "@/types";

// Mock API functions - these will be replaced with actual API calls
const mockInvoiceService = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getInvoices(_year: number, _regime?: string): Promise<IInvoice[]> {
    // This will be replaced with actual API call
    return [];
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async updatePaymentDate(_invoiceId: string, _date: Date): Promise<IInvoice> {
    // This will be replaced with actual API call
    throw new Error("Not implemented");
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async deleteInvoice(_invoiceId: string): Promise<void> {
    // This will be replaced with actual API call
    throw new Error("Not implemented");
  },
};

export interface UseInvoicesProps {
  selectedYear: number;
  taxRegime?: string;
  userId?: string;
}

export interface UseInvoicesReturn {
  invoices: IInvoice[];
  isLoading: boolean;
  error: string | null;
  handleUpdatePaymentDate: (invoiceId: string, date: Date) => Promise<void>;
  handleDeleteInvoice: (invoiceId: string) => Promise<void>;
  refreshInvoices: () => Promise<void>;
}

export const useInvoices = ({
  selectedYear,
  taxRegime,
  userId,
}: UseInvoicesProps): UseInvoicesReturn => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Query key for React Query
  const queryKey = ["invoices", selectedYear, taxRegime, userId];

  // Fetch invoices query
  const {
    data: invoices = [],
    isLoading,
    refetch,
    error: queryError,
  } = useQuery({
    queryKey,
    queryFn: () => mockInvoiceService.getInvoices(selectedYear, taxRegime),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Handle query errors
  useEffect(() => {
    if (queryError) {
      const errorMessage =
        queryError instanceof Error
          ? queryError.message
          : "Errore nel caricamento delle fatture";
      setError(errorMessage);
    }
  }, [queryError]);

  // Update payment date mutation
  const updatePaymentMutation = useMutation({
    mutationFn: ({ invoiceId, date }: { invoiceId: string; date: Date }) =>
      mockInvoiceService.updatePaymentDate(invoiceId, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setError(null);
    },
    onError: (err: unknown) => {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Errore nell'aggiornamento della data di pagamento";
      setError(errorMessage);
    },
  });

  // Delete invoice mutation
  const deleteMutation = useMutation({
    mutationFn: (invoiceId: string) =>
      mockInvoiceService.deleteInvoice(invoiceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setError(null);
    },
    onError: (err: unknown) => {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Errore nell'eliminazione della fattura";
      setError(errorMessage);
    },
  });

  // Handler functions
  const handleUpdatePaymentDate = useCallback(
    async (invoiceId: string, date: Date) => {
      try {
        await updatePaymentMutation.mutateAsync({ invoiceId, date });
      } catch (error) {
        // Error is handled in onError callback
        throw error;
      }
    },
    [updatePaymentMutation]
  );

  const handleDeleteInvoice = useCallback(
    async (invoiceId: string) => {
      try {
        await deleteMutation.mutateAsync(invoiceId);
      } catch (error) {
        // Error is handled in onError callback
        throw error;
      }
    },
    [deleteMutation]
  );

  const refreshInvoices = useCallback(async () => {
    try {
      await refetch();
      setError(null);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Errore nel ricaricamento delle fatture";
      setError(errorMessage);
    }
  }, [refetch]);

  return {
    invoices,
    isLoading,
    error,
    handleUpdatePaymentDate,
    handleDeleteInvoice,
    refreshInvoices,
  };
};
