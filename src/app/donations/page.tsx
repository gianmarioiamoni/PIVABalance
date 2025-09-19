'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import { useAuth } from '@/hooks/auth/useAuth';
import {
    HeartIcon,
    SparklesIcon,
    ShieldCheckIcon,
    CurrencyEuroIcon,
    UsersIcon,
    XMarkIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

// Types
interface DonationData {
    amount: string;
    donorEmail: string;
    donorName: string;
    isAnonymous: boolean;
    message: string;
    consentToContact: boolean;
}

interface DonationStats {
    totalAmount: number;
    totalCount: number;
    averageAmount: number;
    lastDonation: string | null;
    monthlyGoal: number;
    monthlyProgress: number;
}

interface PaymentFormProps {
    donationData: DonationData;
    onSuccess: (message: string) => void;
    onError: (error: string) => void;
    onBack: () => void;
}

/**
 * Stripe Payment Form Component
 */
function StripePaymentForm({ donationData, onSuccess, onError, onBack }: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            onError('Stripe non è ancora caricato. Riprova tra un momento.');
            return;
        }

        setIsProcessing(true);

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/donations/success`,
                },
                redirect: 'if_required',
            });

            if (error) {
                throw new Error(error.message);
            }

            if (paymentIntent?.status === 'succeeded') {
                onSuccess('Donazione completata con successo!');
            } else {
                throw new Error('Pagamento non completato');
            }

        } catch (err: unknown) {
            console.error('Payment error:', err);
            onError(err instanceof Error ? err.message : 'Errore durante il pagamento');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Summary */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                    <InformationCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="ml-3 text-sm">
                        <p className="text-blue-800 font-medium">
                            Stai donando €{donationData.amount}
                        </p>
                        <p className="text-blue-700 mt-1">
                            Grazie per il tuo supporto al progetto!
                        </p>
                    </div>
                </div>
            </div>

            {/* Payment Element */}
            <div className="space-y-4">
                <PaymentElement
                    options={{
                        layout: 'tabs',
                        defaultValues: {
                            billingDetails: {
                                email: donationData.donorEmail,
                                name: donationData.donorName,
                            }
                        }
                    }}
                />
            </div>

            {/* Test Cards Info */}
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="text-yellow-800 font-medium text-sm mb-2">🧪 Modalità Test</h4>
                <div className="text-yellow-700 text-xs space-y-1">
                    <p><strong>✅ Successo:</strong> 4242424242424242</p>
                    <p><strong>❌ Rifiutata:</strong> 4000000000000002</p>
                    <p><strong>💸 Fondi insufficienti:</strong> 4000000000009995</p>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    ← Indietro
                </button>

                <button
                    type="submit"
                    disabled={!stripe || !elements || isProcessing}
                    style={{
                        flex: 1,
                        backgroundColor: isProcessing ? '#9ca3af' : '#dc2626',
                        color: 'white',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: isProcessing ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {isProcessing ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Elaborazione in corso...
                        </>
                    ) : (
                        <>
                            <HeartIcon className="h-4 w-4 mr-2" />
                            Dona €{donationData.amount}
                        </>
                    )}
                </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
                I pagamenti sono elaborati in modo sicuro da Stripe.
                Non memorizziamo i dati della tua carta di credito.
            </p>
        </form>
    );
}

/**
 * Donation Form with Payment Intent Creation
 */
function DonationFormWithStripe({ donationData, onSuccess, onError, onBack }: PaymentFormProps) {
    const [clientSecret, setClientSecret] = useState('');
    const [paymentReady, setPaymentReady] = useState(false);

    const createPaymentIntent = useCallback(async () => {
        try {
            const response = await fetch('/api/donations/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: parseInt(donationData.amount) * 100,
                    donorEmail: donationData.donorEmail,
                    donorName: donationData.donorName,
                    isAnonymous: donationData.isAnonymous,
                    message: donationData.message,
                    consentToContact: donationData.consentToContact || false,
                    source: 'web'
                }),
            });

            const data = await response.json();

            if (data.success) {
                setClientSecret(data.data.client_secret);
                setPaymentReady(true);
            } else {
                onError(data.message || 'Errore nella creazione del pagamento');
            }
        } catch (error) {
            console.error('Error creating payment intent:', error);
            onError('Errore nella creazione del pagamento. Riprova più tardi.');
        }
    }, [donationData, onError]);

    useEffect(() => {
        createPaymentIntent();
    }, [createPaymentIntent]);

    if (!paymentReady) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Preparazione Pagamento...</h3>
                <p className="text-gray-600">Stiamo inizializzando il sistema di pagamento sicuro</p>
            </div>
        );
    }

    if (!clientSecret) {
        return (
            <div className="text-center py-8">
                <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Errore Configurazione</h3>
                <p className="text-gray-600 mb-4">Impossibile inizializzare il pagamento</p>
                <button
                    onClick={onBack}
                    style={{
                        backgroundColor: '#6b7280',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '1rem',
                        cursor: 'pointer'
                    }}
                >
                    ← Torna indietro
                </button>
            </div>
        );
    }

    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <StripePaymentForm
                donationData={donationData}
                onSuccess={onSuccess}
                onError={onError}
                onBack={onBack}
            />
        </Elements>
    );
}

/**
 * Main Donations Page - Production Version with Working Logic
 */
export default function DonationsPage() {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [step, setStep] = useState('form'); // 'form', 'payment', 'success', 'error'
    const [stats, setStats] = useState<DonationStats | null>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [donationData, setDonationData] = useState({
        amount: '10',
        donorEmail: user?.email || '',
        donorName: user?.name || '',
        isAnonymous: false,
        message: '',
        consentToContact: false
    });
    const [statusMessage, setStatusMessage] = useState('');

    // Load donation stats
    useEffect(() => {
        loadStats();
    }, []);

    // Update user data when user changes
    useEffect(() => {
        setDonationData(prev => ({
            ...prev,
            donorEmail: user?.email || '',
            donorName: user?.name || ''
        }));
    }, [user]);

    const loadStats = async () => {
        try {
            setIsLoadingStats(true);
            const response = await fetch('/api/donations/stats');
            const data = await response.json();

            if (data.success) {
                setStats(data.data);
            } else {
                // Set default stats if API fails
                setStats({
                    totalAmount: 0,
                    totalCount: 0,
                    averageAmount: 0,
                    lastDonation: null,
                    monthlyGoal: 50000,
                    monthlyProgress: 0
                });
            }
        } catch (error) {
            console.error('Error loading donation stats:', error);
            // Set default stats if API fails
            setStats({
                totalAmount: 0,
                totalCount: 0,
                averageAmount: 0,
                lastDonation: null,
                monthlyGoal: 50000,
                monthlyProgress: 0
            });
        } finally {
            setIsLoadingStats(false);
        }
    };

    const suggestedAmounts = [
        { amount: 500, label: '€5', description: 'Un caffè' },
        { amount: 1000, label: '€10', description: 'Supporto base' },
        { amount: 2500, label: '€25', description: 'Contributo' }
    ];

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const amount = parseInt(donationData.amount) * 100;
        if (amount < 100) {
            alert('L\'importo minimo è €1.00');
            return;
        }
        if (amount > 10000000) {
            alert('L\'importo massimo è €100,000');
            return;
        }

        setStep('payment');
    };

    const handlePaymentSuccess = (message: string) => {
        setStatusMessage(message);
        setStep('success');
        // Refresh stats after successful donation
        setTimeout(loadStats, 1000);
    };

    const handlePaymentError = (error: string) => {
        setStatusMessage(error);
        setStep('error');
    };

    const resetModal = () => {
        setStep('form');
        setStatusMessage('');
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <div className="bg-gradient-to-r from-pink-500 to-red-500 p-4 rounded-full">
                            <HeartIcon className="h-12 w-12 text-white" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Supporta PIVABalance
                    </h1>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Aiutaci a mantenere questo servizio gratuito e a sviluppare nuove funzionalità
                        per tutti i freelancer e partite IVA italiane.
                    </p>
                </div>


                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Why Donate */}
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                            Perché Donare?
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="bg-blue-100 p-2 rounded-lg mr-4">
                                    <SparklesIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Servizio Gratuito</h3>
                                    <p className="text-gray-600">
                                        PIVABalance è e rimarrà sempre gratuito per tutti. Le donazioni ci aiutano
                                        a coprire i costi del server e dello sviluppo.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-green-100 p-2 rounded-lg mr-4">
                                    <CurrencyEuroIcon className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Nuove Funzionalità</h3>
                                    <p className="text-gray-600">
                                        Con il tuo supporto possiamo sviluppare nuove funzionalità come
                                        l&apos;integrazione bancaria, analytics avanzati e app mobile.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-purple-100 p-2 rounded-lg mr-4">
                                    <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Indipendenza</h3>
                                    <p className="text-gray-600">
                                        Le donazioni ci permettono di rimanere indipendenti e di non dover
                                        introdurre pubblicità o vendere dati degli utenti.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Transparency */}
                        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-2">💎 Trasparenza Totale</h4>
                            <p className="text-sm text-blue-800">
                                Tutte le donazioni vengono utilizzate esclusivamente per i costi del servizio
                                e lo sviluppo di nuove funzionalità. Pubblichiamo statistiche anonime per
                                garantire la massima trasparenza.
                            </p>
                        </div>
                    </div>

                    {/* Right: Donation Card */}
                    <div>
                        <div className="bg-white rounded-xl shadow-lg p-8 h-full">
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="bg-gradient-to-r from-pink-500 to-red-500 p-3 rounded-full">
                                        <HeartIcon className="h-8 w-8 text-white" />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                                    Fai una Donazione
                                </h3>

                                <p className="text-gray-600 mb-6">
                                    Ogni contributo, grande o piccolo, fa la differenza per mantenere
                                    PIVABalance gratuito e in continua evoluzione.
                                </p>

                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 mb-6"
                                >
                                    <div className="flex items-center justify-center">
                                        <SparklesIcon className="h-6 w-6 mr-2" />
                                        Supporta il Progetto
                                    </div>
                                </button>

                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div className="flex items-center justify-center">
                                        <ShieldCheckIcon className="h-4 w-4 mr-1" />
                                        Sicuro
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <HeartIcon className="h-4 w-4 mr-1" />
                                        Volontario
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                {!isLoadingStats && stats && (
                    <div className="bg-white rounded-xl shadow-lg p-8 mb-12 mt-20">
                        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
                            Trasparenza e Impatto
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="text-center">
                                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <CurrencyEuroIcon className="h-8 w-8 text-green-600" />
                                </div>
                                <div className="text-2xl font-bold text-gray-900">
                                    €{(stats.totalAmount / 100).toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-600">Totale Raccolto</div>
                            </div>

                            <div className="text-center">
                                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <UsersIcon className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {stats.totalCount}
                                </div>
                                <div className="text-sm text-gray-600">Sostenitori</div>
                            </div>

                            <div className="text-center">
                                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <SparklesIcon className="h-8 w-8 text-purple-600" />
                                </div>
                                <div className="text-2xl font-bold text-gray-900">
                                    €{(stats.averageAmount / 100).toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-600">Donazione Media</div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="bg-gray-100 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">Obiettivo Mensile</span>
                                <span className="text-sm text-gray-600">
                                    {stats.monthlyProgress.toFixed(1)}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                <div
                                    className="bg-gradient-to-r from-pink-500 to-red-500 h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min(100, stats.monthlyProgress)}%` }}
                                />
                            </div>
                            <div className="text-xs text-gray-500 text-center">
                                Obiettivo: €{(stats.monthlyGoal / 100).toFixed(2)} al mese
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center mt-12 p-6 bg-white rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600">
                        🔒 <strong>Sicurezza garantita:</strong> I pagamenti sono elaborati da Stripe,
                        leader mondiale nei pagamenti online. Non memorizziamo mai i dati delle carte di credito.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        PIVABalance è conforme al GDPR. Le donazioni sono completamente volontarie e non vincolanti.
                    </p>
                </div>
            </div>

            {/* Donation Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 50,
                    overflowY: 'auto'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                        padding: '1rem'
                    }}>
                        <div
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)'
                            }}
                            onClick={resetModal}
                        />

                        <div style={{
                            position: 'relative',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '2rem',
                            maxWidth: '500px',
                            width: '100%',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                        }}>
                            {/* Header */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '1.5rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <HeartIcon style={{ height: '1.5rem', width: '1.5rem', color: '#dc2626', marginRight: '0.5rem' }} />
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
                                        {step === 'form' && 'Supporta PIVABalance'}
                                        {step === 'payment' && 'Completa la Donazione'}
                                        {step === 'success' && 'Grazie!'}
                                        {step === 'error' && 'Errore'}
                                    </h3>
                                </div>
                                <button
                                    onClick={resetModal}
                                    style={{
                                        color: '#9ca3af',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '0.25rem'
                                    }}
                                >
                                    <XMarkIcon style={{ height: '1.5rem', width: '1.5rem' }} />
                                </button>
                            </div>

                            {/* Form Step */}
                            {step === 'form' && (
                                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {/* Amount Selection */}
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            color: '#374151',
                                            marginBottom: '0.75rem'
                                        }}>
                                            Scegli l&apos;importo della donazione
                                        </label>

                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(3, 1fr)',
                                            gap: '0.5rem',
                                            marginBottom: '1rem'
                                        }}>
                                            {suggestedAmounts.map((suggestion) => (
                                                <button
                                                    key={suggestion.amount}
                                                    type="button"
                                                    onClick={() => setDonationData(prev => ({ ...prev, amount: (suggestion.amount / 100).toString() }))}
                                                    style={{
                                                        padding: '0.75rem',
                                                        textAlign: 'center',
                                                        border: parseInt(donationData.amount) * 100 === suggestion.amount ? '2px solid #3b82f6' : '1px solid #d1d5db',
                                                        borderRadius: '8px',
                                                        backgroundColor: parseInt(donationData.amount) * 100 === suggestion.amount ? '#eff6ff' : 'white',
                                                        color: parseInt(donationData.amount) * 100 === suggestion.amount ? '#1d4ed8' : '#374151',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <div style={{ fontWeight: '600' }}>{suggestion.label}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>{suggestion.description}</div>
                                                </button>
                                            ))}
                                        </div>

                                        <input
                                            type="number"
                                            min="1"
                                            max="10000"
                                            step="0.01"
                                            value={donationData.amount}
                                            onChange={(e) => setDonationData(prev => ({ ...prev, amount: e.target.value }))}
                                            placeholder="€"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 1rem',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '1rem',
                                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                                            }}
                                        />
                                    </div>

                                    {/* Anonymous Option */}
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            type="checkbox"
                                            id="anonymous"
                                            checked={donationData.isAnonymous}
                                            onChange={(e) => setDonationData(prev => ({
                                                ...prev,
                                                isAnonymous: e.target.checked,
                                                consentToContact: e.target.checked ? false : prev.consentToContact
                                            }))}
                                            style={{ marginRight: '0.5rem' }}
                                        />
                                        <label htmlFor="anonymous" style={{ fontSize: '0.875rem', color: '#374151' }}>
                                            Donazione anonima
                                        </label>
                                    </div>

                                    {/* Personal Info */}
                                    {!donationData.isAnonymous && (
                                        <>
                                            <div>
                                                <label style={{
                                                    display: 'block',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '500',
                                                    color: '#374151',
                                                    marginBottom: '0.25rem'
                                                }}>
                                                    Nome (opzionale)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={donationData.donorName}
                                                    onChange={(e) => setDonationData(prev => ({ ...prev, donorName: e.target.value }))}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.5rem 0.75rem',
                                                        border: '1px solid #d1d5db',
                                                        borderRadius: '6px',
                                                        fontSize: '0.875rem'
                                                    }}
                                                    placeholder="Il tuo nome"
                                                />
                                            </div>

                                            <div>
                                                <label style={{
                                                    display: 'block',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '500',
                                                    color: '#374151',
                                                    marginBottom: '0.25rem'
                                                }}>
                                                    Email per ricevuta (opzionale)
                                                </label>
                                                <input
                                                    type="email"
                                                    value={donationData.donorEmail}
                                                    onChange={(e) => setDonationData(prev => ({ ...prev, donorEmail: e.target.value }))}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.5rem 0.75rem',
                                                        border: '1px solid #d1d5db',
                                                        borderRadius: '6px',
                                                        fontSize: '0.875rem'
                                                    }}
                                                    placeholder="tua-email@esempio.com"
                                                />
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <input
                                                    type="checkbox"
                                                    id="consent"
                                                    checked={donationData.consentToContact}
                                                    onChange={(e) => setDonationData(prev => ({ ...prev, consentToContact: e.target.checked }))}
                                                    style={{ marginRight: '0.5rem' }}
                                                />
                                                <label htmlFor="consent" style={{ fontSize: '0.875rem', color: '#374151' }}>
                                                    Acconsento a essere contattato per aggiornamenti sul progetto
                                                </label>
                                            </div>
                                        </>
                                    )}

                                    {/* Message */}
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            color: '#374151',
                                            marginBottom: '0.25rem'
                                        }}>
                                            Messaggio (opzionale)
                                        </label>
                                        <textarea
                                            value={donationData.message}
                                            onChange={(e) => setDonationData(prev => ({ ...prev, message: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '0.5rem 0.75rem',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '6px',
                                                fontSize: '0.875rem',
                                                resize: 'vertical'
                                            }}
                                            rows={3}
                                            maxLength={500}
                                            placeholder="Lascia un messaggio di supporto..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        style={{
                                            width: '100%',
                                            background: 'linear-gradient(135deg, #ec4899 0%, #dc2626 100%)',
                                            color: 'white',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: 'none',
                                            fontSize: '1rem',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <HeartIcon style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} />
                                        Procedi al pagamento
                                    </button>
                                </form>
                            )}

                            {/* Payment Step */}
                            {step === 'payment' && (
                                <DonationFormWithStripe
                                    donationData={donationData}
                                    onSuccess={handlePaymentSuccess}
                                    onError={handlePaymentError}
                                    onBack={() => setStep('form')}
                                />
                            )}

                            {/* Success Step */}
                            {step === 'success' && (
                                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <CheckCircleIcon style={{ height: '4rem', width: '4rem', color: '#10b981', margin: '0 auto' }} />
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
                                        Grazie per la tua donazione!
                                    </h3>
                                    <p style={{ color: '#6b7280' }}>{statusMessage}</p>
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                        Il tuo contributo aiuta a mantenere PIVABalance gratuito per tutti!
                                    </p>
                                    <button
                                        onClick={resetModal}
                                        style={{
                                            backgroundColor: '#3b82f6',
                                            color: 'white',
                                            padding: '0.75rem 2rem',
                                            borderRadius: '8px',
                                            border: 'none',
                                            fontSize: '1rem',
                                            fontWeight: '500',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Chiudi
                                    </button>
                                </div>
                            )}

                            {/* Error Step */}
                            {step === 'error' && (
                                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <ExclamationTriangleIcon style={{ height: '4rem', width: '4rem', color: '#ef4444', margin: '0 auto' }} />
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
                                        Errore nel pagamento
                                    </h3>
                                    <p style={{ color: '#6b7280' }}>{statusMessage}</p>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                        <button
                                            onClick={() => setStep('payment')}
                                            style={{
                                                backgroundColor: '#3b82f6',
                                                color: 'white',
                                                padding: '0.75rem 1.5rem',
                                                borderRadius: '8px',
                                                border: 'none',
                                                fontSize: '1rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Riprova
                                        </button>
                                        <button
                                            onClick={resetModal}
                                            style={{
                                                backgroundColor: '#6b7280',
                                                color: 'white',
                                                padding: '0.75rem 1.5rem',
                                                borderRadius: '8px',
                                                border: 'none',
                                                fontSize: '1rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Chiudi
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}