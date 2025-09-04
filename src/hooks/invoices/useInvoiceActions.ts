import { useState } from "react";

interface UseInvoiceActionsProps {
  onYearChange?: (year: number) => void;
  onFormReset?: () => void;
  onDeleteSuccess?: () => void;
}

interface UseInvoiceActionsReturn {
  selectedYear: number;
  deleteInvoiceId: string | null;
  showNewInvoiceForm: boolean;
  handleYearChange: (year: number) => void;
  handleNewInvoiceToggle: () => void;
  setShowNewInvoiceForm: (show: boolean) => void;
  handleDeleteClick: (invoiceId: string) => void;
  handleDeleteConfirm: (
    deleteFunction: (id: string) => Promise<void>
  ) => Promise<void>;
  handleDeleteCancel: () => void;
}

/**
 * Custom hook for managing invoice component actions
 * Follows SRP by handling only action-related logic
 * Separates business logic from UI components
 */
export const useInvoiceActions = ({
  onYearChange,
  onFormReset,
  onDeleteSuccess,
}: UseInvoiceActionsProps = {}): UseInvoiceActionsReturn => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [deleteInvoiceId, setDeleteInvoiceId] = useState<string | null>(null);
  const [showNewInvoiceForm, setShowNewInvoiceForm] = useState(false);

  /**
   * Handle year change with callback notification
   */
  const handleYearChange = (year: number): void => {
    setSelectedYear(year);
    onYearChange?.(year);

    // Reset form if open when year changes
    if (showNewInvoiceForm) {
      onFormReset?.();
    }
  };

  /**
   * Handle new invoice form toggle
   */
  const handleNewInvoiceToggle = (): void => {
    if (showNewInvoiceForm) {
      onFormReset?.();
      setShowNewInvoiceForm(false);
    } else {
      setShowNewInvoiceForm(true);
    }
  };

  /**
   * Handle delete invoice click
   */
  const handleDeleteClick = (invoiceId: string): void => {
    setDeleteInvoiceId(invoiceId);
  };

  /**
   * Handle delete confirmation with error handling
   */
  const handleDeleteConfirm = async (
    deleteFunction: (id: string) => Promise<void>
  ): Promise<void> => {
    if (!deleteInvoiceId) return;

    try {
      await deleteFunction(deleteInvoiceId);
      setDeleteInvoiceId(null);
      onDeleteSuccess?.();
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      // Keep modal open on error so user can retry
      throw error;
    }
  };

  /**
   * Handle delete cancel
   */
  const handleDeleteCancel = (): void => {
    setDeleteInvoiceId(null);
  };

  return {
    selectedYear,
    deleteInvoiceId,
    showNewInvoiceForm,
    handleYearChange,
    handleNewInvoiceToggle,
    setShowNewInvoiceForm,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
  };
};
