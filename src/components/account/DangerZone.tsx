'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import { 
  ExclamationTriangleIcon,
  TrashIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';

/**
 * Danger Zone Component
 * 
 * Handles destructive account operations with maximum security:
 * - Account deletion with double confirmation
 * - Password verification (when applicable)
 * - Clear warnings and irreversible operation notices
 * - Complete data cleanup information
 * - Immediate session termination after deletion
 */
export const DangerZone: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [error, setError] = useState('');

  const isGoogleUser = user?.googleId && !user?.password;
  const requiredConfirmationText = 'ELIMINA IL MIO ACCOUNT';

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setError('');

    try {
      // Use a custom request since delete method doesn't support body
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          password: isGoogleUser ? '' : password,
          confirmationText,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete account');
      }

      // Account successfully deleted - logout and redirect
      logout();
      router.push('/?deleted=true');

    } catch (err: any) {
      console.error('Account deletion error:', err);
      
      // Handle different types of errors with user-friendly messages
      let errorMessage = 'Errore durante l\'eliminazione dell\'account';
      
      if (err?.message) {
        if (err.message.includes('400')) {
          errorMessage = 'Dati di conferma non validi. Controlla password e testo di conferma.';
        } else if (err.message.includes('401')) {
          errorMessage = 'Sessione scaduta. Effettua nuovamente il login.';
        } else if (err.message.includes('500')) {
          errorMessage = 'Errore del server. Riprova più tardi.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setShowConfirmation(false);
    setPassword('');
    setConfirmationText('');
    setError('');
  };

  return (
    <div className="card border-red-200">
      <div className="card-header bg-red-50">
        <div className="flex items-center space-x-2">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
          <h3 className="heading-sm text-red-800">Zona Pericolosa</h3>
        </div>
      </div>

      <div className="card-body">
        {/* Warning Notice */}
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <ShieldExclamationIcon className="h-5 w-5 text-red-400 mt-0.5" />
            <div className="ml-3">
              <h4 className="text-sm font-medium text-red-800 mb-1">
                Attenzione: Operazione Irreversibile
              </h4>
              <div className="text-sm text-red-700">
                <p className="mb-2">L'eliminazione dell'account comporterà:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Cancellazione permanente di tutti i tuoi dati</li>
                  <li>Rimozione di tutte le fatture e documenti</li>
                  <li>Eliminazione di tutti i costi registrati</li>
                  <li>Perdita delle impostazioni e configurazioni</li>
                  <li>Impossibilità di recuperare i dati</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {!showConfirmation ? (
          /* Initial Delete Button */
          <div className="text-center">
            <button
              onClick={() => setShowConfirmation(true)}
              className="btn-danger inline-flex items-center"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Elimina Account
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Questa operazione richiederà una conferma aggiuntiva
            </p>
          </div>
        ) : (
          /* Confirmation Form */
          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Password Verification (for non-Google users) */}
            {!isGoogleUser && (
              <div>
                <label htmlFor="deletePassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Conferma la tua password
                </label>
                <input
                  type="password"
                  id="deletePassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Inserisci la tua password per confermare"
                  required
                />
              </div>
            )}

            {/* Confirmation Text */}
            <div>
              <label htmlFor="confirmationText" className="block text-sm font-medium text-gray-700 mb-2">
                Per confermare, scrivi: <code className="bg-gray-100 px-1 rounded text-red-600 font-mono">
                  {requiredConfirmationText}
                </code>
              </label>
              <input
                type="text"
                id="confirmationText"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                className="input-field"
                placeholder={requiredConfirmationText}
                required
              />
            </div>

            {/* Data Export Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800">
                    Vuoi salvare i tuoi dati?
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Se desideri conservare una copia dei tuoi dati, ti consigliamo di esportarli 
                    prima di eliminare l'account. Vai alla sezione Impostazioni per esportare i dati.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button
                onClick={resetForm}
                disabled={isDeleting}
                className="btn-secondary"
              >
                Annulla
              </button>

              <button
                onClick={handleDeleteAccount}
                disabled={
                  isDeleting || 
                  (!isGoogleUser && !password) || 
                  confirmationText !== requiredConfirmationText
                }
                className="btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Eliminando...
                  </>
                ) : (
                  <>
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Elimina Definitivamente
                  </>
                )}
              </button>
            </div>

            {/* Final Warning */}
            <div className="text-center text-sm text-red-600 font-medium">
              ⚠️ Questa operazione è IRREVERSIBILE ⚠️
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
