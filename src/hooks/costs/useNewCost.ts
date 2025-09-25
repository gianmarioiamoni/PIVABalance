import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCostData, costService } from "@/services/costService";

interface UseNewCostProps {
  selectedYear: number;
  onSuccess: () => void;
}

export const useNewCost = ({ selectedYear, onSuccess }: UseNewCostProps) => {
  const [showNewCostForm, setShowNewCostForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const [newCost, setNewCost] = useState<Partial<CreateCostData>>({
    description: "",
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    deductible: true,
  });

  const createCostMutation = useMutation({
    mutationFn: (data: CreateCostData) => costService.createCost(data),
    onSuccess: () => {
      // Invalidate all cost queries to refresh the list
      queryClient.invalidateQueries({ 
        queryKey: ["costs"],
        exact: false // This will match all queries that start with "costs"
      });
      resetForm();
      onSuccess();
      setError(null);
    },
    onError: (err: unknown) => {
      const errorMessage =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data &&
        typeof err.response.data.message === "string"
          ? err.response.data.message
          : "Errore nella creazione del costo";

      setError(errorMessage);
      console.error("Error creating cost:", err);
    },
  });

  const handleCreateCost = async () => {
    // Validation
    if (!newCost.description?.trim()) {
      setError("La descrizione è obbligatoria");
      return;
    }
    if (!newCost.date) {
      setError("La data è obbligatoria");
      return;
    }
    if (!newCost.amount || newCost.amount <= 0) {
      setError("Inserire un importo valido maggiore di 0");
      return;
    }

    const costData: CreateCostData = {
      description: newCost.description || "",
      date: new Date(newCost.date).toISOString(),
      amount: Number(newCost.amount || 0),
      deductible: newCost.deductible ?? true,
    };

    createCostMutation.mutate(costData);
  };

  const resetForm = () => {
    setNewCost({
      description: "",
      date: new Date().toISOString().split("T")[0],
      amount: 0,
      deductible: true,
    });
    setError(null);
  };

  return {
    showNewCostForm,
    setShowNewCostForm,
    loading: createCostMutation.isPending,
    error,
    newCost,
    setNewCost,
    handleCreateCost,
    resetForm,
  };
};
