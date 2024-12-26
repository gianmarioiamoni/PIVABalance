import React, { useState, useEffect } from 'react';
import { UserSettings, settingsService } from '@/services/settingsService';
import { ProfessionalFund } from '@/services/professionalFundService';
import Tooltip from './Tooltip';
import ProfitabilityRateTable, { ProfitabilityRate } from './ProfitabilityRateTable';
import { PENSION_FUNDS, PensionSystemType } from '@/data/pensionFunds';
import ProfessionalFundSelector from './ProfessionalFundSelector';
import { taxRegimeInfo, profitabilityInfo, pensionSystemInfo } from './tooltips/TooltipsText';


export default function TaxSettings() {
  const [settings, setSettings] = useState<UserSettings>({
    taxRegime: 'forfettario',
    substituteRate: 5,
    profitabilityRate: 78,
    pensionSystem: 'INPS',
    professionalFundId: undefined,
    inpsRateType: undefined,
    manualContributionRate: undefined,
    manualMinimumContribution: undefined,
    manualFixedAnnualContributions: undefined
  });
  const [originalSettings, setOriginalSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showRateTable, setShowRateTable] = useState(false);
  const [selectedProfessionalFund, setSelectedProfessionalFund] = useState<ProfessionalFund | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const hasChanges = () => {
    if (!originalSettings) return false;
    return JSON.stringify(settings) !== JSON.stringify(originalSettings);
  };

  const isValid = () => {
    if (settings.pensionSystem === 'PROFESSIONAL_FUND' && !settings.professionalFundId) {
      return false;
    }
    return true;
  };

  const loadSettings = async () => {
    try {
      const userSettings = await settingsService.getUserSettings();
      setSettings(userSettings);
      setOriginalSettings(userSettings);
      setError(null);
    } catch (err) {
      setError('Errore nel caricamento delle impostazioni');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await settingsService.updateSettings(settings);
      setSuccess(true);
      setError(null);
      setOriginalSettings(settings);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Errore nel salvataggio delle impostazioni');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof UserSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'taxRegime' && value === 'ordinario' ? {
        substituteRate: undefined,
        profitabilityRate: undefined
      } : {})
    }));
  };

  const handleRateSelect = (rate: ProfitabilityRate) => {
    handleChange('profitabilityRate', rate.rate);
    setShowRateTable(false);
  };

  const handleProfessionalFundParametersChange = (params: {
    contributionRate: number;
    minimumContribution: number;
    fixedAnnualContributions: number
  }) => {
    setSettings(prev => ({
      ...prev,
      manualContributionRate: params.contributionRate,
      manualMinimumContribution: params.minimumContribution,
      manualFixedAnnualContributions: params.fixedAnnualContributions
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Impostazioni Fiscali</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Impostazioni salvate con successo!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
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
                className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
                    className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
                        className="block w-full pl-3 pr-12 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
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
                      Seleziona da Tabella
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('profitabilityRate', 78)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Reset (78%)
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Seleziona il coefficiente in base al tuo codice ATECO
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Parametri Calcolo Contributi Previdenziali
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Imposta i parametri per il calcolo dei contributi previdenziali
            </p>
          </div>

          <div className="px-4 py-5 sm:p-6 space-y-6">
            <div>
              <div className="flex items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Cassa Previdenziale
                </label>
                <Tooltip content={pensionSystemInfo} />
              </div>
              <select
                value={settings.pensionSystem}
                onChange={(e) => {
                  const value = e.target.value as PensionSystemType;
                  setSettings(prev => ({
                    ...prev,
                    pensionSystem: value,
                    professionalFundId: value === 'INPS' ? undefined : prev.professionalFundId
                  }));
                }}
                className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="INPS">Gestione Separata INPS</option>
                <option value="PROFESSIONAL_FUND">Cassa Professionale</option>
              </select>
            </div>

            {settings.pensionSystem === 'INPS' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo di Attività per Gestione Separata INPS
                </label>
                <select
                  value={settings.inpsRateType || ''}
                  onChange={(e) => handleChange('inpsRateType', e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="" disabled>Seleziona il tipo di attività...</option>
                  <option value="COLLABORATOR_WITH_DISCOLL">Collaboratori con DIS-COLL (35,03%)</option>
                  <option value="COLLABORATOR_WITHOUT_DISCOLL">Collaboratori senza DIS-COLL (33,72%)</option>
                  <option value="PROFESSIONAL">Professionisti senza altra copertura (26,07%)</option>
                  <option value="PENSIONER">Pensionati o con altra copertura (24,00%)</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Seleziona il tipo di attività per determinare l'aliquota contributiva corretta
                </p>
              </div>
            )}

            {settings.pensionSystem === 'PROFESSIONAL_FUND' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cassa Professionale
                </label>
                <ProfessionalFundSelector
                  value={settings.professionalFundId}
                  onChange={(fundId) => handleChange('professionalFundId', fundId)}
                  onFundChange={setSelectedProfessionalFund}
                  onParametersChange={handleProfessionalFundParametersChange}
                  error={settings.pensionSystem === 'PROFESSIONAL_FUND' && !settings.professionalFundId ? 'Seleziona una cassa professionale' : undefined}
                  initialManualValues={{
                    manualContributionRate: settings.manualContributionRate,
                    manualMinimumContribution: settings.manualMinimumContribution,
                    manualFixedAnnualContributions: settings.manualFixedAnnualContributions
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !hasChanges() || !isValid()}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Salvataggio...' : 'Salva Impostazioni'}
          </button>
        </div>
      </form>

      {showRateTable && (
        <ProfitabilityRateTable
          onSelect={handleRateSelect}
          selectedRate={settings.profitabilityRate}
          onClose={() => setShowRateTable(false)}
        />
      )}
    </div>
  );
}
