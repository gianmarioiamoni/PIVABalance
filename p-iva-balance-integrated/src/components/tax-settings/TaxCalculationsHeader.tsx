import React from 'react';
import { CalendarIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

/**
 * Props for TaxCalculationsHeader component
 */
interface TaxCalculationsHeaderProps {
    selectedYear: number;
    availableYears: number[];
    isLoading: boolean;
    onYearChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    onRefresh: () => void;
    className?: string;
}

/**
 * Tax Calculations Header Component
 * 
 * Follows Single Responsibility Principle - only handles header display and controls.
 * Provides title, description, year selector, and refresh functionality.
 * 
 * Features:
 * - Year selection dropdown with validation
 * - Refresh button with loading animation
 * - Responsive layout for mobile and desktop
 * - Accessibility compliant with ARIA attributes
 * - Loading states for controls
 * 
 * @param selectedYear - Currently selected year
 * @param availableYears - Array of selectable years
 * @param isLoading - Whether calculations are loading
 * @param onYearChange - Handler for year selection change
 * @param onRefresh - Handler for refresh button click
 * @param className - Additional CSS classes
 */
export const TaxCalculationsHeader: React.FC<TaxCalculationsHeaderProps> = ({
    selectedYear,
    availableYears,
    isLoading,
    onYearChange,
    onRefresh,
    className = ""
}) => {
    const componentId = React.useId();
    const yearSelectId = `tax-year-select-${componentId}`;

    return (
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}>
            {/* Title and Description */}
            <div>
                <h1 id={`tax-contributions-title-${componentId}`} className="text-2xl font-bold text-gray-900">
                    Calcolo Tasse e Contributi
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                    Riepilogo delle imposte e contributi previdenziali per l&apos;anno selezionato
                </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
                {/* Year Selection */}
                <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    <label htmlFor={yearSelectId} className="sr-only">
                        Seleziona anno
                    </label>
                    <select
                        id={yearSelectId}
                        value={selectedYear}
                        onChange={onYearChange}
                        disabled={isLoading}
                        className={`
              px-3 py-2 border border-gray-300 rounded-md shadow-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              text-sm font-medium transition-colors duration-200
            `}
                        aria-label="Seleziona anno per il calcolo"
                    >
                        {availableYears.map(year => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Refresh Button */}
                <button
                    onClick={onRefresh}
                    disabled={isLoading}
                    className={`
            inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm
            text-sm font-medium text-gray-700 bg-white
            hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
          `}
                    aria-label="Aggiorna calcoli"
                >
                    <ArrowPathIcon
                        className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                        aria-hidden="true"
                    />
                    <span className="ml-2 hidden sm:inline">Aggiorna</span>
                </button>
            </div>
        </div>
    );
}; 