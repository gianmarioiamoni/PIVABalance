'use client';

import React, { useState } from 'react';
import { useCookieConsent, CookieConsent } from '@/hooks/useCookieConsent';
import {
    ShieldCheckIcon,
    ChartBarIcon,
    MegaphoneIcon,
    WrenchScrewdriverIcon,
    TrashIcon,
    EyeIcon,
    DocumentArrowDownIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

/**
 * Cookie Settings Component
 * 
 * Allows users to manage their cookie preferences from the account settings.
 * Provides detailed information about each cookie category and current status.
 */
export const CookieSettings: React.FC = () => {
    const {
        hasConsent,
        preferences,
        consentDate,
        savePreferences,
        clearConsent,
        reopenBanner,
        getConsentAuditTrail,
        exportConsentAudit,
    } = useCookieConsent();

    const [tempPreferences, setTempPreferences] = useState<CookieConsent>(preferences);
    const [showDetails, setShowDetails] = useState(false);
    const [showAuditTrail, setShowAuditTrail] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [auditTrail, setAuditTrail] = useState<Array<Record<string, unknown>>>([]);

    const handleToggleCategory = (category: keyof CookieConsent) => {
        if (category === 'necessary') return; // Cannot disable necessary cookies

        setTempPreferences(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const handleSavePreferences = async () => {
        setIsSaving(true);
        try {
            savePreferences(tempPreferences);
            // Brief delay for UX feedback
            await new Promise(resolve => setTimeout(resolve, 500));
        } finally {
            setIsSaving(false);
        }
    };

    const handleClearConsent = () => {
        if (confirm('Sei sicuro di voler eliminare tutte le preferenze sui cookie? Dovrai fornire nuovamente il consenso.')) {
            clearConsent();
        }
    };

    const handleShowBanner = () => {
        reopenBanner();
    };

    const handleLoadAuditTrail = () => {
        const trail = getConsentAuditTrail();
        setAuditTrail(trail);
        setShowAuditTrail(true);
    };

    const handleExportAudit = () => {
        exportConsentAudit();
    };

    const formatTimestamp = (timestamp: string) => {
        return new Date(timestamp).toLocaleString('it-IT', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getActionLabel = (action: string) => {
        switch (action) {
            case 'consent_given': return 'Consenso dato';
            case 'consent_updated': return 'Consenso aggiornato';
            case 'consent_revoked': return 'Consenso revocato';
            default: return action;
        }
    };

    const cookieCategories = [
        {
            key: 'necessary' as const,
            icon: ShieldCheckIcon,
            title: 'Cookie Necessari',
            description: 'Cookie essenziali per il funzionamento del sito web. Non possono essere disabilitati.',
            details: [
                'Cookie di autenticazione e sessione',
                'Cookie di sicurezza CSRF',
                'Cookie per le preferenze di accessibilità',
                'Cookie per il carrello e-commerce (se applicabile)'
            ],
            required: true,
            color: 'text-green-600 bg-green-50 border-green-200'
        },
        {
            key: 'functional' as const,
            icon: WrenchScrewdriverIcon,
            title: 'Cookie Funzionali',
            description: 'Migliorano l\'esperienza utente con funzionalità avanzate e personalizzazioni.',
            details: [
                'Preferenze di layout e tema',
                'Impostazioni dashboard personalizzate',
                'Preferenze di lingua e localizzazione',
                'Stato dei componenti UI (sidebar, modali, ecc.)'
            ],
            required: false,
            color: 'text-blue-600 bg-blue-50 border-blue-200'
        },
        {
            key: 'analytics' as const,
            icon: ChartBarIcon,
            title: 'Cookie Analitici',
            description: 'Raccolgono informazioni anonime su come i visitatori utilizzano il sito.',
            details: [
                'Google Analytics per statistiche di utilizzo',
                'Monitoraggio delle performance delle pagine',
                'Analisi dei percorsi di navigazione',
                'Statistiche di errori e crash reporting'
            ],
            required: false,
            color: 'text-purple-600 bg-purple-50 border-purple-200'
        },
        {
            key: 'marketing' as const,
            icon: MegaphoneIcon,
            title: 'Cookie di Marketing',
            description: 'Utilizzati per personalizzare la pubblicità e tracciare l\'efficacia delle campagne.',
            details: [
                'Cookie per pubblicità personalizzata',
                'Pixel di tracciamento social media',
                'Cookie di remarketing e retargeting',
                'Analisi delle conversioni pubblicitarie'
            ],
            required: false,
            color: 'text-orange-600 bg-orange-50 border-orange-200'
        }
    ];

    const hasChanges = JSON.stringify(preferences) !== JSON.stringify(tempPreferences);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                    Impostazioni Cookie
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                    Gestisci le tue preferenze sui cookie e la privacy. Le modifiche si applicano immediatamente.
                </p>
            </div>

            {/* Current Status */}
            <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-gray-900">
                            Stato Attuale del Consenso
                        </h3>
                        <div className="text-sm text-gray-600 mt-1">
                            {hasConsent ? (
                                <>
                                    ✅ Consenso fornito il{' '}
                                    {consentDate?.toLocaleDateString('it-IT', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </>
                            ) : (
                                '❌ Nessun consenso fornito'
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleShowBanner}
                            className="btn-secondary flex items-center text-sm"
                        >
                            <EyeIcon className="h-4 w-4 mr-2" />
                            Mostra Banner
                        </button>
                        <button
                            onClick={handleClearConsent}
                            className="btn-danger flex items-center text-sm"
                        >
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Elimina Consenso
                        </button>
                    </div>
                </div>
            </div>

            {/* Cookie Categories */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                        Categorie di Cookie
                    </h3>
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                        {showDetails ? 'Nascondi dettagli' : 'Mostra dettagli'}
                    </button>
                </div>

                <div className="grid gap-4">
                    {cookieCategories.map((category) => {
                        const Icon = category.icon;
                        const isEnabled = tempPreferences[category.key];

                        return (
                            <div
                                key={category.key}
                                className={`p-4 rounded-lg border-2 transition-all ${isEnabled
                                    ? category.color
                                    : 'bg-gray-50 border-gray-200'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3 flex-1">
                                        <Icon className={`h-5 w-5 mt-1 flex-shrink-0 ${isEnabled ? category.color.split(' ')[0] : 'text-gray-400'
                                            }`} />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="font-medium text-gray-900">
                                                    {category.title}
                                                </h4>
                                                {category.required && (
                                                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                                        Richiesto
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {category.description}
                                            </p>

                                            {showDetails && (
                                                <div className="mt-3 p-3 bg-white bg-opacity-50 rounded border">
                                                    <h5 className="text-xs font-medium text-gray-700 mb-2">
                                                        Dettagli tecnici:
                                                    </h5>
                                                    <ul className="text-xs text-gray-600 space-y-1">
                                                        {category.details.map((detail, index) => (
                                                            <li key={index} className="flex items-start">
                                                                <span className="text-gray-400 mr-2">•</span>
                                                                {detail}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0 ml-4">
                                        <button
                                            onClick={() => handleToggleCategory(category.key)}
                                            disabled={category.required}
                                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isEnabled
                                                ? 'bg-blue-600'
                                                : 'bg-gray-200'
                                                } ${category.required ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                            role="switch"
                                            aria-checked={isEnabled}
                                            aria-label={`${isEnabled ? 'Disabilita' : 'Abilita'} ${category.title}`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isEnabled ? 'translate-x-5' : 'translate-x-0'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Save Actions */}
            {hasChanges && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-blue-900">
                                Modifiche non salvate
                            </h4>
                            <p className="text-sm text-blue-700 mt-1">
                                Hai modificato le tue preferenze sui cookie. Salva per applicare le modifiche.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setTempPreferences(preferences)}
                                className="btn-secondary text-sm"
                                disabled={isSaving}
                            >
                                Annulla
                            </button>
                            <button
                                onClick={handleSavePreferences}
                                className="btn-primary text-sm"
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Salvando...
                                    </div>
                                ) : (
                                    'Salva Preferenze'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Audit Trail Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h4 className="font-medium text-gray-900 flex items-center">
                            <ClockIcon className="h-5 w-5 text-gray-600 mr-2" />
                            Cronologia Consensi (Audit Trail)
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                            Registro delle tue azioni sui cookie per conformità GDPR
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleLoadAuditTrail}
                            className="btn-secondary text-sm flex items-center"
                        >
                            <EyeIcon className="h-4 w-4 mr-2" />
                            {showAuditTrail ? 'Nascondi' : 'Visualizza'}
                        </button>
                        <button
                            onClick={handleExportAudit}
                            className="btn-primary text-sm flex items-center"
                        >
                            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                            Export
                        </button>
                    </div>
                </div>

                {showAuditTrail && (
                    <div className="border-t border-gray-200 pt-4">
                        {auditTrail.length > 0 ? (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {auditTrail.slice().reverse().map((entry, index) => {
                                    const entryId = (entry as { id?: string }).id;
                                    const action = (entry as { action?: string }).action || '';
                                    const timestamp = (entry as { timestamp?: string }).timestamp || '';
                                    const preferences = (entry as { preferences?: { functional?: boolean; analytics?: boolean; marketing?: boolean } }).preferences;
                                    const version = (entry as { version?: string }).version || '1.0';

                                    return (
                                        <div key={entryId || index} className="bg-gray-50 rounded p-3 text-sm">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900">
                                                        {getActionLabel(action)}
                                                    </div>
                                                    <div className="text-gray-600 mt-1">
                                                        {formatTimestamp(timestamp)}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Necessari: ✓ |
                                                        Funzionali: {preferences?.functional ? '✓' : '✗'} |
                                                        Analytics: {preferences?.analytics ? '✓' : '✗'} |
                                                        Marketing: {preferences?.marketing ? '✓' : '✗'}
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-400 ml-4">
                                                    v{version}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                <ClockIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p>Nessuna azione registrata</p>
                                <p className="text-xs mt-1">Le azioni sui cookie verranno registrate qui</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Legal Information */}
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                <h4 className="font-medium text-gray-900 mb-2">
                    Informazioni Legali
                </h4>
                <p className="mb-2">
                    Questo sito è conforme al Regolamento Generale sulla Protezione dei Dati (GDPR)
                    e alla normativa italiana sui cookie (D.Lgs. 196/2003 e successive modifiche).
                </p>
                <p>
                    Per maggiori informazioni consulta la nostra{' '}
                    <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800 underline">
                        Informativa sulla Privacy
                    </a>
                    {' '}e la{' '}
                    <a href="/cookie-policy" className="text-blue-600 hover:text-blue-800 underline">
                        Cookie Policy
                    </a>.
                </p>
            </div>
        </div>
    );
};
