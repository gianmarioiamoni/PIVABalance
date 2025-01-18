import React, { forwardRef, useImperativeHandle, useState } from 'react';
import ProfitabilityRateTable from './ProfitabilityRateTable';
import { useTaxSettings } from '@/hooks/useTaxSettings';
import { StatusMessages } from './tax-settings/StatusMessages';
import { NavigationHandler } from './tax-settings/NavigationHandler';
import { TaxableIncomeSection } from './tax-settings/TaxableIncomeSection';
import { PensionContributionsSection } from './tax-settings/PensionContributionsSection';

interface TaxSettingsProps {
  activeTab: string;
  attemptedTab: string | undefined;
  onTabChange: (newTab: string) => void;
  onCancelTabChange: () => void;
}

const TaxSettings = forwardRef<{ hasChanges: () => boolean }, TaxSettingsProps>(
  ({ activeTab, attemptedTab, onTabChange, onCancelTabChange }, ref) => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<string | undefined>(undefined);

    const {
      state: { settings, loading, error, success, showRateTable },
      actions: {
        handleChange,
        handleSubmit,
        handleRateSelect,
        setShowRateTable,
        hasChanges,
        isValid
      }
    } = useTaxSettings();

    useImperativeHandle(ref, () => ({
      hasChanges
    }));

    const handleConfirmNavigation = async () => {
      setShowConfirmDialog(false);
      if (pendingNavigation) {
        if (pendingNavigation.startsWith('tab:')) {
          const newTab = pendingNavigation.replace('tab:', '');
          onTabChange(newTab);
        }
        setPendingNavigation(undefined);
      }
    };

    const handleCancelNavigation = () => {
      setShowConfirmDialog(false);
      setPendingNavigation(undefined);
      onCancelTabChange();
    };

    if (loading) {
      return (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return (
      <div data-tax-settings className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Impostazioni Fiscali</h2>

        <StatusMessages error={error || undefined} success={success} />

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

        <form onSubmit={handleSubmit} className="space-y-8">
          <TaxableIncomeSection
            settings={settings}
            handleChange={handleChange}
            setShowRateTable={setShowRateTable}
          />

          <PensionContributionsSection
            settings={settings}
            handleChange={handleChange}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !hasChanges() || !isValid()}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Salva Modifiche
            </button>
          </div>
        </form>

        {showRateTable && (
          <ProfitabilityRateTable
            onSelect={handleRateSelect}
            onClose={() => setShowRateTable(false)}
          />
        )}
      </div>
    );
  }
);

export default TaxSettings;
