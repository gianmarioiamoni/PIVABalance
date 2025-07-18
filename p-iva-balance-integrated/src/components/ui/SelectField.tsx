import { Icon } from '@/components/ui/Icon';
import React from 'react';
import { LoadingOverlay } from './LoadingOverlay';

/**
 * Option interface for SelectField
 */
interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

/**
 * Props for SelectField component
 */
interface SelectFieldProps {
    id: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    loading?: boolean;
    error?: string;
    className?: string;
    'aria-label'?: string;
    'aria-describedby'?: string;
}

/**
 * Reusable Select Field Component
 * 
 * Follows Single Responsibility Principle - only handles select field display and interaction.
 * Provides consistent styling and functionality across different select inputs.
 * 
 * Features:
 * - Custom dropdown styling with ChevronDown icon
 * - Loading states with overlay
 * - Error states with visual feedback
 * - Accessibility compliant with ARIA attributes
 * - Mobile-optimized (prevents zoom on iOS)
 * - Smooth transitions and hover effects
 * 
 * @param id - Unique identifier for the select field
 * @param value - Current selected value
 * @param onChange - Callback when selection changes
 * @param options - Array of options to display
 * @param placeholder - Placeholder text when no option is selected
 * @param disabled - Whether the field is disabled
 * @param loading - Whether to show loading state
 * @param error - Error message to display
 * @param className - Additional CSS classes
 * @param aria-label - ARIA label for accessibility
 * @param aria-describedby - ARIA describedby for accessibility
 */
export const SelectField: React.FC<SelectFieldProps> = ({
    id,
    value,
    onChange,
    options,
    placeholder = "Seleziona un'opzione",
    disabled = false,
    loading = false,
    error,
    className = "",
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy
}) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(event.target.value);
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {/* Select field container */}
            <div className="relative">
                <select
                    id={id}
                    value={value}
                    onChange={handleChange}
                    disabled={disabled || loading}
                    aria-label={ariaLabel}
                    aria-describedby={ariaDescribedBy}
                    aria-invalid={Boolean(error)}
                    className={`
            w-full rounded-lg border px-3 py-2.5 pr-10 
            bg-white text-gray-900 shadow-sm
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-offset-2
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${error
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        }
            ${loading ? 'animate-pulse' : ''}
            
            /* Mobile optimizations */
            text-base /* Prevents zoom on iOS */
            sm:text-sm /* Smaller text on larger screens */
            
            /* Enhanced accessibility */
            appearance-none /* Remove default browser styling */
          `}
                >
                    <option value="" disabled={Boolean(value)}>
                        {loading ? 'Caricamento...' : placeholder}
                    </option>
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Custom dropdown icon */}
                <Icon
                    name="ChevronDownIcon"
                    className={`
            absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 
            text-gray-400 pointer-events-none transition-transform duration-200
            ${disabled || loading ? 'opacity-50' : ''}
          `}
                />

                {/* Loading overlay */}
                <LoadingOverlay isVisible={loading} />
            </div>

            {/* Error message */}
            {error && (
                <div
                    className="flex items-center mt-2 text-sm text-red-600"
                    role="alert"
                    aria-live="polite"
                >
                    <Icon name="ExclamationCircleIcon" className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}; 