import { PlusIcon } from '@heroicons/react/24/outline';

interface InvoiceHeaderProps {
  selectedYear: number;
  availableYears: number[];
  onYearChange: (year: number) => void;
  onNewInvoiceClick: () => void;
}

export const InvoiceHeader = ({
  selectedYear,
  availableYears,
  onYearChange,
  onNewInvoiceClick,
}: InvoiceHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">Fatture</h2>
      <div className="flex items-center space-x-4">
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
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
            onClick={onNewInvoiceClick}
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
  );
};
