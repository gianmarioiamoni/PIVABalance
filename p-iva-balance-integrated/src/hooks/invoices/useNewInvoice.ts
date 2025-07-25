/**
 * Custom hook for managing new invoice creation
 * Handles form state, validation, and submission with React Query
 */

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { IInvoice } from "@/types";
import { VatOption, vatOptions } from "@/components/invoices/NewInvoiceForm";
import { invoiceService, CreateInvoiceData } from "@/services/invoiceService";

export interface UseNewInvoiceProps {
  selectedYear: number;
  taxRegime?: string;
  userId: string;
  onSuccess?: () => void;
}

export interface UseNewInvoiceReturn {
  showNewInvoiceForm: boolean;
  setShowNewInvoiceForm: (show: boolean) => void;
  newInvoice: Partial<IInvoice>;
  setNewInvoice: (invoice: Partial<IInvoice>) => void;
  handleCreateInvoice: (e: React.FormEvent) => Promise<void>;
  handleVatChange: (type: VatOption["type"]) => void;
  resetForm: () => void;
  isLoading: boolean;
  error: string | null;
}

export const useNewInvoice = ({
  selectedYear,
  taxRegime,
  userId,
  onSuccess,
}: UseNewInvoiceProps): UseNewInvoiceReturn => {
  const [showNewInvoiceForm, setShowNewInvoiceForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial form state
  const getInitialFormState = useCallback(
    (): Partial<IInvoice> => ({
      fiscalYear: selectedYear,
      issueDate: new Date(),
      vat:
        taxRegime === "ordinario"
          ? { vatType: "standard", vatRate: 22 }
          : undefined,
    }),
    [selectedYear, taxRegime]
  );

  const [newInvoice, setNewInvoice] = useState<Partial<IInvoice>>(
    getInitialFormState()
  );

  // Create invoice mutation
  const createMutation = useMutation({
    mutationFn: async (invoice: Partial<IInvoice>) => {
      // Transform IInvoice to CreateInvoiceData format
      const createData: CreateInvoiceData = {
        number: invoice.number || "",
        issueDate: invoice.issueDate
          ? invoice.issueDate.toISOString()
          : new Date().toISOString(),
        title: invoice.title || "",
        clientName: invoice.clientName || "",
        amount: invoice.amount || 0,
        paymentDate: invoice.paymentDate
          ? invoice.paymentDate.toISOString()
          : undefined,
        fiscalYear: invoice.fiscalYear || new Date().getFullYear(),
        vat: invoice.vat
          ? {
              type: invoice.vat.vatType as
                | "standard"
                | "reduced10"
                | "reduced5"
                | "reduced4"
                | "custom",
              rate: invoice.vat.vatRate,
            }
          : undefined,
      };

      return await invoiceService.createInvoice(createData);
    },
    onSuccess: () => {
      setError(null);
      resetForm();
      onSuccess?.();
    },
    onError: (err: unknown) => {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Errore nella creazione della fattura";
      setError(errorMessage);
    },
  });

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setNewInvoice(getInitialFormState());
    setShowNewInvoiceForm(false);
    setError(null);
  }, [getInitialFormState]);

  // Handle VAT type change
  const handleVatChange = useCallback((type: VatOption["type"]) => {
    const selectedOption = vatOptions.find((option) => option.type === type);

    if (selectedOption) {
      setNewInvoice((prev) => ({
        ...prev,
        vat: {
          vatType: selectedOption.type,
          vatRate: selectedOption.rate,
        },
      }));
    }
  }, []);

  // Validate invoice data
  const validateInvoice = (invoice: Partial<IInvoice>): string[] => {
    const errors: string[] = [];

    if (!invoice.number?.trim()) {
      errors.push("Numero fattura è obbligatorio");
    }

    if (!invoice.title?.trim()) {
      errors.push("Titolo è obbligatorio");
    }

    if (!invoice.clientName?.trim()) {
      errors.push("Nome cliente è obbligatorio");
    }

    if (!invoice.amount || invoice.amount <= 0) {
      errors.push("Importo deve essere maggiore di 0");
    }

    if (!invoice.issueDate) {
      errors.push("Data emissione è obbligatoria");
    }

    return errors;
  };

  // Handle form submission
  const handleCreateInvoice = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!userId) {
        setError("User ID non valido");
        return;
      }

      // Validate form data
      const validationErrors = validateInvoice(newInvoice);
      if (validationErrors.length > 0) {
        setError(validationErrors[0]);
        return;
      }

      // Prepare invoice data
      const invoiceData: Partial<IInvoice> = {
        ...newInvoice,
        userId,
        fiscalYear: selectedYear,
        // Ensure dates are properly formatted
        issueDate: newInvoice.issueDate,
        paymentDate: newInvoice.paymentDate,
      };

      try {
        await createMutation.mutateAsync(invoiceData);
      } catch (_error) {
        // Error is handled in onError callback
      }
    },
    [newInvoice, userId, selectedYear, createMutation]
  );

  return {
    showNewInvoiceForm,
    setShowNewInvoiceForm,
    newInvoice,
    setNewInvoice,
    handleCreateInvoice,
    handleVatChange,
    resetForm,
    isLoading: createMutation.isPending,
    error,
  };
};

// Export VAT options for use in components
export { vatOptions };
