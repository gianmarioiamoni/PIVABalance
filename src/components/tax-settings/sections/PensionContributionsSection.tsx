'use client';

import React, { useCallback } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

import { Tooltip } from '@/components/ui/Tooltip';
import { pensionSystemInfo } from '@/components/tooltips/TooltipsText';
import { UserSettings } from '@/services/settingsService';
import { PENSION_SYSTEMS, PensionSystemType } from '@/data/pensionFunds';
import ProfessionalFundSelector from '../professional-fund/ProfessionalFundSelector';
import { InpsRateSelector } from '../inps/InpsRateSelector';

interface PensionContributionsSectionProps {
  settings: UserSettings;
  handleChange: (field: keyof UserSettings, value: string | number | boolean | undefined) => Promise<void>;
}

export const PensionContributionsSection: React.FC<PensionContributionsSectionProps> = React.memo(({
  settings,
  handleChange,
}) => {
  // Memoized callback to prevent infinite loops
  const handleParametersChange = useCallback((params: any) => {
    if (params) {
      handleChange('manualContributionRate', params.contributionRate);
      handleChange('manualMinimumContribution', params.minimumContribution);
      handleChange('manualFixedAnnualContributions', params.fixedAnnualContributions);
    } else {
      handleChange('manualContributionRate', undefined);
      handleChange('manualMinimumContribution', undefined);
      handleChange('manualFixedAnnualContributions', undefined);
    }
  }, [handleChange]);
  return (
    <div className="space-y-6">
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
          Sistema Pensionistico
          <Tooltip content={pensionSystemInfo}>
            <InformationCircleIcon className="ml-1 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
          </Tooltip>
        </label>

        <div className="space-y-3">
          {/* Pension System Selection */}
          {Object.values(PENSION_SYSTEMS).map((system) => (
            <label
              key={system.id}
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <input
                type="radio"
                name="pensionSystem"
                value={system.id}
                checked={settings.pensionSystem === system.id}
                onChange={(e) => handleChange('pensionSystem', e.target.value as PensionSystemType)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
              />
              <div className="ml-3">
                <div className="font-medium text-gray-900">{system.name}</div>
                <div className="text-sm text-gray-500">{system.description}</div>
              </div>
            </label>
          ))}
        </div>

        {/* INPS Rate Selection */}
        {settings.pensionSystem === 'INPS' && (
          <div className="mt-4">
            <InpsRateSelector
              value={settings.inpsRateType}
              onChange={(type, rate, minContribution) => {
                handleChange('inpsRateType', type);
                handleChange('manualContributionRate', rate);
                handleChange('manualMinimumContribution', minContribution);
                handleChange('manualFixedAnnualContributions', 0);
              }}
            />
          </div>
        )}

        {/* Professional Fund Selection */}
        {settings.pensionSystem === 'PROFESSIONAL_FUND' && (
          <div className="mt-4">
            <ProfessionalFundSelector
              value={settings.professionalFundId}
              onChange={(fundId) => handleChange('professionalFundId', fundId)}
              onFundChange={(fund) => {
                // Fund change is handled by the component internally
                console.warn('Selected fund:', fund);
              }}
              onParametersChange={handleParametersChange}
              aria-describedby="professional-fund-description"
            />
            <div id="professional-fund-description" className="sr-only">
              Seleziona la cassa professionale per la gestione dei contributi previdenziali
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

PensionContributionsSection.displayName = 'PensionContributionsSection';
