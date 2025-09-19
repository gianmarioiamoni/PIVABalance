'use client';

import React, { useState } from 'react';
import { UserResponse } from '@/types';
import { api } from '@/services/api';
import {
    XMarkIcon,
    ExclamationTriangleIcon,
    TrashIcon
} from '@heroicons/react/24/outline';

/**
 * Delete User Modal Component
 * 
 * Provides a secure confirmation dialog for user deletion.
 * 
 * Features:
 * - Double confirmation requirement
 * - Clear warning about data loss
 * - User information display
 * - Loading states
 * - Error handling
 */

interface DeleteUserModalProps {
    user: UserResponse;
    isOpen: boolean;
    onClose: () => void;
    onUserDeleted: (deletedUserId: string) => void;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
    user,
    isOpen,
    onClose,
    onUserDeleted
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [confirmText, setConfirmText] = useState('');

    // Reset modal state when opening/closing
    React.useEffect(() => {
        if (isOpen) {
            setError('');
            setConfirmText('');
        }
    }, [isOpen]);

    // Handle user deletion
    const handleDeleteUser = async () => {
        if (loading) return;

        // Require confirmation text
        if (confirmText !== 'ELIMINA') {
            setError('Devi digitare "ELIMINA" per confermare');
            return;
        }

        try {
            setLoading(true);
            setError('');

            await api.delete(`/admin/users/${user.id}`);

            onUserDeleted(user.id);
            onClose();

        } catch (err: unknown) {
            console.error('Error deleting user:', err);

            let errorMessage = 'Errore durante l\'eliminazione';
            if (err instanceof Error) {
                errorMessage = err.message;
            } else if (typeof err === 'object' && err !== null) {
                const errorObj = err as { data?: { message?: string }; message?: string };
                if (errorObj.data?.message) {
                    errorMessage = errorObj.data.message;
                } else if (errorObj.message) {
                    errorMessage = errorObj.message;
                }
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Handle modal close
    const handleClose = () => {
        setError('');
        setConfirmText('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <TrashIcon className="h-6 w-6 text-red-500" />
                        <h3 className="text-lg font-medium text-gray-900">
                            Elimina Utente
                        </h3>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                        disabled={loading}
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* User Info */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="mt-2 flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                            {user.role === 'super_admin' ? 'Super Admin' :
                                user.role === 'admin' ? 'Admin' : 'Utente'}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {user.isActive ? 'Attivo' : 'Sospeso'}
                        </span>
                    </div>
                </div>

                {/* Warning */}
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-400 flex-shrink-0" />
                        <div className="ml-3">
                            <h4 className="text-sm font-medium text-red-800">
                                Attenzione: Azione Irreversibile
                            </h4>
                            <div className="mt-2 text-sm text-red-700">
                                <p className="mb-2">
                                    Stai per eliminare definitivamente questo utente. Questa azione:
                                </p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Rimuoverà permanentemente l&apos;account utente</li>
                                    <li>Eliminerà tutti i dati associati</li>
                                    <li>Non potrà essere annullata</li>
                                    <li>L&apos;utente perderà immediatamente l&apos;accesso</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Confirmation Input */}
                <div className="mb-4">
                    <label htmlFor="confirmText" className="block text-sm font-medium text-gray-700 mb-2">
                        Per confermare, digita <span className="font-mono bg-gray-100 px-1 rounded">ELIMINA</span>
                    </label>
                    <input
                        type="text"
                        id="confirmText"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        className="input-field font-mono"
                        placeholder="Digita ELIMINA per confermare"
                        disabled={loading}
                        autoComplete="off"
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex">
                            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 btn-secondary"
                        disabled={loading}
                    >
                        Annulla
                    </button>
                    <button
                        type="button"
                        onClick={handleDeleteUser}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading || confirmText !== 'ELIMINA'}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Eliminando...
                            </div>
                        ) : (
                            'Elimina Definitivamente'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
