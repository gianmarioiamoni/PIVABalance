'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import {
    DocumentTextIcon,
    EnvelopeIcon,
    UserIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

/**
 * Privacy Request Form Component
 * 
 * GDPR Art. 12-23 - Automated form for privacy rights requests
 * Allows users to submit formal requests for exercising their GDPR rights
 */

type PrivacyRequestType =
    | 'access'           // Art. 15 - Right of access
    | 'rectification'    // Art. 16 - Right to rectification
    | 'erasure'          // Art. 17 - Right to erasure
    | 'restriction'      // Art. 18 - Right to restriction
    | 'portability'      // Art. 20 - Right to data portability
    | 'objection'        // Art. 21 - Right to object
    | 'withdraw_consent' // Withdraw consent
    | 'complaint'        // General complaint
    | 'other';           // Other request

interface PrivacyRequest {
    type: PrivacyRequestType;
    subject: string;
    description: string;
    urgency: 'low' | 'medium' | 'high';
    contactMethod: 'email' | 'phone';
    contactDetails: string;
}

export const PrivacyRequestForm: React.FC = () => {
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');

    const [request, setRequest] = useState<PrivacyRequest>({
        type: 'access',
        subject: '',
        description: '',
        urgency: 'medium',
        contactMethod: 'email',
        contactDetails: user?.email || ''
    });

    const requestTypes = [
        {
            value: 'access' as const,
            label: 'Accesso ai Dati (Art. 15)',
            description: 'Richiedi una copia di tutti i tuoi dati personali',
            icon: DocumentTextIcon
        },
        {
            value: 'rectification' as const,
            label: 'Rettifica Dati (Art. 16)',
            description: 'Correggi dati inesatti o incompleti',
            icon: DocumentTextIcon
        },
        {
            value: 'erasure' as const,
            label: 'Cancellazione Dati (Art. 17)',
            description: 'Richiedi la cancellazione dei tuoi dati (diritto all\'oblio)',
            icon: DocumentTextIcon
        },
        {
            value: 'restriction' as const,
            label: 'Limitazione Trattamento (Art. 18)',
            description: 'Limita il trattamento dei tuoi dati in certe circostanze',
            icon: DocumentTextIcon
        },
        {
            value: 'portability' as const,
            label: 'Portabilità Dati (Art. 20)',
            description: 'Ottieni i tuoi dati in formato strutturato e machine-readable',
            icon: DocumentTextIcon
        },
        {
            value: 'objection' as const,
            label: 'Opposizione (Art. 21)',
            description: 'Opponi al trattamento per marketing o interesse legittimo',
            icon: DocumentTextIcon
        },
        {
            value: 'withdraw_consent' as const,
            label: 'Revoca Consenso',
            description: 'Ritira il consenso per trattamenti basati su consenso',
            icon: DocumentTextIcon
        },
        {
            value: 'complaint' as const,
            label: 'Reclamo',
            description: 'Presenta un reclamo sul trattamento dei tuoi dati',
            icon: ExclamationTriangleIcon
        },
        {
            value: 'other' as const,
            label: 'Altra Richiesta',
            description: 'Richiesta specifica non coperta dalle opzioni precedenti',
            icon: DocumentTextIcon
        }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSubmitting) return;

        try {
            setIsSubmitting(true);
            setError('');
            setSubmitStatus('idle');

            // Validate form
            if (!request.subject.trim()) {
                throw new Error('Il soggetto della richiesta è obbligatorio');
            }
            if (!request.description.trim()) {
                throw new Error('La descrizione della richiesta è obbligatoria');
            }
            if (!request.contactDetails.trim()) {
                throw new Error('I dettagli di contatto sono obbligatori');
            }

            // Prepare request data
            const requestData = {
                ...request,
                userId: user?.id,
                userEmail: user?.email,
                userName: user?.name,
                timestamp: new Date().toISOString(),
                status: 'submitted',
                requestId: `PR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            };

            // For now, we'll create an email body and use mailto
            // In a real implementation, this would be sent to a server endpoint
            const emailBody = generateEmailBody(requestData);
            const mailtoLink = `mailto:privacy@pivabalance.com?subject=${encodeURIComponent(`Richiesta Privacy - ${request.subject}`)}&body=${encodeURIComponent(emailBody)}`;

            // Open email client
            window.location.href = mailtoLink;

            setSubmitStatus('success');

        } catch (err: any) {
            console.error('Privacy request error:', err);
            setError(err.message || 'Errore durante l\'invio della richiesta');
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const generateEmailBody = (requestData: any): string => {
        const selectedType = requestTypes.find(t => t.value === request.type);

        return `RICHIESTA PRIVACY - GDPR
========================================

ID Richiesta: ${requestData.requestId}
Data Richiesta: ${new Date().toLocaleDateString('it-IT')}
Ora Richiesta: ${new Date().toLocaleTimeString('it-IT')}

DATI RICHIEDENTE:
- Nome: ${requestData.userName}
- Email: ${requestData.userEmail}
- User ID: ${requestData.userId}

TIPO DI RICHIESTA:
${selectedType?.label} - ${selectedType?.description}

SOGGETTO:
${request.subject}

DESCRIZIONE DETTAGLIATA:
${request.description}

URGENZA: ${request.urgency.toUpperCase()}

CONTATTI PREFERITI:
- Metodo: ${request.contactMethod === 'email' ? 'Email' : 'Telefono'}
- Dettagli: ${request.contactDetails}

INFORMAZIONI TECNICHE:
- User Agent: ${navigator.userAgent}
- Timestamp: ${requestData.timestamp}
- URL Richiesta: ${window.location.href}

========================================

Questa richiesta è stata generata automaticamente dal sistema PIVABalance.
Per ulteriori informazioni, consultare la Privacy Policy: ${window.location.origin}/privacy-policy

Tempo di risposta previsto: 30 giorni lavorativi (come previsto dal GDPR Art. 12.3)
`;
    };

    const resetForm = () => {
        setRequest({
            type: 'access',
            subject: '',
            description: '',
            urgency: 'medium',
            contactMethod: 'email',
            contactDetails: user?.email || ''
        });
        setSubmitStatus('idle');
        setError('');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start">
                <EnvelopeIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Richiesta Formale Privacy (GDPR)
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Utilizza questo form per esercitare i tuoi diritti sulla protezione dei dati personali
                        secondo il GDPR. La richiesta verrà inviata al nostro Data Protection Officer.
                    </p>
                </div>
            </div>

            {/* Success Message */}
            {submitStatus === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="ml-3">
                            <h4 className="text-sm font-medium text-green-800">
                                Richiesta inviata con successo!
                            </h4>
                            <p className="text-sm text-green-700 mt-1">
                                La tua richiesta privacy è stata preparata e inviata tramite email.
                                Riceverai una risposta entro 30 giorni lavorativi come previsto dal GDPR.
                            </p>
                            <button
                                onClick={resetForm}
                                className="mt-2 text-sm text-green-600 hover:text-green-800 underline"
                            >
                                Invia una nuova richiesta
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {submitStatus === 'error' && error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="ml-3">
                            <h4 className="text-sm font-medium text-red-800">
                                Errore nell'invio della richiesta
                            </h4>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Form */}
            {submitStatus !== 'success' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Request Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Tipo di Richiesta *
                        </label>
                        <div className="grid gap-3">
                            {requestTypes.map((type) => {
                                const Icon = type.icon;
                                return (
                                    <label
                                        key={type.value}
                                        className={`
                                            flex items-start p-3 border rounded-lg cursor-pointer transition-colors
                                            ${request.type === type.value
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }
                                        `}
                                    >
                                        <input
                                            type="radio"
                                            name="requestType"
                                            value={type.value}
                                            checked={request.type === type.value}
                                            onChange={(e) => setRequest(prev => ({ ...prev, type: e.target.value as PrivacyRequestType }))}
                                            className="mt-1 mr-3"
                                        />
                                        <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 mr-3 ${request.type === type.value ? 'text-blue-600' : 'text-gray-400'
                                            }`} />
                                        <div>
                                            <div className={`font-medium ${request.type === type.value ? 'text-blue-900' : 'text-gray-900'
                                                }`}>
                                                {type.label}
                                            </div>
                                            <div className={`text-sm mt-1 ${request.type === type.value ? 'text-blue-700' : 'text-gray-600'
                                                }`}>
                                                {type.description}
                                            </div>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Subject */}
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                            Soggetto della Richiesta *
                        </label>
                        <input
                            type="text"
                            id="subject"
                            value={request.subject}
                            onChange={(e) => setRequest(prev => ({ ...prev, subject: e.target.value }))}
                            placeholder="Breve descrizione della richiesta"
                            className="input-field"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Descrizione Dettagliata *
                        </label>
                        <textarea
                            id="description"
                            rows={5}
                            value={request.description}
                            onChange={(e) => setRequest(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Descrivi in dettaglio la tua richiesta, includendo informazioni specifiche sui dati interessati..."
                            className="input-field resize-none"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Più dettagli fornisci, più velocemente potremo processare la tua richiesta.
                        </p>
                    </div>

                    {/* Urgency and Contact */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
                                Urgenza
                            </label>
                            <select
                                id="urgency"
                                value={request.urgency}
                                onChange={(e) => setRequest(prev => ({ ...prev, urgency: e.target.value as 'low' | 'medium' | 'high' }))}
                                className="input-field"
                            >
                                <option value="low">Bassa</option>
                                <option value="medium">Media</option>
                                <option value="high">Alta</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="contactMethod" className="block text-sm font-medium text-gray-700 mb-2">
                                Metodo di Contatto Preferito
                            </label>
                            <select
                                id="contactMethod"
                                value={request.contactMethod}
                                onChange={(e) => setRequest(prev => ({ ...prev, contactMethod: e.target.value as 'email' | 'phone' }))}
                                className="input-field"
                            >
                                <option value="email">Email</option>
                                <option value="phone">Telefono</option>
                            </select>
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div>
                        <label htmlFor="contactDetails" className="block text-sm font-medium text-gray-700 mb-2">
                            Dettagli di Contatto *
                        </label>
                        <input
                            type={request.contactMethod === 'email' ? 'email' : 'tel'}
                            id="contactDetails"
                            value={request.contactDetails}
                            onChange={(e) => setRequest(prev => ({ ...prev, contactDetails: e.target.value }))}
                            placeholder={request.contactMethod === 'email' ? 'tua-email@esempio.com' : '+39 123 456 7890'}
                            className="input-field"
                            required
                        />
                    </div>

                    {/* Legal Notice */}
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-start">
                            <ClockIcon className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                            <div className="ml-3 text-sm text-gray-700">
                                <h4 className="font-medium text-gray-900 mb-1">
                                    Informazioni Importanti
                                </h4>
                                <ul className="space-y-1 text-xs">
                                    <li>• <strong>Tempo di risposta:</strong> 30 giorni lavorativi (GDPR Art. 12.3)</li>
                                    <li>• <strong>Verifica identità:</strong> Potremmo richiedere documenti per verificare la tua identità</li>
                                    <li>• <strong>Gratuità:</strong> Il servizio è gratuito per la prima richiesta</li>
                                    <li>• <strong>Diritto di reclamo:</strong> Puoi presentare reclamo al Garante Privacy</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Invio in corso...
                                </>
                            ) : (
                                <>
                                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                                    Invia Richiesta Privacy
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};
