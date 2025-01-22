import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import ProfitabilityRateTable from '@/components/tax-settings/ProfitabilityRateTable';
import { useTaxSettingsContext } from '@/contexts/TaxSettingsContext';
import { StatusMessages } from '@/components/tax-settings/StatusMessages';
import { NavigationHandler } from '@/components/tax-settings/NavigationHandler';
import { TaxableIncomeSection } from '@/components/tax-settings/TaxableIncomeSection';
import { PensionContributionsSection } from '@/components/tax-settings/PensionContributionsSection';
import { UserSettings } from '@/services/settingsService';
import { professionalFundService } from '@/services/professionalFundService';

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
    const [localSettings, setLocalSettings] = useState<UserSettings | null>(null);

    const {
      settings,
      loading,
      error,
      success,
      showRateTable,
      updateSettings,
      setShowRateTable,
    } = useTaxSettingsContext();

    // Initialize local settings when settings are loaded
    useEffect(() => {
      if (settings && !localSettings) {
        setLocalSettings(settings);
      }
    }, [settings]);

    const hasChanges = () => {
      if (!settings || !localSettings) return false;
      return JSON.stringify(settings) !== JSON.stringify(localSettings);
    };

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

    const handleChange = async (field: keyof UserSettings, value: any) => {
      if (!localSettings) return;
      
      if (field === "professionalFundId" && value) {
        try {
          const fund = await professionalFundService.getFundByCode(value);
          const params = professionalFundService.getCurrentParameters(fund);
          if (params) {
            setLocalSettings(prev => ({
              ...prev!,
              [field]: value,
              manualContributionRate: params.contributionRate,
              manualMinimumContribution: params.minimumContribution,
              manualFixedAnnualContributions: params.fixedAnnualContributions,
            }));
            return;
          }
        } catch (error) {
          console.error("Error fetching professional fund parameters:", error);
        }
      }

      setLocalSettings(prev => ({
        ...prev!,
        [field]: value,
        ...(field === "taxRegime" && value === "ordinario"
          ? {
              substituteRate: undefined,
              profitabilityRate: undefined,
            }
          : {}),
      }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!localSettings) return;
      await updateSettings(localSettings);
    };

    if (loading || !localSettings) {
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
            settings={localSettings}
            handleChange={handleChange}
            setShowRateTable={setShowRateTable}
          />

          <PensionContributionsSection
            settings={localSettings}
            handleChange={handleChange}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !hasChanges()}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Salva Modifiche
            </button>
          </div>
        </form>

        {showRateTable && (
          <ProfitabilityRateTable
            onSelect={(rate) => handleChange('profitabilityRate', rate.rate)}
            onClose={() => setShowRateTable(false)}
          />
        )}
      </div>
    );
  }
);

export default TaxSettings;
