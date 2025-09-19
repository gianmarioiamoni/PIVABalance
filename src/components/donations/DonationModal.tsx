'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useAuth } from '@/hooks/auth/useAuth';
import { donationService } from '@/services/donationService';
import { DonationRequest, StripePaymentIntent } from '@/types';
import {
  XMarkIcon,
  HeartIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

/**
 * Stripe Promise - Initialize once
 */
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

/**
 * Donation Modal Props
 */
interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (donationId: string) => void;
}

/**
 * Donation Form Component
 * Handles the payment processing with Stripe Elements
 */
interface DonationFormProps {
  clientSecret: string;
  donationData: DonationRequest;
  onSuccess: (donationId: string) => void;
  onError: (error: string) => void;
}

const DonationForm: React.FC<DonationFormProps> = ({
  donationData,
  onSuccess,
  onError
}) => {
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
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/donation/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent?.status === 'succeeded') {
        // Confirm donation on our backend
        const donation = await donationService.confirmDonation(paymentIntent.id);
        onSuccess(donation.id);
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <InformationCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="ml-3 text-sm">
            <p className="text-blue-800 font-medium">
              Stai donando {donationService.formatAmount(donationData.amount)}
            </p>
            <p className="text-blue-700 mt-1">
              {donationService.getImpactMessage(donationData.amount)}
            </p>
          </div>
        </div>
      </div>

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

      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full btn-primary flex items-center justify-center"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Elaborazione in corso...
          </>
        ) : (
          <>
            <HeartIcon className="h-4 w-4 mr-2" />
            Dona {donationService.formatAmount(donationData.amount)}
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        I pagamenti sono elaborati in modo sicuro da Stripe.
        Non memorizziamo i dati della tua carta di credito.
      </p>
    </form>
  );
};

/**
 * Main Donation Modal Component
 */
export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'form' | 'payment' | 'success' | 'error'>('form');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [donationData, setDonationData] = useState<DonationRequest>({
    amount: 1000, // €10.00 default
    donorEmail: user?.email || '',
    donorName: user?.name || '',
    isAnonymous: false,
    message: '',
    consentToContact: false,
    source: 'web',
  });
  const [error, setError] = useState<string>('');
  const [, setSuccessDonationId] = useState<string>('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setError('');
      setSuccessDonationId('');
      setDonationData(prev => ({
        ...prev,
        donorEmail: user?.email || '',
        donorName: user?.name || '',
      }));
    }
  }, [isOpen, user]);

  // Suggested amounts
  const suggestedAmounts = donationService.getSuggestedAmounts();

  const handleAmountSelect = (amount: number) => {
    setDonationData(prev => ({ ...prev, amount }));
  };

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const amount = donationService.parseAmount(value);
      setDonationData(prev => ({ ...prev, amount }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError('');

      // Validate amount
      const validation = donationService.validateDonationAmount(donationData.amount);
      if (!validation.isValid) {
        setError(validation.error || 'Importo non valido');
        return;
      }

      // Create payment intent
      const paymentIntent: StripePaymentIntent = await donationService.createPaymentIntent(donationData);
      setClientSecret(paymentIntent.client_secret);
      setStep('payment');

    } catch (err: unknown) {
      console.error('Create payment intent error:', err);
      setError(err instanceof Error ? err.message : 'Errore durante la creazione del pagamento');
    }
  };

  const handlePaymentSuccess = (donationId: string) => {
    setSuccessDonationId(donationId);
    setStep('success');
    onSuccess?.(donationId);
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    setStep('error');
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <HeartIcon className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Supporta PIVABalance
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content based on step */}
          {step === 'form' && (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Scegli l&apos;importo della donazione
                </label>

                {/* Suggested amounts */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {suggestedAmounts.map((suggestion) => (
                    <button
                      key={suggestion.amount}
                      type="button"
                      onClick={() => handleAmountSelect(suggestion.amount)}
                      className={`
                        p-3 text-center border rounded-lg transition-colors
                        ${donationData.amount === suggestion.amount
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                        }
                      `}
                    >
                      <div className="font-semibold">{suggestion.label}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {suggestion.description}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Custom amount */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    O inserisci un importo personalizzato:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100000"
                    step="0.01"
                    placeholder="€"
                    onChange={handleCustomAmount}
                    className="input-field w-full"
                  />
                </div>
              </div>

              {/* Donor Information */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={donationData.isAnonymous}
                    onChange={(e) => setDonationData(prev => ({
                      ...prev,
                      isAnonymous: e.target.checked,
                      consentToContact: e.target.checked ? false : prev.consentToContact
                    }))}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
                    Donazione anonima
                  </label>
                </div>

                {!donationData.isAnonymous && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome (opzionale)
                      </label>
                      <input
                        type="text"
                        value={donationData.donorName}
                        onChange={(e) => setDonationData(prev => ({
                          ...prev,
                          donorName: e.target.value
                        }))}
                        className="input-field w-full"
                        placeholder="Il tuo nome"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email per ricevuta (opzionale)
                      </label>
                      <input
                        type="email"
                        value={donationData.donorEmail}
                        onChange={(e) => setDonationData(prev => ({
                          ...prev,
                          donorEmail: e.target.value
                        }))}
                        className="input-field w-full"
                        placeholder="tua-email@esempio.com"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="consent"
                        checked={donationData.consentToContact}
                        onChange={(e) => setDonationData(prev => ({
                          ...prev,
                          consentToContact: e.target.checked
                        }))}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="consent" className="ml-2 text-sm text-gray-700">
                        Acconsento a essere contattato per aggiornamenti sul progetto
                      </label>
                    </div>
                  </>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Messaggio (opzionale)
                </label>
                <textarea
                  value={donationData.message}
                  onChange={(e) => setDonationData(prev => ({
                    ...prev,
                    message: e.target.value
                  }))}
                  className="input-field w-full resize-none"
                  rows={3}
                  maxLength={500}
                  placeholder="Lascia un messaggio di supporto..."
                />
                <div className="text-xs text-gray-500 mt-1">
                  {donationData.message?.length || 0}/500 caratteri
                </div>
              </div>

              {/* Error display */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full btn-primary flex items-center justify-center"
              >
                <HeartIcon className="h-4 w-4 mr-2" />
                Procedi al pagamento
              </button>

              <p className="text-xs text-gray-500 text-center">
                Utilizzando Stripe per i pagamenti, garantiamo la massima sicurezza
                per i tuoi dati. Non memorizziamo informazioni sulla carta di credito.
              </p>
            </form>
          )}

          {step === 'payment' && clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <DonationForm
                clientSecret={clientSecret}
                donationData={donationData}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </Elements>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-900">
                Grazie per la tua donazione!
              </h3>
              <p className="text-gray-600">
                La tua donazione di {donationService.formatAmount(donationData.amount)} è stata elaborata con successo.
              </p>
              <p className="text-sm text-gray-500">
                {donationService.getImpactMessage(donationData.amount)}
              </p>
              <button
                onClick={handleClose}
                className="btn-primary"
              >
                Chiudi
              </button>
            </div>
          )}

          {step === 'error' && (
            <div className="text-center space-y-4">
              <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-900">
                Errore nel pagamento
              </h3>
              <p className="text-gray-600">{error}</p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setStep('form')}
                  className="btn-secondary"
                >
                  Riprova
                </button>
                <button
                  onClick={handleClose}
                  className="btn-primary"
                >
                  Chiudi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
