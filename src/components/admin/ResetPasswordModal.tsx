'use client';

import React, { useState } from 'react';
import { UserResponse } from '@/types';
import { api } from '@/services/api';
import {
    XMarkIcon,
    KeyIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ClipboardDocumentIcon,
    EyeIcon,
    EyeSlashIcon
} from '@heroicons/react/24/outline';

/**
 * Reset Password Modal Component
 * 
 * Allows admins to reset user passwords and generate temporary passwords.
 * 
 * Features:
 * - Secure temporary password generation
 * - Password visibility toggle
 * - Copy to clipboard functionality
 * - Clear security warnings
 * - Responsive design
 */

interface ResetPasswordModalProps {
    user: UserResponse;
    isOpen: boolean;
    onClose: () => void;
}

interface ResetPasswordResponse {
    success: boolean;
    message: string;
    data: {
        temporaryPassword: string;
        userEmail: string;
        userName: string;
    };
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
    user,
    isOpen,
    onClose
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [temporaryPassword, setTemporaryPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState<'confirm' | 'result'>('confirm');

    // Reset modal state when opening/closing
    React.useEffect(() => {
        if (isOpen) {
            setStep('confirm');
            setError('');
            setSuccess('');
            setTemporaryPassword('');
            setShowPassword(false);
        }
    }, [isOpen]);

    // Handle password reset
    const handleResetPassword = async () => {
        if (loading) return;

        try {
            setLoading(true);
            setError('');

            const response = await api.post<ResetPasswordResponse>(
                `/admin/users/${user.id}/reset-password`,
                {}
            );

            setTemporaryPassword(response.data.temporaryPassword);
            setSuccess('Password resettata con successo');
            setStep('result');

        } catch (err: any) {
            console.error('Error resetting password:', err);
            setError(err?.data?.message || 'Errore durante il reset della password');
        } finally {
            setLoading(false);
        }
    };

    // Copy password to clipboard
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(temporaryPassword);
            // You could show a brief "Copied!" message here
        } catch (err) {
            console.error('Failed to copy password:', err);
        }
    };

    // Handle modal close
    const handleClose = () => {
        setStep('confirm');
        setError('');
        setSuccess('');
        setTemporaryPassword('');
        setShowPassword(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <KeyIcon className="h-6 w-6 text-yellow-500" />
                        <h3 className="text-lg font-medium text-gray-900">
                            Reset Password
                        </h3>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {step === 'confirm' && (
                    <>
                        {/* User Info */}
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                        </div>

                        {/* Warning */}
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                            <div className="flex">
                                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                                <div className="ml-3">
                                    <h4 className="text-sm font-medium text-yellow-800">
                                        Attenzione
                                    </h4>
                                    <div className="mt-1 text-sm text-yellow-700">
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>La password attuale dell'utente verrà sostituita</li>
                                            <li>Verrà generata una password temporanea sicura</li>
                                            <li>L'utente dovrà usare la nuova password per accedere</li>
                                            <li>Si consiglia di comunicare la password in modo sicuro</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
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
                                onClick={handleResetPassword}
                                className="flex-1 btn-danger"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Resettando...
                                    </div>
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </div>
                    </>
                )}

                {step === 'result' && (
                    <>
                        {/* Success Message */}
                        {success && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                                <div className="flex">
                                    <CheckCircleIcon className="h-5 w-5 text-green-400" />
                                    <div className="ml-3">
                                        <p className="text-sm text-green-700">{success}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* New Password Display */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nuova Password Temporanea
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={temporaryPassword}
                                    readOnly
                                    className="input-field pr-20 font-mono text-sm"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                                        title={showPassword ? 'Nascondi password' : 'Mostra password'}
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="h-4 w-4" />
                                        ) : (
                                            <EyeIcon className="h-4 w-4" />
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={copyToClipboard}
                                        className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                                        title="Copia negli appunti"
                                    >
                                        <ClipboardDocumentIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <h4 className="text-sm font-medium text-blue-800 mb-2">
                                Prossimi Passi
                            </h4>
                            <div className="text-sm text-blue-700 space-y-1">
                                <p>1. Copia la password temporanea</p>
                                <p>2. Comunica la password all'utente in modo sicuro</p>
                                <p>3. L'utente potrà accedere con la nuova password</p>
                                <p>4. Consiglia all'utente di cambiarla dal proprio account</p>
                            </div>
                        </div>

                        {/* Close Action */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="btn-primary"
                            >
                                Chiudi
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
