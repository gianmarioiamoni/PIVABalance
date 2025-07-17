import React from 'react';
import { InpsRate } from '@/services/inpsService';
import { formatCurrency } from '@/utils/formatters';

/**
 * Props for InpsRateOption component
 */
interface InpsRateOptionProps {
    rate: InpsRate;
    minContribution: number;
    isSelected: boolean;
    onSelect: (rate: InpsRate) => void;
    name: string; // Radio group name for accessibility
}

/**
 * Individual INPS Rate Option Component
 * 
 * Follows Single Responsibility Principle - only handles rate option display and selection.
 * Provides proper accessibility with semantic radio input and ARIA attributes.
 * 
 * Features:
 * - Semantic radio input for accessibility
 * - Keyboard navigation support
 * - Screen reader friendly
 * - Proper focus management
 * - Visual feedback for selection
 * 
 * @param rate - INPS rate data
 * @param minContribution - Minimum contribution amount
 * @param isSelected - Whether this option is selected
 * @param onSelect - Callback when option is selected
 * @param name - Radio group name for accessibility
 */
export const InpsRateOption: React.FC<InpsRateOptionProps> = ({
    rate,
    minContribution,
    isSelected,
    onSelect,
    name
}) => {
    const optionId = `inps-rate-${rate.type}`;

    const handleSelect = () => {
        onSelect(rate);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Handle space key as selection (in addition to Enter)
        if (e.key === ' ') {
            e.preventDefault();
            handleSelect();
        }
    };

    return (
        <div className="relative">
            <input
                type="radio"
                id={optionId}
                name={name}
                value={rate.type}
                checked={isSelected}
                onChange={handleSelect}
                className="sr-only" // Hidden but accessible
                aria-describedby={`${optionId}-description`}
            />
            <label
                htmlFor={optionId}
                className={`
          relative flex items-center p-4 cursor-pointer rounded-lg border transition-all duration-200
          focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
          ${isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                    }
        `}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="radio"
                aria-checked={isSelected}
                aria-labelledby={`${optionId}-title`}
                aria-describedby={`${optionId}-description`}
            >
                <div className="min-w-0 flex-1">
                    <div
                        id={`${optionId}-title`}
                        className="text-sm font-medium text-gray-900"
                    >
                        {rate.description}
                    </div>
                    <div
                        id={`${optionId}-description`}
                        className="mt-1 flex items-center text-sm text-gray-500"
                    >
                        <span>
                            Aliquota: {rate.rate}%
                        </span>
                        <span className="mx-2 text-gray-300" aria-hidden="true">|</span>
                        <span>
                            Contributo minimo: {formatCurrency(minContribution)}
                        </span>
                    </div>
                </div>

                {/* Visual radio indicator */}
                <div className="ml-4 flex-shrink-0">
                    <div
                        className={`
              h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200
              ${isSelected
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300'
                            }
            `}
                        aria-hidden="true"
                    >
                        {isSelected && (
                            <svg
                                className="h-3 w-3 text-white"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}
                    </div>
                </div>
            </label>
        </div>
    );
}; 