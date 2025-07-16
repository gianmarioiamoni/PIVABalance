'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useInvoices, useNewInvoice } from '@/hooks/invoices';
import { ConfirmDialog, LoadingSpinner } from '@/components/ui';
import { InvoiceHeader, InvoiceList, NewInvoiceForm } from '@/components/invoices';

/**
 * Main Invoices Component
 * Manages invoice list, creation, and year filtering
 */

export interface InvoicesProps {
  taxRegime?: string;
}

export const Invoices = ({ taxRegime }: InvoicesProps) => {
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [deleteInvoiceId, setDeleteInvoiceId] = useState<string | null>(null);

  // Generate available years starting from 2020
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from(
    { length: currentYear - 2019 },
    (_, i) => 2020 + i
  ).reverse(); // Most recent first

  // Hooks for invoice management
  const {
    invoices,
    isLoading: invoicesLoading,
    error: invoicesError,
    handleUpdatePaymentDate,
    handleDeleteInvoice,
    refreshInvoices
  } = useInvoices({
    selectedYear,
    taxRegime,
    userId: user?._id
  });

  const {
    showNewInvoiceForm,
    setShowNewInvoiceForm,
    newInvoice,
    setNewInvoice,
    handleCreateInvoice,
    handleVatChange,
    resetForm,
    isLoading: createLoading,
    error: createError
  } = useNewInvoice({
    selectedYear,
    taxRegime,
    userId: user?._id || '',
    onSuccess: () => {
      setShowNewInvoiceForm(false);
      refreshInvoices();
    }
  });

  /**
   * Handle year change
   */
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    // Reset form if open
    if (showNewInvoiceForm) {
      resetForm();
    }
  };

  /**
   * Handle new invoice form toggle
   */
  const handleNewInvoiceToggle = () => {
    if (showNewInvoiceForm) {
      resetForm();
    } else {
      setShowNewInvoiceForm(true);
    }
  };

  /**
   * Handle delete confirmation
   */
  const handleDeleteConfirm = async () => {
    if (deleteInvoiceId) {
      try {
        await handleDeleteInvoice(deleteInvoiceId);
        setDeleteInvoiceId(null);
      } catch (error) {
        console.error('Failed to delete invoice:', error);
      }
    }
  };

  // Show loading spinner while fetching user data
  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        {/* Header */}
        <InvoiceHeader
          selectedYear={selectedYear}
          availableYears={availableYears}
          onYearChange={handleYearChange}
          onNewInvoiceClick={handleNewInvoiceToggle}
          totalInvoices={invoices.length}
        />

        {/* Error Messages */}
        {(invoicesError || createError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            <h4 className="font-medium">Si è verificato un errore</h4>
            <p className="text-sm mt-1">
              {invoicesError || createError}
            </p>
          </div>
        )}

        {/* New Invoice Form */}
        {showNewInvoiceForm && (
          <NewInvoiceForm
            newInvoice={newInvoice}
            setNewInvoice={setNewInvoice}
            handleCreateInvoice={handleCreateInvoice}
            handleVatChange={handleVatChange}
            showTaxRegime={taxRegime === 'ordinario'}
            onCancel={() => resetForm()}
            isLoading={createLoading}
          />
        )}

        {/* Invoice List */}
        <InvoiceList
          invoices={invoices}
          onUpdatePaymentDate={handleUpdatePaymentDate}
          onDeleteClick={setDeleteInvoiceId}
          isLoading={invoicesLoading}
        />

        {/* Tax Regime Info */}
        {taxRegime === 'forfettario' && invoices.length === 0 && !invoicesLoading && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Regime Forfettario
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Con il regime forfettario non è necessario applicare l'IVA alle fatture.
                    Le fatture saranno automaticamente gestite secondo le normative del regime forfettario.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteInvoiceId}
        title="Elimina fattura"
        message="Sei sicuro di voler eliminare questa fattura? Questa azione non può essere annullata."
        confirmLabel="Elimina"
        cancelLabel="Annulla"
        type="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteInvoiceId(null)}
      />
    </div>
  );
};

export default Invoices; 