'use client';

import { useState } from 'react';
import { X, Save, Calculator } from 'lucide-react';
import { IInvoice } from '@/types';
import { LoadingSpinner } from '@/components/ui';
import { sanitizeInput } from '@/utils/security';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useMessages } from '@/hooks/useMessages';

/**
 * New Invoice Form Component
 * Form for creating new invoices with VAT calculation and validation
 * Enhanced with centralized error handling and notifications
 */

export interface VatOption {
    type: 'standard' | 'reduced10' | 'reduced5' | 'reduced4' | 'custom';
    label: string;
    rate: number;
}

export const vatOptions: VatOption[] = [
    { type: 'standard', label: '22% (Standard)', rate: 22 },
    { type: 'reduced10', label: '10% (Ridotta)', rate: 10 },
    { type: 'reduced5', label: '5% (Super ridotta)', rate: 5 },
    { type: 'reduced4', label: '4% (Agricoltura)', rate: 4 },
    { type: 'custom', label: 'Personalizzata', rate: 0 },
];

export interface NewInvoiceFormProps {
    newInvoice: Partial<IInvoice>;
    setNewInvoice: (invoice: Partial<IInvoice>) => void;
    handleCreateInvoice: (e: React.FormEvent) => void;
    handleVatChange: (type: VatOption['type']) => void;
    showTaxRegime: boolean;
    onCancel: () => void;
    isLoading?: boolean;
}

