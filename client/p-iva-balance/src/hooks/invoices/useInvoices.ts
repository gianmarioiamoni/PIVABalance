import { useState, useEffect } from 'react';
import { Invoice, invoiceService } from '@/services/invoiceService';
import { UserSettings } from '@/services/settingsService';

export const useInvoices = (selectedYear: number, taxRegime?: string) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const data = await invoiceService.getInvoicesByYear(selectedYear);
      // Add default VAT only for old invoices in ordinario regime
      const updatedData = data.map(invoice => ({
        ...invoice,
        vat: taxRegime === 'ordinario' ? (invoice.vat || { type: 'standard', rate: 22 }) : undefined
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

  const handleUpdatePaymentDate = async (invoiceId: string, date: Date) => {
    try {
      setLoading(true);
      setError(null);
      await invoiceService.updateInvoice(invoiceId, { paymentDate: date });
      await loadInvoices(); // Refresh invoices
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
      await loadInvoices(); // Refresh invoices
    } catch (error) {
      console.error(error);
      setError('Errore nella cancellazione della fattura');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, [selectedYear, taxRegime]);

  return {
    invoices,
    loading,
    error,
    handleUpdatePaymentDate,
    handleDeleteInvoice,
    refreshInvoices: loadInvoices
  };
};
