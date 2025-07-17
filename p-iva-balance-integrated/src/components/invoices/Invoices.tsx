'use client';

import { useAuth } from '@/hooks/auth/useAuth';
import { useInvoices, useNewInvoice, useInvoiceActions } from '@/hooks/invoices';
import { ConfirmDialog, LoadingSpinner, ErrorDisplay } from '@/components/ui';
import { InvoiceHeader, InvoiceList, NewInvoiceForm, TaxRegimeInfo } from '@/components/invoices';
import { generateAvailableYearsFromYear } from '@/utils/costSummaryCalculations';

/**
 * Main Invoices Component
 * Manages invoice list, creation, and year filtering
 */

export interface InvoicesProps {
  taxRegime?: string;
}

export const Invoices = ({ taxRegime }: InvoicesProps) => {
  const { user } = useAuth();

  // Generate available years starting from 2020
  const availableYears = generateAvailableYearsFromYear(2020);

  // Invoice actions hook
  const {
    selectedYear,
    deleteInvoiceId,
    showNewInvoiceForm,
    handleYearChange,
    handleNewInvoiceToggle,
    setShowNewInvoiceForm,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel
  } = useInvoiceActions({
    onFormReset: () => {
      // Will be connected to resetForm from useNewInvoice
    },
    onDeleteSuccess: () => {
      refreshInvoices();
    }
  });

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
    userId: user?.id
  });

  const {
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
    userId: user?.id || '',
    onSuccess: () => {
      setShowNewInvoiceForm(false);
      refreshInvoices();
    }
  });

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
        <ErrorDisplay
          message={invoicesError || createError}
          className="mb-6"
        />

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
          onDeleteClick={handleDeleteClick}
          isLoading={invoicesLoading}
        />

        {/* Tax Regime Info */}
        <TaxRegimeInfo
          taxRegime={taxRegime || ''}
          invoiceCount={invoices.length}
          isLoading={invoicesLoading}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteInvoiceId}
        title="Elimina fattura"
        message="Sei sicuro di voler eliminare questa fattura? Questa azione non può essere annullata."
        confirmLabel="Elimina"
        cancelLabel="Annulla"
        type="danger"
        onConfirm={() => handleDeleteConfirm(handleDeleteInvoice)}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default Invoices; 