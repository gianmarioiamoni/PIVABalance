import { useState, useCallback } from 'react';

/**
 * Hook for managing form submission state and logic
 * 
 * Follows Single Responsibility Principle - only handles form submission concerns.
 * Provides loading states, submission handling, and error management.
 * 
 * @param onSubmit - Function to call when form is submitted
 * @param isValid - Function to check if form is valid
 * @returns Object with submission state and handlers
 */
export const useFormSubmission = (
  onSubmit: (e: React.FormEvent) => Promise<void>,
  isValid: () => boolean
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Enhanced form submission with loading states and error handling
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(e);
    } catch (error) {
      console.error('Form submission error:', error);
      // Error is handled by the calling component
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, isValid, isSubmitting]);

  return {
    isSubmitting,
    handleSubmit,
  };
}; 