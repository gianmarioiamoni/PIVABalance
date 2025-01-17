import { useState } from 'react';
import { Invoice, invoiceService } from '@/services/invoiceService';

interface VatOption {
  type: 'standard' | 'reduced10' | 'reduced5' | 'reduced4' | 'custom';
  label: string;
  rate: number;
}

export const vatOptions: VatOption[] = [
  { type: 'standard', label: 'IVA 22%', rate: 22 },
  { type: 'reduced10', label: 'IVA 10%', rate: 10 },
  { type: 'reduced5', label: 'IVA 5%', rate: 5 },
  { type: 'reduced4', label: 'IVA 4%', rate: 4 },
  { type: 'custom', label: 'IVA Personalizzata', rate: 0 }
];

interface UseNewInvoiceProps {
  selectedYear: number;
  taxRegime?: string;
  userId: string;
  onSuccess: () => void;
}

export const useNewInvoice = ({ selectedYear, taxRegime, userId, onSuccess }: UseNewInvoiceProps) => {
  const [showNewInvoiceForm, setShowNewInvoiceForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    fiscalYear: selectedYear,
    issueDate: new Date(),
    vat: taxRegime === 'ordinario' ? { type: 'standard', rate: 22 } : undefined
  });

  const resetForm = () => {
    setNewInvoice({
      fiscalYear: selectedYear,
      issueDate: new Date(),
      vat: taxRegime === 'ordinario' ? { type: 'standard', rate: 22 } : undefined
    });
    setShowNewInvoiceForm(false);
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError('User ID non valido');
      return;
    }

    // Validate required fields
    if (!newInvoice.number) {
      setError('Numero fattura obbligatorio');
      return;
    }

    if (!newInvoice.title) {
      setError('Titolo fattura obbligatorio');
      return;
    }

    if (!newInvoice.clientName) {
      setError('Nome cliente obbligatorio');
      return;
    }

    if (!newInvoice.amount) {
      setError('Importo obbligatorio');
      return;
    }

    if (!newInvoice.issueDate) {
      setError('Data emissione obbligatoria');
      return;
    }

    setLoading(true);
    try {
      setLoading(true);

      const vatData = newInvoice.vat ? {
        type: newInvoice.vat.type,
        rate: newInvoice.vat.rate
      } : undefined;

      const invoiceData: Omit<Invoice, '_id'> = {
        userId: userId,
        number: newInvoice.number!, // We can safely use ! here because we validated it above
        title: newInvoice.title!,
        clientName: newInvoice.clientName!,
        amount: Number(newInvoice.amount!),
        issueDate: newInvoice.issueDate!,
        fiscalYear: selectedYear,
        paymentDate: newInvoice.paymentDate ? new Date(newInvoice.paymentDate) : undefined,
        ...(vatData ? { vat: vatData } : {})
      };

      console.log('Form values:', newInvoice);
      console.log('Processed invoice data:', invoiceData);

      await invoiceService.createInvoice(invoiceData);
      resetForm();
      onSuccess();
      setError(null);
    } catch (err: any) {
      console.error('Error details:', err);
      const errorMessage = err.response?.data?.message || 'Errore nella creazione della fattura';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVatChange = (type: VatOption['type'], customRate?: number) => {
    const selectedOption = vatOptions.find(opt => opt.type === type);
    setNewInvoice(prev => ({
      ...prev,
      vat: {
        type,
        rate: type === 'custom' ? (customRate ?? 0) : (selectedOption?.rate ?? 22)
      }
    }));
  };

  return {
    showNewInvoiceForm,
    setShowNewInvoiceForm,
    loading,
    error,
    newInvoice,
    setNewInvoice,
    handleCreateInvoice,
    handleVatChange,
    resetForm
  };
};
