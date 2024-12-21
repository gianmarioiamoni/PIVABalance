import React, { useState, useEffect } from 'react';
import { UserSettings, settingsService } from '@/services/settingsService';
import Tooltip from './Tooltip';
import ProfitabilityRateTable, { ProfitabilityRate } from './ProfitabilityRateTable';

const taxRegimeInfo = (
  <div className="space-y-4">
    <div>
      <h4 className="font-semibold mb-2">Regime forfettario:</h4>
      <ul className="list-disc pl-4 space-y-2">
        <li>Reddito imponibile calcolato come percentuale dei ricavi (determinata dal coefficiente di redditività).</li>
        <li>Imposta sostitutiva al 15% (ridotta al 5% per i primi 5 anni, se soddisfi determinati requisiti).</li>
        <li>Esenzione IVA: non applichi l'IVA sulle fatture emesse, ma non puoi detrarre quella sugli acquisti.</li>
        <li>Limiti: ricavi fino a 85.000€ annui (dal 2023).</li>
      </ul>
    </div>
    <div>
      <h4 className="font-semibold mb-2">Regime ordinario:</h4>
      <ul className="list-disc pl-4 space-y-2">
        <li>Reddito imponibile = Ricavi - Costi deducibili.</li>
        <li>Tassazione basata sull'IRPEF a scaglioni.</li>
        <li>Applicazione e gestione dell'IVA su fatture emesse e ricevute (con possibilità di detrazione dell'IVA sugli acquisti).</li>
        <li>Obbligo di tenuta della contabilità completa (registri IVA, libro giornale, ecc.).</li>
      </ul>
    </div>
  </div>
);

const profitabilityInfo = (
  <div className="space-y-2">
    <p>
      Il coefficiente di redditività serve a determinare la parte del fatturato che viene considerata "reddito imponibile" 
      su cui calcolare le imposte (imposta sostitutiva) e i contributi previdenziali.
    </p>
    <p>
      Ogni attività economica ha un coefficiente di redditività specifico, stabilito in base al codice ATECO che 
      identifica la tua attività. Questo coefficiente rappresenta la percentuale del fatturato considerata 
      effettivamente come "utile" ai fini fiscali.
    </p>
    <p>
      Il restante fatturato viene invece considerato una stima forfettaria dei costi di esercizio e non è tassato.
    </p>
    <p className="font-medium mt-2">
      Clicca "Seleziona da Tabella" per visualizzare tutti i coefficienti per categoria ATECO.
    </p>
  </div>
);

export default function TaxSettings() {
  const [settings, setSettings] = useState<UserSettings>({
    taxRegime: 'forfettario',
    substituteRate: 5,
    profitabilityRate: 78,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showRateTable, setShowRateTable] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const userSettings = await settingsService.getUserSettings();
      setSettings(userSettings);
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

      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
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
