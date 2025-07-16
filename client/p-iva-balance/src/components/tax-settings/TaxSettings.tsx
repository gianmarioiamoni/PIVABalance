'use client';

import React, { forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useTaxSettings } from '@/hooks/useTaxSettings';
import {
    StatusMessages,
    NavigationHandler,
    TaxableIncomeSection,
    PensionContributionsSection,
    ProfitabilityRateTable
} from '@/components/tax-settings';
import ConfirmDialog from '@/components/ConfirmDialog';

/**
 * Props for TaxSettings component
 * Following Interface Segregation Principle
 */
interface TaxSettingsProps {
    activeTab: string;
    attemptedTab: string | undefined;
    onTabChange: (newTab: string) => void;
    onCancelTabChange: () => void;
    className?: string;
}

/**
 * Ref interface for parent components
 */
interface TaxSettingsRef {
    hasChanges: () => boolean;
}

/**
 * Main Tax Settings Component
 * 
 * Enhanced integration component that orchestrates all tax-settings subcomponents:
 * - WCAG accessibility compliance
 * - TypeScript strict typing (zero 'any')
 * - Modern UX with loading states and error handling
 * - Responsive design (mobile-first)
 * - React Query for efficient data management
 * - SOLID principles adherence
 * - Form validation and change tracking
 * 
 * Features:
 * - Navigation guard for unsaved changes
 * - Real-time form validation
 * - Optimistic UI updates
 * - Accessible error messaging
 * - Mobile-responsive layout
 * 
 * @example
 * ```tsx
 * const taxSettingsRef = useRef<TaxSettingsRef>(null);
 * 
 * <TaxSettings
 *   ref={taxSettingsRef}
 *   activeTab={activeTab}
 *   attemptedTab={attemptedTab}
 *   onTabChange={handleTabChange}
 *   onCancelTabChange={handleCancelTabChange}
 * />
 * ```
 */
