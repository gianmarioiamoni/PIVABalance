import React from 'react';
import { Tooltip } from '@/components/ui/Tooltip';
import { taxRegimeInfo, profitabilityInfo } from '@/components/tooltips/TooltipsText';
import { UserSettings } from '@/services/settingsService';

interface TaxableIncomeSectionProps {
  settings: UserSettings;
  handleChange: (field: keyof UserSettings, value: string | number | boolean) => void;
  setShowRateTable: (show: boolean) => void;
}

export const TaxableIncomeSection: React.FC<TaxableIncomeSectionProps> = ({
  settings,
  handleChange,
  setShowRateTable,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Parametri Calcolo Reddito Imponibile
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Imposta i parametri per il calcolo del reddito imponibile in base al tuo regime fiscale
        </p>
      </div>

      <div className="px-4 py-5 sm:p-6 space-y-6">
        <div>
          <div className="flex items-center">
            <label className="block text-sm font-medium text-gray-700">
              Regime Fiscale
            </label>
            <Tooltip content={taxRegimeInfo} />
          </div>
          <select
            value={settings.taxRegime}
            onChange={(e) => handleChange('taxRegime', e.target.value)}
            className="mt-2 block w-full pl-3 pr-10 py-2 text-base text-gray-900 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="forfettario">Regime Forfettario</option>
            <option value="ordinario">Regime Ordinario</option>
          </select>
        </div>

        {settings.taxRegime === 'forfettario' && (
          <>
            <div>
              <div className="flex items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Imposta Sostitutiva
                </label>
              </div>
                              <select
                value={settings.substituteRate}
                onChange={(e) => handleChange('substituteRate', Number(e.target.value))}
                className="mt-2 block w-full pl-3 pr-10 py-2 text-base text-gray-900 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value={5}>5% (primi 5 anni)</option>
                <option value={25}>25% (dal sesto anno)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Coefficiente di Redditività
                </label>
                <Tooltip content={profitabilityInfo} />
              </div>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="flex-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    value={settings.profitabilityRate}
                    readOnly
                    className="block w-full pl-3 pr-12 py-2 text-base text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRateTable(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Seleziona
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
