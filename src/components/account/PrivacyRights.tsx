'use client';

import React, { useState } from 'react';
import { api } from '@/services/api';
import {
    ShieldCheckIcon,
    ArrowDownTrayIcon,
    DocumentTextIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

/**
 * Privacy Rights Component
 * 
 * GDPR Art. 12-23 - Data Subject Rights Implementation
 * Allows users to exercise their privacy rights including:
 * - Right to Access (Art. 15)
 * - Right to Data Portability (Art. 20)
 * - Right to Information about processing
 */
export const PrivacyRights: React.FC = () => {
    const [isExporting, setIsExporting] = useState(false);
    const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');

    const handleExportData = async () => {
        if (isExporting) return;

        try {
            setIsExporting(true);
            setError('');
            setExportStatus('idle');

            // Call the export API
            const response = await api.get<any>('/user/export-data');

            // Create and trigger download
            const dataStr = JSON.stringify(response, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `pivabalance-data-export-${Date.now()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setExportStatus('success');

        } catch (err: any) {
            console.error('Data export error:', err);
            
            let errorMessage = 'Errore durante l\'export dei dati';
            if (err?.data?.message) {
                errorMessage = err.data.message;
            } else if (err?.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            setExportStatus('error');
        } finally {
            setIsExporting(false);
        }
    };

    const privacyRights = [
        {
            title: 'Diritto di Accesso (Art. 15)',
            description: 'Ottieni una copia di tutti i tuoi dati personali che trattiamo.',
            icon: DocumentTextIcon,
            action: 'Export Dati',
            handler: handleExportData,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
        },
        {
            title: 'Diritto alla Portabilità (Art. 20)',
            description: 'Ricevi i tuoi dati in formato strutturato e machine-readable.',
            icon: ArrowDownTrayIcon,
            action: 'Export Dati',
            handler: handleExportData,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start">
                <ShieldCheckIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        I Tuoi Diritti Privacy (GDPR)
                    </h3>
                    <p className="text-gray-600 text-sm">
                        In conformità al Regolamento Generale sulla Protezione dei Dati (GDPR), 
                        hai diritto di accedere, modificare e controllare i tuoi dati personali.
                    </p>
                </div>
            </div>

            {/* Export Status Messages */}
            {exportStatus === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="ml-3">
                            <h4 className="text-sm font-medium text-green-800">
                                Export completato con successo!
                            </h4>
                            <p className="text-sm text-green-700 mt-1">
                                Il file con i tuoi dati è stato scaricato. Il file contiene tutti i tuoi 
                                dati personali in formato JSON machine-readable.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {exportStatus === 'error' && error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="ml-3">
                            <h4 className="text-sm font-medium text-red-800">
                                Errore durante l'export
                            </h4>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Privacy Rights Cards */}
            <div className="grid gap-4">
                {privacyRights.map((right, index) => {
                    const Icon = right.icon;
                    return (
                        <div 
                            key={index}
                            className={`p-4 border rounded-lg ${right.bgColor} ${right.borderColor}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start flex-1">
                                    <Icon className={`h-6 w-6 ${right.color} flex-shrink-0 mt-1`} />
                                    <div className="ml-3 flex-1">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                            {right.title}
                                        </h4>
                                        <p className="text-sm text-gray-700 mb-3">
                                            {right.description}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={right.handler}
                                    disabled={isExporting}
                                    className="ml-4 btn-primary flex items-center"
                                >
                                    {isExporting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Esportando...
                                        </>
                                    ) : (
                                        <>
                                            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                                            {right.action}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Information about the export */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                    <InformationCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="ml-3">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">
                            Cosa include l'export dei dati?
                        </h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• <strong>Dati Profilo:</strong> Email, nome, impostazioni account</li>
                            <li>• <strong>Dati Finanziari:</strong> Tutte le fatture e costi inseriti</li>
                            <li>• <strong>Impostazioni:</strong> Regime fiscale, aliquote, preferenze</li>
                            <li>• <strong>Statistiche:</strong> Riassunto dell'attività del tuo account</li>
                            <li>• <strong>Metadati:</strong> Date di creazione, ultimo accesso, ruolo</li>
                        </ul>
                        <p className="text-sm text-blue-700 mt-2">
                            <strong>Formato:</strong> JSON machine-readable conforme GDPR Art. 20
                        </p>
                    </div>
                </div>
            </div>

            {/* Other Rights Information */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Altri Diritti Privacy
                </h4>
                <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-start">
                        <span className="font-medium w-32 flex-shrink-0">Rettifica:</span>
                        <span>Modifica i tuoi dati nella sezione "Profilo"</span>
                    </div>
                    <div className="flex items-start">
                        <span className="font-medium w-32 flex-shrink-0">Cancellazione:</span>
                        <span>Elimina il tuo account nella "Zona Pericolosa"</span>
                    </div>
                    <div className="flex items-start">
                        <span className="font-medium w-32 flex-shrink-0">Opposizione:</span>
                        <span>Gestisci i cookie nella sezione "Privacy e Cookie"</span>
                    </div>
                    <div className="flex items-start">
                        <span className="font-medium w-32 flex-shrink-0">Altre richieste:</span>
                        <span>Contatta <a href="mailto:privacy@pivabalance.com" className="text-blue-600 hover:text-blue-800 underline">privacy@pivabalance.com</a></span>
                    </div>
                </div>
            </div>
        </div>
    );
};
