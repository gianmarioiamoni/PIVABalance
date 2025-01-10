'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Invoice, invoiceService } from '@/services/invoiceService';
import { UserSettings } from '@/services/settingsService';
import { useTaxSettings } from '@/hooks/useTaxSettings';
import { CalendarIcon, TrashIcon } from '@heroicons/react/24/outline';
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
  });
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [deleteInvoiceId, setDeleteInvoiceId] = useState<string | null>(null);

  // Generate available years starting from 2025
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from(
    { length: currentYear - 2024 },
    (_, i) => 2025 + i
  );

  useEffect(() => {
    if (user) {
      loadInvoices();
      setUserSettings(taxState.settings);
    }
  }, [selectedYear, user, taxState.settings]);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const data = await invoiceService.getInvoicesByYear(selectedYear);
      setInvoices(data);
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
      } as Omit<Invoice, '_id'>;

      const createdInvoice = await invoiceService.createInvoice(invoiceData);
      setInvoices(prev => [...prev, createdInvoice]);
      setShowNewInvoiceForm(false);
      setNewInvoice({ fiscalYear: selectedYear, issueDate: new Date() });
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
        setInvoices(updatedInvoices);
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
      setInvoices(updatedInvoices);
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
        <div className="flex space-x-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowNewInvoiceForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Nuova Fattura
          </button>
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
              {taxState.settings?.taxRegime === 'forfettario' && (
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
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowNewInvoiceForm(false);
                  setNewInvoice({ fiscalYear: selectedYear, issueDate: new Date() });
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

      <div className="mt-6">
        {invoices.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nessuna fattura trovata per l'anno {selectedYear}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numero
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Emissione
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titolo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Importo
                  </th>
                  {taxState.settings?.taxRegime === 'forfettario' && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Pagamento
                    </th>
                  )}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(invoice.issueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.clientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      €{invoice.amount.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                    </td>
                    {taxState.settings?.taxRegime === 'forfettario' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.paymentDate ? (
                          new Date(invoice.paymentDate).toLocaleDateString()
                        ) : (
                          <div>
                            <input
                              type="date"
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              onChange={(e) => {
                                if (invoice._id && e.target.value) {
                                  handleUpdatePaymentDate(invoice._id, new Date(e.target.value));
                                }
                              }}
                            />
                          </div>
                        )}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
        )}
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
