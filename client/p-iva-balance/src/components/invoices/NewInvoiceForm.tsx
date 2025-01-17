import { Invoice } from '@/services/invoiceService';
import { vatOptions } from '@/hooks/invoices/useNewInvoice';

interface NewInvoiceFormProps {
  newInvoice: Partial<Invoice>;
  setNewInvoice: (invoice: Partial<Invoice>) => void;
  handleCreateInvoice: (e: React.FormEvent) => void;
  handleVatChange: (type: 'standard' | 'reduced10' | 'reduced5' | 'reduced4' | 'custom') => void;
  showTaxRegime: boolean;
}

export const NewInvoiceForm = ({
  newInvoice,
  setNewInvoice,
  handleCreateInvoice,
  handleVatChange,
  showTaxRegime,
}: NewInvoiceFormProps) => {
  return (
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
              onChange={(e) => setNewInvoice({ ...newInvoice, number: e.target.value })}
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
              onChange={(e) => setNewInvoice({ ...newInvoice, issueDate: new Date(e.target.value) })}
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
              onChange={(e) => setNewInvoice({ ...newInvoice, title: e.target.value })}
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
              onChange={(e) => setNewInvoice({ ...newInvoice, clientName: e.target.value })}
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
              onChange={(e) => setNewInvoice({ ...newInvoice, amount: Number(e.target.value) })}
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
          {showTaxRegime && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                IVA
              </label>
              <div className="mt-1 flex space-x-4">
                <select
                  value={newInvoice.vat?.type ?? 'standard'}
                  onChange={(e) => {
                    const selectedType = e.target.value as 'standard' | 'reduced10' | 'reduced5' | 'reduced4' | 'custom';
                    handleVatChange(selectedType);
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
                      value={newInvoice.vat?.rate ?? ''}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          vat: { ...newInvoice.vat!, rate: Number(e.target.value) }
                        })
                      }
                      className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Salva
          </button>
        </div>
      </form>
    </div>
  );
};
