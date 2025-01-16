'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Invoice, invoiceService } from '@/services/invoiceService';
import { UserSettings } from '@/services/settingsService';
import { useTaxSettings } from '@/hooks/useTaxSettings';
import { CalendarIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import ConfirmDialog from './ConfirmDialog';

export default function Invoices() {
  const { user } = useAuth();
  const { state: taxState } = useTaxSettings();
  const [selectedYear, setSelectedYear] = useState(2025);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewInvoiceForm, setShowNewInvoiceForm] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    fiscalYear: selectedYear,
    issueDate: new Date(),
    vat: taxState.settings?.taxRegime === 'ordinario' ? { type: 'standard', rate: 22 } : undefined
  });
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [deleteInvoiceId, setDeleteInvoiceId] = useState<string | null>(null);

  // Generate available years starting from 2025
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from(
    { length: currentYear - 2024 },
    (_, i) => 2025 + i
  );

  const vatOptions = [
    { type: 'standard', label: 'IVA 22%', rate: 22 },
    { type: 'reduced10', label: 'IVA 10%', rate: 10 },
    { type: 'reduced5', label: 'IVA 5%', rate: 5 },
    { type: 'reduced4', label: 'IVA 4%', rate: 4 },
    { type: 'custom', label: 'IVA Personalizzata', rate: 0 }
  ];

  useEffect(() => {
    if (user) {
      loadInvoices();
      setUserSettings(taxState.settings);
      // Reset newInvoice VAT when tax regime changes
      setNewInvoice(prev => ({
        ...prev,
        vat: taxState.settings?.taxRegime === 'ordinario' ? { type: 'standard', rate: 22 } : undefined
      }));
    }
  }, [selectedYear, user, taxState.settings?.taxRegime]);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const data = await invoiceService.getInvoicesByYear(selectedYear);
      // Add default VAT only for old invoices in ordinario regime
      const updatedData = data.map(invoice => ({
        ...invoice,
        vat: taxState.settings?.taxRegime === 'ordinario' ? (invoice.vat || { type: 'standard', rate: 22 }) : undefined
      }));
      setInvoices(updatedData);
      setError(null);
    } catch (err) {
      setError('Errore nel caricamento delle fatture');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const invoiceData = {
        ...newInvoice,
        userId: user.id,
        fiscalYear: selectedYear,
        issueDate: new Date(newInvoice.issueDate!),
        paymentDate: newInvoice.paymentDate ? new Date(newInvoice.paymentDate) : undefined,
        // Include VAT only for ordinario regime
        vat: taxState.settings?.taxRegime === 'ordinario' ? newInvoice.vat : undefined
      } as Omit<Invoice, '_id'>;

      const createdInvoice = await invoiceService.createInvoice(invoiceData);
      setInvoices(prev => [...prev, createdInvoice]);
      setShowNewInvoiceForm(false);
      setNewInvoice({ 
        fiscalYear: selectedYear, 
        issueDate: new Date(),
        vat: taxState.settings?.taxRegime === 'ordinario' ? { type: 'standard', rate: 22 } : undefined
      });
      setError(null);
    } catch (err) {
      setError('Errore nella creazione della fattura');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePaymentDate = async (invoiceId: string, date: Date) => {
    try {
      setLoading(true);
      setError(null);
      await invoiceService.updateInvoice(invoiceId, { paymentDate: date });
      // Refresh invoices
      if (selectedYear) {
        const updatedInvoices = await invoiceService.getInvoicesByYear(selectedYear);
        // Add default VAT for invoices that don't have it
        const updatedData = updatedInvoices.map(invoice => ({
          ...invoice,
          vat: taxState.settings?.taxRegime === 'ordinario' ? (invoice.vat || { type: 'standard', rate: 22 }) : undefined
        }));
        setInvoices(updatedData);
      }
    } catch (error) {
      console.error(error);
      setError('Errore nell\'aggiornamento della data di pagamento');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    try {
      setLoading(true);
      setError(null);
      await invoiceService.deleteInvoice(invoiceId);
      setDeleteInvoiceId(null); // Chiudi il dialog
      // Refresh invoices after deletion
      const updatedInvoices = await invoiceService.getInvoicesByYear(selectedYear);
      // Add default VAT for invoices that don't have it
      const updatedData = updatedInvoices.map(invoice => ({
        ...invoice,
        vat: taxState.settings?.taxRegime === 'ordinario' ? (invoice.vat || { type: 'standard', rate: 22 }) : undefined
      }));
      setInvoices(updatedData);
    } catch (error) {
      console.error(error);
      setError('Errore nella cancellazione della fattura');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !invoices.length) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Fatture</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="block w-32 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <div className="relative group">
            <button
              onClick={() => setShowNewInvoiceForm(true)}
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <span className="hidden sm:inline">Crea Fattura</span>
              <PlusIcon className="h-5 w-5 sm:hidden" aria-hidden="true" />
              <span className="sr-only">Crea nuova fattura</span>
            </button>
            <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 right-0 top-full mt-1 whitespace-nowrap sm:hidden">
              Crea Fattura
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {showNewInvoiceForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Nuova Fattura</h3>
          <form onSubmit={handleCreateInvoice} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Numero Fattura
                </label>
                <input
                  type="text"
                  required
                  value={newInvoice.number || ''}
                  onChange={(e) => setNewInvoice(prev => ({ ...prev, number: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data Emissione
                </label>
                <input
                  type="date"
                  required
                  value={newInvoice.issueDate ? new Date(newInvoice.issueDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setNewInvoice(prev => ({ ...prev, issueDate: new Date(e.target.value) }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Titolo
                </label>
                <input
                  type="text"
                  required
                  value={newInvoice.title || ''}
                  onChange={(e) => setNewInvoice(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome Cliente
                </label>
                <input
                  type="text"
                  required
                  value={newInvoice.clientName || ''}
                  onChange={(e) => setNewInvoice(prev => ({ ...prev, clientName: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Importo
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={newInvoice.amount || ''}
                  onChange={(e) => setNewInvoice(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data Pagamento
                </label>
                <input
                  type="date"
                  value={newInvoice.paymentDate ? new Date(newInvoice.paymentDate).toISOString().split('T')[0] : ''}
                  onChange={(e) =>
                    setNewInvoice({ ...newInvoice, paymentDate: e.target.value ? new Date(e.target.value) : undefined })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              {/* Campo IVA solo per regime ordinario */}
              {taxState.settings?.taxRegime === 'ordinario' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    IVA
                  </label>
                  <div className="mt-1 flex space-x-4">
                    <select
                      value={newInvoice.vat?.type ?? 'standard'}
                      onChange={(e) => {
                        const selectedType = e.target.value as 'standard' | 'reduced10' | 'reduced5' | 'reduced4' | 'custom';
                        const selectedOption = vatOptions.find(opt => opt.type === selectedType);
                        setNewInvoice(prev => ({
                          ...prev,
                          vat: {
                            type: selectedType,
                            rate: selectedOption?.rate || (selectedType === 'custom' ? 0 : 22)
                          }
                        }));
                      }}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      {vatOptions.map(option => (
                        <option key={option.type} value={option.type}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {newInvoice.vat?.type === 'custom' && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={newInvoice.vat?.rate || 0}
                          onChange={(e) => setNewInvoice(prev => ({
                            ...prev,
                            vat: {
                              type: 'custom',
                              rate: Number(e.target.value)
                            }
                          }))}
                          className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        <span className="text-gray-500">%</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowNewInvoiceForm(false);
                  setNewInvoice({ 
                    fiscalYear: selectedYear, 
                    issueDate: new Date(),
                    vat: taxState.settings?.taxRegime === 'ordinario' ? { type: 'standard', rate: 22 } : undefined
                  });
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annulla
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Salvataggio...' : 'Salva'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            {/* Tabella per schermi grandi */}
            <div className="hidden sm:block">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">
                      Numero
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Data
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Cliente
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Importo
                    </th>
                    {/* Colonna IVA solo per regime ordinario */}
                    {taxState.settings?.taxRegime === 'ordinario' && (
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        IVA
                      </th>
                    )}
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Data Pagamento
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Azioni
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice._id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6 lg:pl-8">
                        {invoice.number}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {new Date(invoice.issueDate).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {invoice.clientName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        €{invoice.amount.toFixed(2)}
                      </td>
                      {/* Cella IVA solo per regime ordinario */}
                      {taxState.settings?.taxRegime === 'ordinario' && (
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {invoice.vat?.rate}%
                        </td>
                      )}
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {invoice.paymentDate ? (
                          new Date(invoice.paymentDate).toLocaleDateString()
                        ) : (
                          <input
                            type="date"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            onChange={(e) => {
                              if (invoice._id && e.target.value) {
                                handleUpdatePaymentDate(invoice._id, new Date(e.target.value));
                              }
                            }}
                          />
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        <div className="relative group">
                          <button
                            onClick={() => invoice._id && setDeleteInvoiceId(invoice._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                            <span className="sr-only">Elimina fattura</span>
                          </button>
                          <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
                            Elimina fattura
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards per schermi piccoli */}
            <div className="sm:hidden space-y-4 px-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice._id}
                  className="bg-white shadow rounded-lg overflow-hidden"
                >
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Fattura #{invoice.number}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(invoice.issueDate).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={() => invoice._id && setDeleteInvoiceId(invoice._id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <TrashIcon className="h-5 w-5" aria-hidden="true" />
                        <span className="sr-only">Elimina fattura</span>
                      </button>
                    </div>

                    <div className="text-sm text-gray-900">
                      <span className="font-medium">Cliente:</span> {invoice.clientName}
                    </div>

                    <div className="text-sm text-gray-900">
                      <span className="font-medium">Importo:</span> €{invoice.amount.toFixed(2)}
                    </div>

                    {/* IVA nella vista mobile solo per regime ordinario */}
                    {taxState.settings?.taxRegime === 'ordinario' && (
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">IVA:</span> {invoice.vat?.rate}%
                      </div>
                    )}

                    <div className="text-sm">
                      <span className="font-medium text-gray-900">Data Pagamento:</span>
                      {invoice.paymentDate ? (
                        <span className="ml-2 text-gray-900">
                          {new Date(invoice.paymentDate).toLocaleDateString()}
                        </span>
                      ) : (
                        <input
                          type="date"
                          className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          onChange={(e) => {
                            if (invoice._id && e.target.value) {
                              handleUpdatePaymentDate(invoice._id, new Date(e.target.value));
                            }
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dialog di conferma eliminazione */}
      <ConfirmDialog
        isOpen={!!deleteInvoiceId}
        title="Elimina fattura"
        message="Sei sicuro di voler eliminare questa fattura? Questa azione non può essere annullata."
        confirmLabel="Elimina"
        cancelLabel="Annulla"
        onConfirm={() => deleteInvoiceId && handleDeleteInvoice(deleteInvoiceId)}
        onCancel={() => setDeleteInvoiceId(null)}
      />
    </div>
  );
}
