import React from 'react';
import { Tooltip } from '@/components/ui';
import { pensionSystemInfo, professionalFundInfo } from '@/components/tooltips/TooltipsText';
import { InpsRateSelector } from './InpsRateSelector';

// Pension System Types
export type PensionSystemType = 'INPS' | 'PROFESSIONAL_FUND';

export const PENSION_SYSTEMS = {
    INPS: {
        name: 'Gestione Separata INPS',
        description: 'Sistema previdenziale INPS per liberi professionisti'
    },
    PROFESSIONAL_FUND: {
        name: 'Cassa Professionale',
        description: 'Cassa di previdenza professionale dedicata'
    }
} as const;

// Temporary UserSettings interface - should come from shared types
interface UserSettings {
    pensionSystem: PensionSystemType;
    inpsRateType?: string;
    professionalFundId?: string;
    manualContributionRate?: number;
    manualMinimumContribution?: number;
    manualFixedAnnualContributions?: number;
}

interface PensionContributionsSectionProps {
    settings: UserSettings;
    handleChange: (field: keyof UserSettings, value: any) => void;
}

/**
 * PensionContributionsSection Component
 * Manages pension contribution settings for both INPS and Professional Funds
 * Allows users to select their pension system and configure contribution parameters
 */
export const PensionContributionsSection: React.FC<PensionContributionsSectionProps> = ({
    settings,
    handleChange,
}) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            {/* Header Section */}
            <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                    Parametri Calcolo Contributi Previdenziali
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                    Configura i parametri per il calcolo dei contributi previdenziali in base al tuo sistema previdenziale
                </p>
            </div>

            {/* Form Content */}
            <div className="px-6 py-6 space-y-6">
                {/* Pension System Selection */}
                <div>
                    <div className="flex items-center mb-3">
                        <label
                            htmlFor="pension-system"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Sistema Previdenziale
                        </label>
                        <Tooltip content={pensionSystemInfo} />
                    </div>

                    <select
                        id="pension-system"
                        value={settings.pensionSystem}
                        onChange={(e) => handleChange('pensionSystem', e.target.value as PensionSystemType)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors sm:text-sm"
                        aria-describedby="pension-system-help"
                    >
                        {Object.entries(PENSION_SYSTEMS).map(([key, { name }]) => (
                            <option key={key} value={key}>
                                {name}
                            </option>
                        ))}
                    </select>

                    <p id="pension-system-help" className="mt-1 text-xs text-gray-500">
                        Seleziona il sistema previdenziale al quale sei iscritto
                    </p>
                </div>

                {/* INPS Section */}
                {settings.pensionSystem === 'INPS' ? (
                    <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-blue-900 mb-2">
                                Gestione Separata INPS
                            </h4>
                            <p className="text-sm text-blue-800 mb-3">
                                Sistema previdenziale per liberi professionisti senza cassa dedicata
                            </p>
                        </div>

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
                ) : null}

                {/* Professional Fund Section */}
                {settings.pensionSystem === 'PROFESSIONAL_FUND' ? (
                    <div className="space-y-4">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h4 className="text-sm font-semibold text-amber-900">
                                        Cassa Professionale - In Sviluppo
                                    </h4>
                                    <p className="text-sm text-amber-800 mt-1">
                                        La gestione delle casse professionali sarà disponibile nella prossima versione.
                                        Per ora puoi inserire manualmente i parametri contributivi.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Manual Parameters Section */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-900 mb-4">
                                Parametri Manuali Temporanei
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="contribution-rate" className="block text-sm font-medium text-gray-700 mb-1">
                                        Aliquota Contributiva (%)
                                    </label>
                                    <input
                                        id="contribution-rate"
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="100"
                                        value={settings.manualContributionRate || ''}
                                        onChange={(e) => handleChange('manualContributionRate', parseFloat(e.target.value) || 0)}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        placeholder="Es. 18.5"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="minimum-contribution" className="block text-sm font-medium text-gray-700 mb-1">
                                        Contributo Minimo (€)
                                    </label>
                                    <input
                                        id="minimum-contribution"
                                        type="number"
                                        step="1"
                                        min="0"
                                        value={settings.manualMinimumContribution || ''}
                                        onChange={(e) => handleChange('manualMinimumContribution', parseInt(e.target.value) || 0)}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        placeholder="Es. 3000"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="fixed-contributions" className="block text-sm font-medium text-gray-700 mb-1">
                                        Contributi Fissi (€)
                                    </label>
                                    <input
                                        id="fixed-contributions"
                                        type="number"
                                        step="1"
                                        min="0"
                                        value={settings.manualFixedAnnualContributions || ''}
                                        onChange={(e) => handleChange('manualFixedAnnualContributions', parseInt(e.target.value) || 0)}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        placeholder="Es. 500"
                                    />
                                </div>
                            </div>

                            <p className="mt-2 text-xs text-gray-500">
                                Inserisci i parametri della tua cassa professionale. Questi valori verranno utilizzati
                                per calcolare i contributi previdenziali.
                            </p>
                        </div>
                    </div>
                ) : null}

                {/* Additional Info */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h4 className="text-sm font-medium text-gray-900">
                                Informazioni Importanti
                            </h4>
                            <div className="mt-1 text-sm text-gray-600">
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>I parametri contributivi vengono aggiornati annualmente dagli enti previdenziali</li>
                                    <li>Verifica sempre i valori correnti sul sito ufficiale del tuo ente previdenziale</li>
                                    <li>L'iscrizione alla cassa professionale è obbligatoria per determinate professioni</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 