export const NewInvoiceForm = ({
    newInvoice,
    setNewInvoice,
    handleCreateInvoice,
    handleVatChange,
    showTaxRegime,
    onCancel,
    isLoading = false,
}: NewInvoiceFormProps) => {
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Centralized error handling and messages
    const { handleValidationErrors, handleError } = useErrorHandler();
    const { showCreateSuccess } = useMessages();

    /**
     * Enhanced form submission with centralized error handling
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous validation errors
        setValidationErrors({});

        // Client-side validation
        const errors: Record<string, string> = {};

        if (!newInvoice.number?.trim()) {
            errors.number = 'Numero fattura è obbligatorio';
        }

        if (!newInvoice.clientName?.trim()) {
            errors.clientName = 'Cliente è obbligatorio';
        }

        if (!newInvoice.amount || newInvoice.amount <= 0) {
            errors.amount = 'Importo deve essere maggiore di zero';
        }

        if (!newInvoice.issueDate) {
            errors.issueDate = 'Data è obbligatoria';
        }

        // Handle validation errors with centralized system
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            handleValidationErrors(errors);
            return;
        }

        try {
            // Call the original handler
            await handleCreateInvoice(e);

            // Show success message using centralized system
            showCreateSuccess(`Fattura ${newInvoice.number}`);

        } catch (error) {
            // Handle error with centralized system
            handleError(error as Error, 'Creazione fattura');
        }
    };

    /**
     * Calculate VAT amount and total
     */
    const calculateVAT = () => {
        if (!newInvoice.amount) return { vatAmount: 0, total: 0 };

        const baseAmount = Number(newInvoice.amount) || 0;
        const vatRate = newInvoice.vat?.vatRate || 0;
        const vatAmount = (baseAmount * vatRate) / 100;
        const total = baseAmount + vatAmount;

        return { vatAmount, total };
    };

    const { vatAmount, total } = calculateVAT();

    /**
     * Handle form field changes with validation
     */
    const handleFieldChange = (field: keyof IInvoice, value: string | number | Date) => {
        // Clear validation error for this field
        if (validationErrors[field]) {
            setValidationErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }

        // Sanitize string inputs
        const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value;

        setNewInvoice({
            ...newInvoice,
            [field]: sanitizedValue
        });
    };

    return (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Nuova Fattura</h3>
                <button
                    onClick={onCancel}
                    className="inline-flex items-center gap-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md p-1 transition-colors"
                    aria-label="Chiudi form"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Invoice Number */}
                    <div>
                        <label htmlFor="invoice-number" className="block text-sm font-medium text-gray-700">
                            Numero Fattura *
                        </label>
                        <input
                            id="invoice-number"
                            type="text"
                            required
                            value={newInvoice.number || ''}
                            onChange={(e) => handleFieldChange('number', e.target.value)}
                            className={`mt-1 block w-full rounded-md shadow-sm text-gray-900 focus:ring-indigo-500 sm:text-sm transition-colors ${validationErrors.number
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-gray-300 focus:border-indigo-500'
                                }`}
                            placeholder="Es. 2024-001"
                        />
                        {validationErrors.number && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.number}</p>
                        )}
                    </div>

                    {/* Issue Date */}
                    <div>
                        <label htmlFor="issue-date" className="block text-sm font-medium text-gray-700">
                            Data Emissione *
                        </label>
                        <input
                            id="issue-date"
                            type="date"
                            required
                            value={newInvoice.issueDate ? new Date(newInvoice.issueDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => handleFieldChange('issueDate', new Date(e.target.value))}
                            className={`mt-1 block w-full rounded-md shadow-sm text-gray-900 focus:ring-indigo-500 sm:text-sm transition-colors ${validationErrors.issueDate
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-gray-300 focus:border-indigo-500'
                                }`}
                        />
                        {validationErrors.issueDate && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.issueDate}</p>
                        )}
                    </div>

                    {/* Title */}
                    <div>
                        <label htmlFor="invoice-title" className="block text-sm font-medium text-gray-700">
                            Titolo *
                        </label>
                        <input
                            id="invoice-title"
                            type="text"
                            required
                            value={newInvoice.title || ''}
                            onChange={(e) => handleFieldChange('title', e.target.value)}
                            className={`mt-1 block w-full rounded-md shadow-sm text-gray-900 focus:ring-indigo-500 sm:text-sm transition-colors ${validationErrors.title
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-gray-300 focus:border-indigo-500'
                                }`}
                            placeholder="Descrizione del servizio"
                        />
                        {validationErrors.title && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
                        )}
                    </div>

                    {/* Client Name */}
                    <div>
                        <label htmlFor="client-name" className="block text-sm font-medium text-gray-700">
                            Nome Cliente *
                        </label>
                        <input
                            id="client-name"
                            type="text"
                            required
                            value={newInvoice.clientName || ''}
                            onChange={(e) => handleFieldChange('clientName', e.target.value)}
                            className={`mt-1 block w-full rounded-md shadow-sm text-gray-900 focus:ring-indigo-500 sm:text-sm transition-colors ${validationErrors.clientName
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-gray-300 focus:border-indigo-500'
                                }`}
                            placeholder="Nome del cliente"
                        />
                        {validationErrors.clientName && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.clientName}</p>
                        )}
                    </div>

                    {/* Amount */}
                    <div>
                        <label htmlFor="invoice-amount" className="block text-sm font-medium text-gray-700">
                            Importo (€) *
                        </label>
                        <input
                            id="invoice-amount"
                            type="number"
                            required
                            step="0.01"
                            min="0.01"
                            value={newInvoice.amount || ''}
                            onChange={(e) => handleFieldChange('amount', Number(e.target.value))}
                            className={`mt-1 block w-full rounded-md shadow-sm text-gray-900 focus:ring-indigo-500 sm:text-sm transition-colors ${validationErrors.amount
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-gray-300 focus:border-indigo-500'
                                }`}
                            placeholder="0.00"
                        />
                        {validationErrors.amount && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.amount}</p>
                        )}
                    </div>

                    {/* Payment Date */}
                    <div>
                        <label htmlFor="payment-date" className="block text-sm font-medium text-gray-700">
                            Data Pagamento
                        </label>
                        <input
                            id="payment-date"
                            type="date"
                            value={newInvoice.paymentDate ? new Date(newInvoice.paymentDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value) {
                                    handleFieldChange('paymentDate', new Date(value));
                                } else {
                                    setNewInvoice({ ...newInvoice, paymentDate: undefined });
                                }
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Opzionale - puoi impostarla anche dopo
                        </p>
                    </div>
                </div>

                {/* VAT Section (only for ordinary regime) */}
                {showTaxRegime && (
                    <div className="space-y-4">
                        <h4 className="text-md font-medium text-gray-900">Informazioni IVA</h4>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* VAT Type */}
                            <div>
                                <label htmlFor="vat-type" className="block text-sm font-medium text-gray-700">
                                    Tipo IVA
                                </label>
                                <select
                                    id="vat-type"
                                    value={newInvoice.vat?.vatType ?? 'standard'}
                                    onChange={(e) => {
                                        const selectedType = e.target.value as VatOption['type'];
                                        handleVatChange(selectedType);
                                    }}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    {vatOptions.map(option => (
                                        <option key={option.type} value={option.type}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Custom VAT Rate */}
                            {newInvoice.vat?.vatType === 'custom' && (
                                <div>
                                    <label htmlFor="custom-vat-rate" className="block text-sm font-medium text-gray-700">
                                        Aliquota Personalizzata (%)
                                    </label>
                                    <input
                                        id="custom-vat-rate"
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        value={newInvoice.vat?.vatRate ?? ''}
                                        onChange={(e) =>
                                            setNewInvoice({
                                                ...newInvoice,
                                                vat: {
                                                    ...(newInvoice.vat || { vatType: 'standard' }),
                                                    vatRate: Number(e.target.value)
                                                }
                                            })
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="0.0"
                                    />
                                </div>
                            )}
                        </div>

                        {/* VAT Calculation Summary */}
                        {newInvoice.amount && newInvoice.amount > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calculator className="h-4 w-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-900">Riepilogo</span>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Imponibile:</span>
                                        <span className="font-medium">€{newInvoice.amount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">IVA ({newInvoice.vat?.vatRate || 0}%):</span>
                                        <span className="font-medium">€{vatAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-gray-300 pt-1 mt-2">
                                        <span className="font-medium text-gray-900">Totale:</span>
                                        <span className="font-bold text-gray-900">€{total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Annulla
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex justify-center items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? (
                            <>
                                <LoadingSpinner size="sm" />
                                Salvataggio...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Salva Fattura
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewInvoiceForm; 