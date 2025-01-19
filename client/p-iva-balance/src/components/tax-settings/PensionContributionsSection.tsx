import React from 'react';
import Tooltip from '../Tooltip';
import { pensionSystemInfo } from '../tooltips/TooltipsText';
import { UserSettings } from '@/services/settingsService';
import { PENSION_SYSTEMS, PensionSystemType, PROFESSIONAL_FUNDS } from '@/data/pensionFunds';
import ProfessionalFundSelector from './ProfessionalFundSelector';
import { InpsRateSelector } from './InpsRateSelector';
import { professionalFundService } from '@/services/professionalFundService';

interface PensionContributionsSectionProps {
  settings: UserSettings;
  handleChange: (field: keyof UserSettings, value: any) => void;
}

export const PensionContributionsSection: React.FC<PensionContributionsSectionProps> = ({
  settings,
  handleChange,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Parametri Calcolo Contributi Previdenziali
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Imposta i parametri per il calcolo dei contributi previdenziali in base al tuo sistema previdenziale
        </p>
      </div>

      <div className="px-4 py-5 sm:p-6 space-y-6">
        <div>
          <div className="flex items-center">
            <label className="block text-sm font-medium text-gray-700">
              Sistema Previdenziale
            </label>
            <Tooltip content={pensionSystemInfo} />
          </div>
          <select
            value={settings.pensionSystem}
            onChange={(e) => handleChange('pensionSystem', e.target.value as PensionSystemType)}
            className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {Object.entries(PENSION_SYSTEMS).map(([key, { name }]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {settings.pensionSystem === 'INPS' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo di Contribuente
              </label>
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
          </>
        )}

        {settings.pensionSystem === 'PROFESSIONAL_FUND' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cassa Professionale
            </label>
            <ProfessionalFundSelector
              value={settings.professionalFundId}
              onChange={(fundId) => handleChange('professionalFundId', fundId)}
              onFundChange={(fund) => {
                if (fund) {
                  const params = professionalFundService.getCurrentParameters(fund);
                  if (params) {
                    handleChange('manualContributionRate', params.contributionRate);
                    handleChange('manualMinimumContribution', params.minimumContribution);
                    handleChange('manualFixedAnnualContributions', params.fixedAnnualContributions);
                  }
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
