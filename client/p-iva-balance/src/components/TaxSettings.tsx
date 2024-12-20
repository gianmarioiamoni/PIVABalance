import React, { useState, useEffect } from 'react';
import { UserSettings, settingsService } from '@/services/settingsService';

export default function TaxSettings() {
  const [settings, setSettings] = useState<UserSettings>({
    taxRegime: 'forfettario',
    substituteRate: 5,
    profitabilityRate: 78,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Regime Fiscale
          </label>
          <select
            value={settings.taxRegime}
            onChange={(e) => handleChange('taxRegime', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="forfettario">Regime Forfettario</option>
            <option value="ordinario">Regime Ordinario</option>
          </select>
        </div>

        {settings.taxRegime === 'forfettario' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imposta Sostitutiva
              </label>
              <select
                value={settings.substituteRate}
                onChange={(e) => handleChange('substituteRate', Number(e.target.value))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value={5}>5% (primi 5 anni)</option>
                <option value={25}>25% (dal sesto anno)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coefficiente di Redditività (%)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={settings.profitabilityRate}
                  onChange={(e) => handleChange('profitabilityRate', Number(e.target.value))}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  placeholder="78"
                />
                <button
                  type="button"
                  onClick={() => handleChange('profitabilityRate', 78)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Reset (78%)
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Valore predefinito: 78%. Modificare solo se necessario.
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
    </div>
  );
}
