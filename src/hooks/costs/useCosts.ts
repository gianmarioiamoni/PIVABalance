import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Cost, costService } from "@/services/costService";

export const useCosts = (selectedYear: number) => {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    data: costs = [],
    isLoading: loading,
    error: queryError,
    refetch: refetchCosts,
  } = useQuery({
    queryKey: ["costs", selectedYear],
    queryFn: () => costService.getCostsByYear(selectedYear),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const updateCostMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Omit<Cost, "id" | "createdAt" | "updatedAt">;
    }) => costService.updateCost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["costs"],
        exact: false
      });
      setError(null);
    },
    onError: (err: unknown) => {
      setError("Errore nell&apos;aggiornamento del costo");
      console.error("Error updating cost:", err);
    },
  });

  const deleteCostMutation = useMutation({
    mutationFn: (id: string) => costService.deleteCost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["costs"],
        exact: false
      });
      setError(null);
    },
    onError: (err: unknown) => {
      setError("Errore nella cancellazione del costo");
      console.error("Error deleting cost:", err);
    },
  });

  const handleUpdateCost = async (
    id: string,
    data: Omit<Cost, "id" | "createdAt" | "updatedAt">
  ) => {
    updateCostMutation.mutate({ id, data });
  };

  const handleDeleteCost = async (id: string) => {
    deleteCostMutation.mutate(id);
  };

  const refreshCosts = async () => {
    try {
      // Force refetch this specific query
      await refetchCosts();
      // Also invalidate all other cost-related queries
      await queryClient.invalidateQueries({ 
        queryKey: ["costs"],
        exact: false // This will match all queries that start with "costs"
      });
    } catch (error) {
      console.error("Error refreshing costs:", error);
    }
  };

  // Set error from query if it exists
  useEffect(() => {
    if (queryError) {
      setError("Errore nel caricamento dei costi");
      console.error("Query error:", queryError);
    }
  }, [queryError]);

  // Calculate totals
  const deductibleCosts = costs.filter((cost) => cost.deductible);
  const nonDeductibleCosts = costs.filter((cost) => !cost.deductible);
  const totalDeductibleCosts = deductibleCosts.reduce(
    (sum, cost) => sum + cost.amount,
    0
  );
  const totalNonDeductibleCosts = nonDeductibleCosts.reduce(
    (sum, cost) => sum + cost.amount,
    0
  );

  return {
    costs,
    deductibleCosts,
    nonDeductibleCosts,
    totalDeductibleCosts,
    totalNonDeductibleCosts,
    loading:
      loading || updateCostMutation.isPending || deleteCostMutation.isPending,
    error,
    handleUpdateCost,
    handleDeleteCost,
    refreshCosts,
  };
};
