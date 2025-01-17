'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useTaxSettings } from '@/hooks/useTaxSettings';
import { useInvoices } from '@/hooks/invoices/useInvoices';
import { useNewInvoice } from '@/hooks/invoices/useNewInvoice';
import ConfirmDialog from './ConfirmDialog';
import { LoadingSpinner } from './invoices/LoadingSpinner';
import { InvoiceHeader } from './invoices/InvoiceHeader';
import { NewInvoiceForm } from './invoices/NewInvoiceForm';
import { InvoiceList } from './invoices/InvoiceList';

export default function Invoices() {
  const { user } = useAuth();
  const { state: taxState } = useTaxSettings();
  const [selectedYear, setSelectedYear] = useState(2025);
  const [deleteInvoiceId, setDeleteInvoiceId] = useState<string | null>(null);

  // Generate available years starting from 2025
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from(
    { length: currentYear - 2024 },
    (_, i) => 2025 + i
  );

  const {
    invoices,
    loading,
    error,
    handleUpdatePaymentDate,
    handleDeleteInvoice,
    refreshInvoices
  } = useInvoices(selectedYear, taxState.settings?.taxRegime);

  const {
    showNewInvoiceForm,
    setShowNewInvoiceForm,
    newInvoice,
    setNewInvoice,
    handleCreateInvoice,
    handleVatChange,
    resetForm
  } = useNewInvoice({
    selectedYear,
    taxRegime: taxState.settings?.taxRegime,
    userId: user?.id || '',
    onSuccess: () => {
      setShowNewInvoiceForm(false);
      refreshInvoices();
    }
  });

  if (loading && !invoices.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <InvoiceHeader
        selectedYear={selectedYear}
        availableYears={availableYears}
        onYearChange={setSelectedYear}
        onNewInvoiceClick={() => setShowNewInvoiceForm(true)}
      />

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {showNewInvoiceForm && (
        <NewInvoiceForm
          newInvoice={newInvoice}
          setNewInvoice={setNewInvoice}
          handleCreateInvoice={handleCreateInvoice}
          handleVatChange={handleVatChange}
          showTaxRegime={taxState.settings?.taxRegime === 'ordinario'}
        />
      )}

      <InvoiceList
        invoices={invoices}
        onUpdatePaymentDate={handleUpdatePaymentDate}
        onDeleteClick={setDeleteInvoiceId}
      />

      <ConfirmDialog
        isOpen={!!deleteInvoiceId}
        title="Elimina fattura"
        message="Sei sicuro di voler eliminare questa fattura?"
        confirmLabel="Elimina"
        cancelLabel="Annulla"
        onConfirm={() => {
          if (deleteInvoiceId) {
            handleDeleteInvoice(deleteInvoiceId);
            setDeleteInvoiceId(null);
          }
        }}
        onCancel={() => setDeleteInvoiceId(null)}
      />
    </div>
  );
}
