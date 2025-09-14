'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
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
  const { data: session, update: updateSession } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Initialize form with session data
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      // Update session with new data
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name: data.user.name,
        },
      });

      setSuccess('Profilo aggiornato con successo!');
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante l\'aggiornamento del profilo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName(session?.user?.name || '');
    setIsEditing(false);
    setError('');
    setSuccess('');
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
                value={session?.user?.email || ''}
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
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
              className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
              placeholder="Inserisci il tuo nome completo"
              required
              minLength={2}
              maxLength={100}
            />
            <p className="mt-1 text-sm text-gray-500">
              Il nome verrà utilizzato nelle fatture e nei documenti generati.
            </p>
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
                  disabled={isLoading || !name.trim()}
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
              <p>Account creato: {new Date(session?.user?.createdAt || '').toLocaleDateString('it-IT')}</p>
              {session?.user?.googleId && (
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
