import React from 'react';
import { Tooltip } from '@/components/ui';
import { taxRegimeInfo, profitabilityInfo } from '@/components/tooltips/TooltipsText';

// Define UserSettings interface locally until the shared types are available
interface UserSettings {
    taxRegime: string;
    substituteRate: number;
    profitabilityRate: number;
}

interface TaxableIncomeSectionProps {
    settings: UserSettings;
    handleChange: (field: keyof UserSettings, value: any) => void;
    setShowRateTable: (show: boolean) => void;
}

/**
 * TaxableIncomeSection Component
 * Manages tax regime settings and profitability rate configuration
 * Supports both "forfettario" and "ordinario" tax regimes
 */
export const TaxableIncomeSection: React.FC<TaxableIncomeSectionProps> = ({
    settings,
    handleChange,
    setShowRateTable,
}) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            {/* Header Section */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                    Parametri Calcolo Reddito Imponibile
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                    Configura i parametri per il calcolo del reddito imponibile in base al tuo regime fiscale
                </p>
            </div>

            {/* Form Content */}
            <div className="px-6 py-6 space-y-6">
                {/* Tax Regime Selection */}
                <div>
                    <div className="flex items-center mb-3">
                        <label
                            htmlFor="tax-regime"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Regime Fiscale
                        </label>
                        <Tooltip content={taxRegimeInfo} />
                    </div>
                    <select
                        id="tax-regime"
                        value={settings.taxRegime}
                        onChange={(e) => handleChange('taxRegime', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors sm:text-sm"
                        aria-describedby="tax-regime-help"
                    >
                        <option value="forfettario">Regime Forfettario</option>
                        <option value="ordinario">Regime Ordinario</option>
                    </select>
                    <p id="tax-regime-help" className="mt-1 text-xs text-gray-500">
                        Seleziona il regime fiscale applicabile alla tua attività
                    </p>
                </div>

                {/* Forfettario-specific fields */}
                {settings.taxRegime === 'forfettario' ? (
                    <div className="space-y-6">
                        {/* Substitute Tax Rate */}
                        <div>
                            <label
                                htmlFor="substitute-rate"
                                className="block text-sm font-medium text-gray-700 mb-3"
                            >
                                Imposta Sostitutiva
                            </label>
                            <select
                                id="substitute-rate"
                                value={settings.substituteRate}
                                onChange={(e) => handleChange('substituteRate', Number(e.target.value))}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors sm:text-sm"
                                aria-describedby="substitute-rate-help"
                            >
                                <option value={5}>5% (primi 5 anni con agevolazioni)</option>
                                <option value={15}>15% (dal sesto anno o senza agevolazioni)</option>
                            </select>
                            <p id="substitute-rate-help" className="mt-1 text-xs text-gray-500">
                                Aliquota dell'imposta sostitutiva applicabile
                            </p>
                        </div>

                        {/* Profitability Rate */}
                        <div>
                            <div className="flex items-center mb-3">
                                <label
                                    htmlFor="profitability-rate"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Coefficiente di Redditività
                                </label>
                                <Tooltip content={profitabilityInfo} />
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                                <div className="flex-1">
                                    <div className="relative rounded-md shadow-sm">
                                        <input
                                            id="profitability-rate"
                                            type="number"
                                            value={settings.profitabilityRate}
                                            readOnly
                                            className="block w-full px-3 py-2 pr-12 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            aria-describedby="profitability-rate-help"
                                            step="0.01"
                                            min="0"
                                            max="100"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <span className="text-gray-500 text-sm" aria-hidden="true">%</span>
                                        </div>
                                    </div>
                                    <p id="profitability-rate-help" className="mt-1 text-xs text-gray-500">
                                        Percentuale del fatturato considerata reddito imponibile
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowRateTable(true)}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    aria-describedby="select-rate-help"
                                >
                                    Seleziona da Tabella
                                </button>
                            </div>
                            <p id="select-rate-help" className="mt-1 text-xs text-gray-500">
                                Apri la tabella per selezionare il coefficiente corretto per la tua attività ATECO
                            </p>
                        </div>
                    </div>
                ) : null}

                {/* Ordinario regime info */}
                {settings.taxRegime === 'ordinario' ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h4 className="text-sm font-medium text-blue-800">
                                    Regime Ordinario Selezionato
                                </h4>
                                <p className="mt-1 text-sm text-blue-700">
                                    Nel regime ordinario, il reddito imponibile viene calcolato come differenza
                                    tra ricavi e costi deducibili. Non sono necessari ulteriori parametri in questa sezione.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}; 