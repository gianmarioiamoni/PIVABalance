import React from 'react';
import { FormValidationAlert } from './FormValidationAlert';
import { FormActionButtons } from './FormActionButtons';

/**
 * Props for FormSubmitSection component
 */
interface FormSubmitSectionProps {
    isSubmitting: boolean;
    isLoading: boolean;
    hasChanges: boolean;
    isValid: boolean;
    submitText?: string;
    loadingText?: string;
    validationTitle?: string;
    validationMessage?: string;
    className?: string;
}

/**
 * Reusable Form Submit Section Component
 * 
 * Combines validation alerts and action buttons for forms.
 * Follows Single Responsibility Principle - only handles submit section presentation.
 * 
 * Features:
 * - Integrated validation alerts
 * - Action buttons with proper states
 * - Responsive layout
 * - Consistent styling across forms
 * 
 * @param isSubmitting - Whether form is currently submitting
 * @param isLoading - Whether data is loading
 * @param hasChanges - Whether form has unsaved changes
 * @param isValid - Whether form is valid
 * @param submitText - Text for submit button
 * @param loadingText - Text for loading state
 * @param validationTitle - Title for validation alert
 * @param validationMessage - Message for validation alert
 * @param className - Additional CSS classes
 */
export const FormSubmitSection: React.FC<FormSubmitSectionProps> = ({
    isSubmitting,
    isLoading,
    hasChanges,
    isValid,
    submitText,
    loadingText,
    validationTitle,
    validationMessage,
    className = ""
}) => {
    return (
        <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-6 border-t border-gray-200 ${className}`}>
            {/* Validation Messages */}
            {!isValid && (
                <FormValidationAlert
                    title={validationTitle}
                    message={validationMessage}
                />
            )}

            {/* Action Buttons */}
            <FormActionButtons
                isSubmitting={isSubmitting}
                isLoading={isLoading}
                hasChanges={hasChanges}
                isValid={isValid}
                submitText={submitText}
                loadingText={loadingText}
            />
        </div>
    );
}; 