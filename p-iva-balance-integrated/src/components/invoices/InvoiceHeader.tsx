'use client';

import { PlusIcon } from 'lucide-react';

/**
 * Invoice Header Component
 * Contains year selector and create invoice button
 */

export interface InvoiceHeaderProps {
    selectedYear: number;
    availableYears: number[];
    onYearChange: (year: number) => void;
    onNewInvoiceClick: () => void;
    totalInvoices?: number;
}

export const InvoiceHeader = ({
    selectedYear,
    availableYears,
    onYearChange,
    onNewInvoiceClick,
    totalInvoices = 0,
}: InvoiceHeaderProps) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Fatture</h2>
                {totalInvoices > 0 && (
                    <p className="mt-1 text-sm text-gray-600">
                        {totalInvoices} fatture per l'anno {selectedYear}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-3">
                {/* Year Selector */}
                <div className="min-w-0">
                    <label htmlFor="year-select" className="sr-only">
                        Seleziona anno
                    </label>
                    <select
                        id="year-select"
                        value={selectedYear}
                        onChange={(e) => onYearChange(Number(e.target.value))}
                        className="block w-full rounded-md border-0 py-2 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white shadow-sm"
                    >
                        {availableYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Create Invoice Button */}
                <button
                    onClick={onNewInvoiceClick}
                    className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
                >
                    <PlusIcon className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Crea Fattura</span>
                    <span className="sr-only">Crea nuova fattura</span>
                </button>
            </div>
        </div>
    );
};

export default InvoiceHeader; 