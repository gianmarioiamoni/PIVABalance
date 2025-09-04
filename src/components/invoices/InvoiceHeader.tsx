import { PlusIcon } from 'lucide-react';

/**
 * Invoice Header Component (Server Component)
 * 
 * Presentational component for invoice header with year selector and actions.
 * Converted to server component as it only renders props without client-side state.
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
                        {totalInvoices} {totalInvoices === 1 ? 'fattura' : 'fatture'} per il {selectedYear}
                    </p>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                {/* Year Selector */}
                <select
                    value={selectedYear}
                    onChange={(e) => onYearChange(parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Seleziona anno"
                >
                    {availableYears.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>

                {/* New Invoice Button */}
                <button
                    onClick={onNewInvoiceClick}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label="Crea nuova fattura"
                >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Nuova Fattura
                </button>
            </div>
        </div>
    );
}; 