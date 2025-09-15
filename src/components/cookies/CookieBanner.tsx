'use client';

import React, { useState } from 'react';
import { useCookieConsent, CookieConsent } from '@/hooks/useCookieConsent';
import {
    XMarkIcon,
    CogIcon,
    ShieldCheckIcon,
    ChartBarIcon,
    MegaphoneIcon,
    WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

/**
 * Cookie Banner Component
 * 
 * GDPR-compliant cookie consent banner for Italian market.
 * 
 * Features:
 * - Granular cookie category control
 * - Compliant with Italian Cookie Law and GDPR
 * - Responsive design
 * - Accessible with keyboard navigation
 * - Clear cookie policy information
 */
export const CookieBanner: React.FC = () => {
    const {
        showBanner: shouldShow,
        preferences,
        acceptAll,
        acceptNecessaryOnly,
        savePreferences,
        hideBanner,
    } = useCookieConsent();

    const [showDetails, setShowDetails] = useState(false);
    const [tempPreferences, setTempPreferences] = useState<CookieConsent>(preferences);

    // Don't render if banner should not be shown
    if (!shouldShow) return null;

    const handleToggleCategory = (category: keyof CookieConsent) => {
        if (category === 'necessary') return; // Cannot disable necessary cookies
        
        setTempPreferences(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const handleSavePreferences = () => {
        savePreferences(tempPreferences);
    };

    const handleAcceptAll = () => {
        acceptAll();
    };

    const handleAcceptNecessary = () => {
        acceptNecessaryOnly();
    };

    const cookieCategories = [
        {
            key: 'necessary' as const,
            icon: ShieldCheckIcon,
            title: 'Cookie Necessari',
            description: 'Questi cookie sono essenziali per il funzionamento del sito web e non possono essere disabilitati.',
            examples: 'Autenticazione, sicurezza, preferenze di base',
            required: true,
            color: 'text-green-600 bg-green-50 border-green-200'
        },
        {
            key: 'functional' as const,
            icon: WrenchScrewdriverIcon,
            title: 'Cookie Funzionali',
            description: 'Questi cookie permettono funzionalità avanzate e personalizzazioni.',
            examples: 'Preferenze UI, impostazioni dashboard, layout personalizzato',
            required: false,
            color: 'text-blue-600 bg-blue-50 border-blue-200'
        },
        {
            key: 'analytics' as const,
            icon: ChartBarIcon,
            title: 'Cookie Analitici',
            description: 'Questi cookie ci aiutano a capire come i visitatori interagiscono con il sito web.',
            examples: 'Google Analytics, statistiche di utilizzo, performance monitoring',
            required: false,
            color: 'text-purple-600 bg-purple-50 border-purple-200'
        },
        {
            key: 'marketing' as const,
            icon: MegaphoneIcon,
            title: 'Cookie di Marketing',
            description: 'Questi cookie sono utilizzati per mostrare annunci pubblicitari pertinenti.',
            examples: 'Pubblicità personalizzata, social media, remarketing',
            required: false,
            color: 'text-orange-600 bg-orange-50 border-orange-200'
        }
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
            <div className="max-w-7xl mx-auto p-4 sm:p-6">
                {!showDetails ? (
                    // Simple Banner
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-start gap-3">
                                <ShieldCheckIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        🍪 Utilizziamo i cookies
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Utilizziamo cookie e tecnologie simili per migliorare la tua esperienza, 
                                        personalizzare i contenuti, analizzare il traffico e supportare le nostre 
                                        attività di marketing. Puoi scegliere quali categorie di cookie accettare.
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Conformità: GDPR, Normativa Italiana sui Cookie (D.Lgs. 196/2003)
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2 lg:ml-6">
                            <button
                                onClick={() => setShowDetails(true)}
                                className="btn-secondary flex items-center justify-center text-sm"
                            >
                                <CogIcon className="h-4 w-4 mr-2" />
                                Personalizza
                            </button>
                            <button
                                onClick={handleAcceptNecessary}
                                className="btn-secondary text-sm whitespace-nowrap"
                            >
                                Solo Necessari
                            </button>
                            <button
                                onClick={handleAcceptAll}
                                className="btn-primary text-sm whitespace-nowrap"
                            >
                                Accetta Tutti
                            </button>
                        </div>
                    </div>
                ) : (
                    // Detailed Settings
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Impostazioni Cookie
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Scegli quali categorie di cookie consentire
                                </p>
                            </div>
                            <button
                                onClick={() => setShowDetails(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                                aria-label="Chiudi impostazioni dettagliate"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="grid gap-4 max-h-96 overflow-y-auto">
                            {cookieCategories.map((category) => {
                                const Icon = category.icon;
                                const isEnabled = tempPreferences[category.key];
                                
                                return (
                                    <div
                                        key={category.key}
                                        className={`p-4 rounded-lg border-2 transition-all ${
                                            isEnabled 
                                                ? category.color
                                                : 'bg-gray-50 border-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3 flex-1">
                                                <Icon className={`h-5 w-5 mt-1 flex-shrink-0 ${
                                                    isEnabled ? category.color.split(' ')[0] : 'text-gray-400'
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
                                                    <p className="text-xs text-gray-500">
                                                        <strong>Esempi:</strong> {category.examples}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex-shrink-0 ml-4">
                                                <button
                                                    onClick={() => handleToggleCategory(category.key)}
                                                    disabled={category.required}
                                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                                        isEnabled
                                                            ? 'bg-blue-600'
                                                            : 'bg-gray-200'
                                                    } ${
                                                        category.required ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                                    role="switch"
                                                    aria-checked={isEnabled}
                                                    aria-label={`${isEnabled ? 'Disabilita' : 'Abilita'} ${category.title}`}
                                                >
                                                    <span
                                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                            isEnabled ? 'translate-x-5' : 'translate-x-0'
                                                        }`}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                            <div className="flex-1">
                                <p className="text-xs text-gray-500">
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
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAcceptNecessary}
                                    className="btn-secondary text-sm"
                                >
                                    Solo Necessari
                                </button>
                                <button
                                    onClick={handleSavePreferences}
                                    className="btn-primary text-sm"
                                >
                                    Salva Preferenze
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
