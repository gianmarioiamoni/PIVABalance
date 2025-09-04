'use client';

import { useState } from 'react';
import { Trash2, Calendar, Euro, User, FileText, Hash } from 'lucide-react';
import { PlainInvoice } from '@/hooks/invoices/useInvoices';
import { LoadingSpinner } from '@/components/ui';

/**
 * Invoice List Component
 * Displays invoices in a responsive table with inline editing capabilities
 */

export interface InvoiceListProps {
    invoices: PlainInvoice[];
    onUpdatePaymentDate: (invoiceId: string, date: Date) => Promise<void>;
    onDeleteClick: (invoiceId: string) => void;
    isLoading?: boolean;
}

export const InvoiceList = ({
    invoices,
    onUpdatePaymentDate,
    onDeleteClick,
    isLoading = false,
}: InvoiceListProps) => {
    const [updatingPayment, setUpdatingPayment] = useState<string | null>(null);

    /**
     * Format currency with Italian locale
     */
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };

    /**
     * Format date for display
     */
    const formatDate = (date: string | Date): string => {
        return new Date(date).toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    /**
     * Handle payment date update with loading state
     */
    const handlePaymentDateChange = async (invoiceId: string, dateValue: string) => {
        if (!dateValue) return;

        setUpdatingPayment(invoiceId);
        try {
            await onUpdatePaymentDate(invoiceId, new Date(dateValue));
        } catch (error) {
            console.error('Failed to update payment date:', error);
        } finally {
            setUpdatingPayment(null);
        }
    };

    if (isLoading) {
        return (
            <div className="mt-8">
                <LoadingSpinner />
            </div>
        );
    }

    if (invoices.length === 0) {
        return (
            <div className="mt-8 text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Nessuna fattura</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Inizia creando la tua prima fattura per questo anno.
                </p>
            </div>
        );
    }

    return (
        <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        <div className="flex items-center gap-2">
                                            <Hash className="h-4 w-4" />
                                            Numero
                                        </div>
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Data
                                        </div>
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Cliente
                                        </div>
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hidden md:table-cell">
                                        Titolo
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <Euro className="h-4 w-4" />
                                            Importo
                                        </div>
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hidden lg:table-cell">
                                        IVA
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Pagamento
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span className="sr-only">Azioni</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {invoices.map((invoice, index) => (
                                    <tr key={invoice.id || `invoice-${index}`} className="hover:bg-gray-50 transition-colors">
                                        {/* Invoice Number */}
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                            {invoice.number}
                                        </td>

                                        {/* Issue Date */}
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {formatDate(invoice.issueDate)}
                                        </td>

                                        {/* Client Name */}
                                        <td className="px-3 py-4 text-sm text-gray-500">
                                            <div className="max-w-xs truncate" title={invoice.clientName}>
                                                {invoice.clientName}
                                            </div>
                                        </td>

                                        {/* Title (hidden on mobile) */}
                                        <td className="px-3 py-4 text-sm text-gray-500 hidden md:table-cell">
                                            <div className="max-w-xs truncate" title={invoice.title}>
                                                {invoice.title}
                                            </div>
                                        </td>

                                        {/* Amount */}
                                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                                            {formatCurrency(invoice.amount)}
                                        </td>

                                        {/* VAT (hidden on smaller screens) */}
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell">
                                            {invoice.vat ? `${invoice.vat.vatRate}%` : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>

                                        {/* Payment Date */}
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="date"
                                                    value={invoice.paymentDate ? new Date(invoice.paymentDate).toISOString().split('T')[0] : ''}
                                                    onChange={(e) => {
                                                        if (invoice.id && e.target.value) {
                                                            handlePaymentDateChange(invoice.id, e.target.value);
                                                        }
                                                    }}
                                                    disabled={updatingPayment === invoice.id}
                                                    className="block w-full min-w-0 rounded-md border-gray-300 shadow-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                    aria-label={`Data pagamento per fattura ${invoice.number}`}
                                                />
                                                {updatingPayment === invoice.id && (
                                                    <LoadingSpinner size="sm" />
                                                )}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <button
                                                onClick={() => invoice.id && onDeleteClick(invoice.id)}
                                                className="inline-flex items-center gap-1 text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md p-1 transition-colors"
                                                aria-label={`Elimina fattura ${invoice.number}`}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Elimina fattura {invoice.number}</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceList; 