import React from 'react';
// ✅ Ottimizzazione: Uso sistema Icon dinamico
import { Icon } from '@/components/ui';

/**
 * Props for TaxCalculationsHeader component
 */
interface TaxCalculationsHeaderProps {
    selectedYear: number;
    availableYears: number[];
    onYearChange: (year: number) => void;
    onRefresh: () => void;
    isLoading?: boolean;
}

/**
 * Header component for tax calculations with optimized icons
 */
export const TaxCalculationsHeader: React.FC<TaxCalculationsHeaderProps> = ({
    selectedYear,
    availableYears,
    onYearChange,
    onRefresh,
    isLoading = false
}) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
                <Icon name="CalendarIcon" className="h-6 w-6 text-gray-500" />
                <select
                    value={selectedYear}
                    onChange={(e) => onYearChange(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-2 text-gray-900 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                >
                    {availableYears.map((year) => (
                        <option key={year} value={year} className="text-gray-900 font-medium">
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            <button
                onClick={onRefresh}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
                <Icon name="ArrowPathIcon" className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Aggiornamento...' : 'Aggiorna'}
            </button>
        </div>
    );
}; 