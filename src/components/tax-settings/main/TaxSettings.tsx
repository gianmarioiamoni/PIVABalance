'use client';

import React, { forwardRef, useImperativeHandle } from 'react';
import { useTaxSettings } from '@/hooks/useTaxSettings';
import { useFormSubmission, useNavigationGuard } from '@/hooks/tax-settings';

// Import from specific subdirectories
import { StatusMessages } from '../shared/StatusMessages';
import { TaxSettingsHeader } from '../shared/TaxSettingsHeader';
import ProfitabilityRateTable from '../shared/ProfitabilityRateTable';
import { TaxableIncomeSection } from '../sections/TaxableIncomeSection';
import { PensionContributionsSection } from '../sections/PensionContributionsSection';
import { NavigationHandler } from './NavigationHandler';
import { FormLoadingState, FormSubmitSection } from '@/components/ui';

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
 * Refactored to follow SOLID principles:
 * - Single Responsibility: Orchestrates tax settings UI composition
 * - Open/Closed: Extensible through props and composition
 * - Dependency Inversion: Depends on abstractions (hooks, components)
 * 
 * Features:
 * - WCAG accessibility compliance
 * - TypeScript strict typing (zero 'any')
 * - Modern UX with loading states and error handling
 * - Responsive design (mobile-first)
 * - React Query for efficient data management
 * - Navigation guard for unsaved changes
 * - Real-time form validation
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
    /**
     * Generate unique IDs for accessibility - must be called before any early returns
     */
    const componentId = React.useId();
    const formId = `tax-settings-form-${componentId}`;

    // Tax settings hook with all business logic
    const {
        state: { settings, loading, error, success, showRateTable },
        actions: {
            handleChange,
            handleBatchChange,
            handleSubmit,
            handleRateSelect,
            setShowRateTable,
            hasChanges,
            isValid,
        }
    } = useTaxSettings();

    // Navigation guard hook for handling unsaved changes
    const {
        navigationState: { showConfirmDialog, pendingNavigation },
        navigationActions: {
            setShowConfirmDialog,
            setPendingNavigation,
            handleConfirmNavigation,
            handleCancelNavigation,
        }
    } = useNavigationGuard(onTabChange, onCancelTabChange);

    // Form submission hook for handling loading states
    const { isSubmitting, handleSubmit: handleFormSubmit } = useFormSubmission(
        handleSubmit,
        isValid
    );

    /**
     * Expose hasChanges method to parent components
     * Allows parent to check for unsaved changes before navigation
     */
    useImperativeHandle(ref, () => ({
        hasChanges,
    }), [hasChanges]);

    /**
     * Loading state rendering
     * Accessible loading indicator with proper ARIA attributes
     */
    if (loading) {
        return (
            <FormLoadingState
                message="Caricamento impostazioni fiscali..."
                className={className}
            />
        );
    }

    /**
     * Generate unique IDs for accessibility
     */
    const errorId = error ? `${formId}-error` : undefined;

    return (
        <div
            className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}
            data-testid="tax-settings"
        >
            {/* Header Section */}
            <TaxSettingsHeader />

            {/* Content Section */}
            <div className="p-6">
                {/* Status Messages */}
                <StatusMessages
                    error={error || undefined}
                    success={success}
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
                            handleBatchChange={handleBatchChange}
                        />
                    </section>

                    {/* Submit Section */}
                    <FormSubmitSection
                        isSubmitting={isSubmitting}
                        isLoading={loading}
                        hasChanges={hasChanges()}
                        isValid={isValid()}
                    />
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