const TaxSettings = forwardRef<TaxSettingsRef, TaxSettingsProps>(({
    activeTab,
    attemptedTab,
    onTabChange,
    onCancelTabChange,
    className = '',
}, ref) => {
    // Local state for UI interactions
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<string | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Tax settings hook with all business logic
    const {
        state: { settings, loading, error, success, showRateTable },
        actions: {
            handleChange,
            handleSubmit,
            handleRateSelect,
            setShowRateTable,
            hasChanges,
            isValid,
        }
    } = useTaxSettings();

    /**
     * Expose hasChanges method to parent components
     * Allows parent to check for unsaved changes before navigation
     */
    useImperativeHandle(ref, () => ({
        hasChanges,
    }), [hasChanges]);

    /**
     * Handle navigation confirmation
     * Processes pending navigation after user confirmation
     */
    const handleConfirmNavigation = useCallback(async () => {
        setShowConfirmDialog(false);
        if (pendingNavigation) {
            if (pendingNavigation.startsWith('tab:')) {
                const newTab = pendingNavigation.replace('tab:', '');
                onTabChange(newTab);
            }
            setPendingNavigation(undefined);
        }
    }, [pendingNavigation, onTabChange]);

    /**
     * Handle navigation cancellation
     * Cancels pending navigation and maintains current state
     */
    const handleCancelNavigation = useCallback(() => {
        setShowConfirmDialog(false);
        setPendingNavigation(undefined);
        onCancelTabChange();
    }, [onCancelTabChange]);

    /**
     * Enhanced form submission with loading states and error handling
     */
    const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValid() || isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        try {
            await handleSubmit(e);
        } catch (error) {
            console.error('Form submission error:', error);
            // Error is handled by the hook
        } finally {
            setIsSubmitting(false);
        }
    }, [handleSubmit, isValid, isSubmitting]);

    /**
     * Loading state rendering
     * Accessible loading indicator with proper ARIA attributes
     */
    if (loading) {
        return (
            <div
                className={`flex flex-col items-center justify-center p-8 min-h-[400px] ${className}`}
                role="status"
                aria-live="polite"
                aria-label="Caricamento impostazioni fiscali"
            >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" aria-hidden="true" />
                <span className="text-gray-600 text-sm">Caricamento impostazioni fiscali...</span>
            </div>
        );
    }

    /**
     * Generate unique IDs for accessibility
     */
    const formId = `tax-settings-form-${React.useId()}`;
    const errorId = error ? `${formId}-error` : undefined;

    return (
        <div
            className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}
            data-testid="tax-settings"
        >
            {/* Header Section */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    Impostazioni Fiscali
                </h2>
                <p className="text-gray-600 text-sm">
                    Configura i parametri per il calcolo delle imposte e dei contributi previdenziali
                </p>
            </div>

            {/* Content Section */}
            <div className="p-6">
                {/* Status Messages */}
                <StatusMessages
                    error={error || undefined}
                    success={success}
                    className="mb-6"
                />

                {/* Navigation Handler */}
                <NavigationHandler
                    hasChanges={hasChanges}
                    showConfirmDialog={showConfirmDialog}
                    pendingNavigation={pendingNavigation}
                    onConfirmNavigation={handleConfirmNavigation}
                    onCancelNavigation={handleCancelNavigation}
                    setShowConfirmDialog={setShowConfirmDialog}
                    setPendingNavigation={setPendingNavigation}
                    activeTab={activeTab}
                    attemptedTab={attemptedTab}
                    onTabChange={onTabChange}
                />

                {/* Main Form */}
                <form
                    id={formId}
                    onSubmit={handleFormSubmit}
                    className="space-y-8"
                    noValidate
                    aria-describedby={errorId}
                >
                    {/* Taxable Income Section */}
                    <section aria-labelledby="taxable-income-heading">
                        <h3 id="taxable-income-heading" className="sr-only">
                            Parametri calcolo reddito imponibile
                        </h3>
                        <TaxableIncomeSection
                            settings={settings}
                            handleChange={handleChange}
                            setShowRateTable={setShowRateTable}
                        />
                    </section>

                    {/* Pension Contributions Section */}
                    <section aria-labelledby="pension-contributions-heading">
                        <h3 id="pension-contributions-heading" className="sr-only">
                            Contributi previdenziali
                        </h3>
                        <PensionContributionsSection
                            settings={settings}
                            handleChange={handleChange}
                        />
                    </section>

                    {/* Submit Section */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-6 border-t border-gray-200">
                        {/* Validation Messages */}
                        {!isValid() && (
                            <div
                                className="flex items-start p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                                role="alert"
                                aria-live="polite"
                            >
                                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
                                <div className="text-sm text-yellow-800">
                                    <p className="font-medium mb-1">Configurazione incompleta</p>
                                    <p>Completa tutti i campi obbligatori per salvare le impostazioni.</p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:ml-auto">
                            {hasChanges() && (
                                <span className="text-sm text-gray-500 sm:mr-4 sm:self-center">
                                    Modifiche non salvate
                                </span>
                            )}

                            <button
                                type="submit"
                                disabled={loading || isSubmitting || !hasChanges() || !isValid()}
                                className={`
                  inline-flex items-center justify-center px-6 py-2.5 
                  border border-transparent text-sm font-medium rounded-lg
                  transition-all duration-200 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${isSubmitting || loading
                                        ? 'bg-blue-400 text-white'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
                                    }
                  /* Mobile optimizations */
                  min-h-[44px] /* Touch-friendly height */
                  sm:min-h-[40px]
                `}
                                aria-describedby={hasChanges() ? undefined : 'no-changes-help'}
                            >
                                {isSubmitting || loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" aria-hidden="true" />
                                        Salvataggio...
                                    </>
                                ) : (
                                    'Salva Modifiche'
                                )}
                            </button>

                            {!hasChanges() && (
                                <div id="no-changes-help" className="sr-only">
                                    Nessuna modifica da salvare
                                </div>
                            )}
                        </div>
                    </div>
                </form>

                {/* Profitability Rate Table Modal */}
                {showRateTable && (
                    <ProfitabilityRateTable
                        onSelect={handleRateSelect}
                        onClose={() => setShowRateTable(false)}
                    />
                )}
            </div>
        </div>
    );
});

TaxSettings.displayName = 'TaxSettings';

export default TaxSettings; 