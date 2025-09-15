'use client';

import React, { useState, useEffect } from 'react';
import { UserResponse } from '@/types';
import { api } from '@/services/api';
import {
    XMarkIcon,
    UserIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

/**
 * Edit User Modal Component
 * 
 * Allows admins to modify user properties:
 * - Name
 * - Role (user, admin, super_admin)
 * - Active status
 * 
 * Features:
 * - Form validation
 * - Role-based restrictions
 * - Real-time feedback
 * - Responsive design
 */

interface EditUserModalProps {
    user: UserResponse;
    isOpen: boolean;
    onClose: () => void;
    onUserUpdated: (updatedUser: UserResponse) => void;
}

interface FormData {
    name: string;
    role: 'user' | 'admin' | 'super_admin';
    isActive: boolean;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
    user,
    isOpen,
    onClose,
    onUserUpdated
}) => {
    const [formData, setFormData] = useState<FormData>({
        name: user.name,
        role: user.role,
        isActive: user.isActive
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Reset form when user changes
    useEffect(() => {
        setFormData({
            name: user.name,
            role: user.role,
            isActive: user.isActive
        });
        setError('');
        setSuccess('');
    }, [user]);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (loading) return;

        try {
            setLoading(true);
            setError('');
            setSuccess('');

            // Check if there are any changes
            const hasChanges =
                formData.name !== user.name ||
                formData.role !== user.role ||
                formData.isActive !== user.isActive;

            if (!hasChanges) {
                setError('Nessuna modifica da salvare');
                return;
            }

            // Build update data (only send changed fields)
            const updateData: Partial<FormData> = {};
            if (formData.name !== user.name) updateData.name = formData.name;
            if (formData.role !== user.role) updateData.role = formData.role;
            if (formData.isActive !== user.isActive) updateData.isActive = formData.isActive;

            const response = await api.put<UserResponse>(`/admin/users/${user.id}`, updateData);

            setSuccess('Utente aggiornato con successo');
            onUserUpdated(response);

            // Close modal after a brief delay
            setTimeout(() => {
                onClose();
            }, 1500);

        } catch (err: any) {
            console.error('Error updating user:', err);

            if (err?.data?.errors && Array.isArray(err.data.errors)) {
                // Handle validation errors
                const errorMessages = err.data.errors.map((e: any) => e.message).join(', ');
                setError(errorMessages);
            } else {
                setError(err?.data?.message || 'Errore durante l\'aggiornamento');
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes
    const handleInputChange = (field: keyof FormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError('');
        setSuccess('');
    };

    // Role options
    const roleOptions = [
        { value: 'user', label: 'Utente', icon: UserIcon, description: 'Accesso base alle funzionalità' },
        { value: 'admin', label: 'Amministratore', icon: ShieldCheckIcon, description: 'Gestione utenti e monitoring' },
        { value: 'super_admin', label: 'Super Admin', icon: ExclamationTriangleIcon, description: 'Controllo completo del sistema' }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        Modifica Utente
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* User Info */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nome
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="input-field"
                            placeholder="Nome completo"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Role Field */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                            Ruolo
                        </label>
                        <div className="space-y-2">
                            {roleOptions.map((option) => {
                                const Icon = option.icon;
                                return (
                                    <label
                                        key={option.value}
                                        className={`flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${formData.role === option.value
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value={option.value}
                                            checked={formData.role === option.value}
                                            onChange={(e) => handleInputChange('role', e.target.value as any)}
                                            className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
                                            disabled={loading}
                                        />
                                        <Icon className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {option.label}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {option.description}
                                            </div>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Active Status */}
                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                disabled={loading}
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                Account attivo
                            </span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                            Gli account disattivati non possono accedere al sistema
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <div className="flex">
                                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                            <div className="flex">
                                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                                <div className="ml-3">
                                    <p className="text-sm text-green-700">{success}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 btn-secondary"
                            disabled={loading}
                        >
                            Annulla
                        </button>
                        <button
                            type="submit"
                            className="flex-1 btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Salvando...
                                </div>
                            ) : (
                                'Salva Modifiche'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
