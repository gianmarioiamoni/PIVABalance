import React from 'react';

/**
 * Props for FormActionButtons component
 */
interface FormActionButtonsProps {
  isSubmitting: boolean;
  isLoading: boolean;
  hasChanges: boolean;
  isValid: boolean;
  submitText?: string;
  loadingText?: string;
  className?: string;
}

/**
 * Reusable Form Action Buttons Component
 * 
 * Displays submit button with proper states and accessibility.
 * Follows Single Responsibility Principle - only handles action buttons presentation.
 * 
 * Features:
 * - Loading states with spinner
 * - Disabled states based on form validity
 * - WCAG accessibility compliance
 * - Touch-friendly mobile design
 * - Responsive layout
 * 
 * @param isSubmitting - Whether form is currently submitting
 * @param isLoading - Whether data is loading
 * @param hasChanges - Whether form has unsaved changes
 * @param isValid - Whether form is valid
 * @param submitText - Text for submit button
 * @param loadingText - Text for loading state
 * @param className - Additional CSS classes
 */
export const FormActionButtons: React.FC<FormActionButtonsProps> = ({
    isSubmitting,
    isLoading,
    hasChanges,
    isValid,
    submitText = "Salva Modifiche",
    loadingText = "Salvataggio...",
    className = ""
}) => {
    return (
        <div className={`flex flex-col sm:flex-row gap-3 sm:ml-auto ${className}`}>
            {hasChanges && (
                <span className="text-sm text-gray-500 sm:mr-4 sm:self-center">
                    Modifiche non salvate
                </span>
            )}

            <button
                type="submit"
                disabled={isLoading || isSubmitting || !hasChanges || !isValid}
                className={`
          inline-flex items-center justify-center px-6 py-2.5 
          border border-transparent text-sm font-medium rounded-lg
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isSubmitting || isLoading
                        ? 'bg-blue-400 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
                    }
          /* Mobile optimizations */
          min-h-[44px] /* Touch-friendly height */
          sm:min-h-[40px]
        `}
                aria-describedby={hasChanges ? undefined : 'no-changes-help'}
            >
                {isSubmitting || isLoading ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" aria-hidden="true" />
                        {loadingText}
                    </>
                ) : (
                    submitText
                )}
            </button>

            {!hasChanges && (
                <div id="no-changes-help" className="sr-only">
                    Nessuna modifica da salvare
                </div>
            )}
        </div>
    );
}; 