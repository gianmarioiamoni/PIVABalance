'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { api } from '@/services/api';
import { UserIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

/**
 * Profile Section Component
 * 
 * Handles user profile information display and editing.
 * Features:
 * - Display current user information
 * - Edit name/profile data
 * - Read-only email display
 * - Form validation and error handling
 * - Success feedback
 */
export const ProfileSection: React.FC = () => {
  const { user, refetch } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationError, setValidationError] = useState('');

  // Initialize form with user data
  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Client-side validation
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      setError('Il nome è obbligatorio');
      setIsLoading(false);
      return;
    }
    
    if (trimmedName.length < 2) {
      setError('Il nome deve essere di almeno 2 caratteri');
      setIsLoading(false);
      return;
    }
    
    if (trimmedName.length > 100) {
      setError('Il nome non può superare i 100 caratteri');
      setIsLoading(false);
      return;
    }
    
    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmedName)) {
      setError('Il nome può contenere solo lettere, spazi, apostrofi e trattini');
      setIsLoading(false);
      return;
    }

    try {
      await api.put('/auth/update-profile', { name: name.trim() });

      // Refresh user data
      await refetch();

      setSuccess('Profilo aggiornato con successo!');
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);

    } catch (err: any) {
      console.error('Profile update error:', err);
      
      // Handle different types of errors with user-friendly messages
      let errorMessage = 'Errore durante l\'aggiornamento del profilo';
      
      if (err?.data?.details) {
        // Handle validation errors from Zod
        const details = err.data.details;
        if (details.name) {
          errorMessage = details.name[0] || 'Nome non valido';
        }
      } else if (err?.data?.error) {
        // Handle API error messages
        errorMessage = err.data.error;
      } else if (err?.message) {
        // Handle other error messages
        if (err.message.includes('400')) {
          errorMessage = 'Dati non validi. Controlla che il nome contenga solo lettere, spazi, apostrofi e trattini.';
        } else if (err.message.includes('401')) {
          errorMessage = 'Sessione scaduta. Effettua nuovamente il login.';
        } else if (err.message.includes('500')) {
          errorMessage = 'Errore del server. Riprova più tardi.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Real-time validation
  const validateName = (value: string) => {
    const trimmedValue = value.trim();
    
    if (!trimmedValue && value.length > 0) {
      return 'Il nome non può essere vuoto';
    }
    
    if (trimmedValue.length > 0 && trimmedValue.length < 2) {
      return 'Il nome deve essere di almeno 2 caratteri';
    }
    
    if (trimmedValue.length > 100) {
      return 'Il nome non può superare i 100 caratteri';
    }
    
    if (trimmedValue && !/^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmedValue)) {
      return 'Il nome può contenere solo lettere, spazi, apostrofi e trattini';
    }
    
    return '';
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    
    // Clear previous errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
    
    // Real-time validation
    const validation = validateName(value);
    setValidationError(validation);
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setIsEditing(false);
    setError('');
    setSuccess('');
    setValidationError('');
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center space-x-2">
          <UserIcon className="h-5 w-5 text-primary" />
          <h3 className="heading-sm">Informazioni Personali</h3>
        </div>
      </div>

      <div className="card-body">
        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <EnvelopeIcon className="inline h-4 w-4 mr-2" />
              Email
            </label>
            <div className="relative">
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="input-field bg-gray-50 cursor-not-allowed"
            />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Non modificabile
                </span>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              L'email non può essere modificata per motivi di sicurezza.
            </p>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              <UserIcon className="inline h-4 w-4 mr-2" />
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              disabled={!isEditing}
              className={`input-field ${!isEditing ? 'bg-gray-50' : ''} ${validationError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Inserisci il tuo nome completo"
              required
              minLength={2}
              maxLength={100}
            />
            {validationError && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <span className="inline-block w-4 h-4 mr-1">⚠️</span>
                {validationError}
              </p>
            )}
            {!validationError && (
              <p className="mt-1 text-sm text-gray-500">
                Il nome verrà utilizzato nelle fatture e nei documenti generati.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                Modifica Profilo
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isLoading || !name.trim() || !!validationError}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Salvataggio...' : 'Salva Modifiche'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="btn-secondary"
                >
                  Annulla
                </button>
              </div>
            )}

            {/* Account Info */}
            <div className="text-right text-sm text-gray-500">
              <p>Account creato: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('it-IT') : 'N/A'}</p>
              {user?.googleId && (
                <p className="text-blue-600">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                  Connesso con Google
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
