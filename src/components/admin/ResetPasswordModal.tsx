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
    EyeSlashIcon,
    ArrowDownTrayIcon,
    ArrowPathIcon
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
    const [copied, setCopied] = useState(false);

    // Reset modal state when opening/closing
    React.useEffect(() => {
        if (isOpen) {
            setStep('confirm');
            setError('');
            setSuccess('');
            setTemporaryPassword('');
            setShowPassword(false);
            setCopied(false);
        }
    }, [isOpen]);

    // Handle password reset
    const handleResetPassword = async () => {
        if (loading) return;

        try {
            setLoading(true);
            setError('');

            const response = await api.post<{
                temporaryPassword: string;
                userEmail: string;
                userName: string;
            }>(`/admin/users/${user.id}/reset-password`, {});

            setTemporaryPassword(response.temporaryPassword);
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
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('Failed to copy password:', err);
        }
    };

    // Download credentials as text file
    const downloadCredentials = () => {
        const credentialsText = `CREDENZIALI DI ACCESSO TEMPORANEE
========================================

Utente: ${user.name}
Email: ${user.email}
Password Temporanea: ${temporaryPassword}

IMPORTANTE:
- Questa password è temporanea e deve essere cambiata al primo accesso
- Conserva questo file in modo sicuro
- Elimina questo file dopo aver comunicato le credenziali all'utente

Generato il: ${new Date().toLocaleString('it-IT')}
Generato da: Sistema Admin PIVABalance
`;

        const blob = new Blob([credentialsText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `credenziali_${user.email.replace('@', '_')}_${Date.now()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Regenerate password
    const handleRegeneratePassword = async () => {
        await handleResetPassword();
    };

    // Handle modal close
    const handleClose = () => {
        setStep('confirm');
        setError('');
        setSuccess('');
        setTemporaryPassword('');
        setShowPassword(false);
        setCopied(false);
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
                        <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
                            <div className="flex">
                                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400 flex-shrink-0" />
                                <div className="ml-3">
                                    <h4 className="text-sm font-semibold text-yellow-800 mb-2">
                                        ⚠️ ATTENZIONE - Azione Irreversibile
                                    </h4>
                                    <div className="text-sm text-yellow-700 space-y-2">
                                        <div className="font-medium text-yellow-800">
                                            La password temporanea sarà visibile SOLO UNA VOLTA:
                                        </div>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>La password attuale dell'utente verrà <strong>sostituita immediatamente</strong></li>
                                            <li>La password temporanea sarà mostrata <strong>solo in questo modal</strong></li>
                                            <li>Una volta chiuso il modal, <strong>non sarà più possibile recuperarla</strong></li>
                                            <li>Potrai scaricare un file con le credenziali o copiarle</li>
                                            <li>Se necessario, potrai rigenerare una nuova password</li>
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

                        {/* Critical Warning */}
                        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400 rounded-md">
                            <div className="flex">
                                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 flex-shrink-0" />
                                <div className="ml-3">
                                    <h4 className="text-sm font-semibold text-red-800">
                                        🚨 Password Temporanea Generata
                                    </h4>
                                    <p className="text-sm text-red-700 mt-1">
                                        <strong>IMPORTANTE:</strong> Questa password non sarà più visibile dopo aver chiuso questo modal. 
                                        Assicurati di copiarla o scaricare il file delle credenziali prima di continuare.
                                    </p>
                                </div>
                            </div>
                        </div>

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
                                    className="input-field pr-20 font-mono text-sm bg-yellow-50 border-yellow-300 focus:border-yellow-500"
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
                                        className={`p-1 focus:outline-none transition-colors ${
                                            copied 
                                                ? 'text-green-600 hover:text-green-700' 
                                                : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                        title={copied ? 'Copiato!' : 'Copia negli appunti'}
                                    >
                                        <ClipboardDocumentIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            {copied && (
                                <div className="mt-1 text-xs text-green-600 font-medium">
                                    ✓ Password copiata negli appunti!
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="mb-4 flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={downloadCredentials}
                                className="flex-1 btn-primary flex items-center justify-center"
                            >
                                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                                Scarica Credenziali
                            </button>
                            <button
                                type="button"
                                onClick={handleRegeneratePassword}
                                className="flex-1 btn-warning flex items-center justify-center"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Rigenerando...
                                    </div>
                                ) : (
                                    <>
                                        <ArrowPathIcon className="h-4 w-4 mr-2" />
                                        Rigenera Password
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Instructions */}
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <h4 className="text-sm font-medium text-blue-800 mb-2">
                                📋 Prossimi Passi
                            </h4>
                            <div className="text-sm text-blue-700 space-y-1">
                                <p><strong>1.</strong> Scarica il file delle credenziali o copia la password</p>
                                <p><strong>2.</strong> Comunica le credenziali all'utente tramite canale sicuro</p>
                                <p><strong>3.</strong> L'utente potrà accedere immediatamente con la nuova password</p>
                                <p><strong>4.</strong> Consiglia all'utente di cambiarla dalla sezione Account</p>
                                <p><strong>5.</strong> Elimina il file delle credenziali dopo l'uso</p>
                            </div>
                        </div>

                        {/* Close Action */}
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={() => setStep('confirm')}
                                className="btn-secondary flex items-center"
                            >
                                ← Torna Indietro
                            </button>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="btn-primary"
                            >
                                Ho Salvato le Credenziali - Chiudi
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
