'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { authService, type SignInCredentials } from '@/services/authService';
import { useAuth } from '@/hooks/auth/useAuth';
import { sanitizeInput, escapeHtml, isValidEmail } from '@/utils/security';
import { LoadingSpinner } from '@/components/ui';

/**
 * SignIn Page Component
 * Enhanced with better UX, validation, and security
 */
export default function SignInPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setToken } = useAuth();
    const [formData, setFormData] = useState<SignInCredentials>({
        email: '',
        password: '',
    });
    const [validationErrors, setValidationErrors] = useState<{
        email?: string;
        password?: string;
    }>({});
    const [showPassword, setShowPassword] = useState(false);

    // Get success message from signup
    const message = searchParams?.get('message');

    const signInMutation = useMutation({
        mutationFn: authService.signIn,
        onSuccess: (data) => {
            setToken(data.token);
            // Clear any existing errors
            setValidationErrors({});
            // Redirect to dashboard
            router.push('/dashboard');
        },
        onError: (error: Error) => {
            console.error('SignIn error:', error);
            // Handle specific validation errors
            if (error.message.includes('email')) {
                setValidationErrors({ email: error.message });
            } else if (error.message.includes('password')) {
                setValidationErrors({ password: error.message });
            } else {
                setValidationErrors({
                    email: 'Credenziali non valide. Verifica email e password.'
                });
            }
        },
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Clear validation errors when user starts typing
        if (validationErrors[name as keyof typeof validationErrors]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }

        setFormData(prev => ({
            ...prev,
            [name]: sanitizeInput(value),
        }));
    };

    const validateForm = (): boolean => {
        const errors: typeof validationErrors = {};

        if (!formData.email.trim()) {
            errors.email = 'Email è obbligatorio';
        } else if (!isValidEmail(formData.email)) {
            errors.email = 'Formato email non valido';
        }

        if (!formData.password.trim()) {
            errors.password = 'Password è obbligatorio';
        } else if (formData.password.length < 6) {
            errors.password = 'Password deve contenere almeno 6 caratteri';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        signInMutation.mutate(formData);
    };

    const { isLoading, error } = signInMutation;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100">
                        <svg
                            className="h-6 w-6 text-indigo-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Accedi al tuo account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Oppure{' '}
                        <Link
                            href="/signup"
                            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                        >
                            crea un nuovo account
                        </Link>
                    </p>
                </div>

                <div className="mt-8 bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
                    {/* Success message from signup */}
                    {message ? (
                        <div className="mb-4 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded-md">
                            <span className="block sm:inline">{decodeURIComponent(message)}</span>
                        </div>
                    ) : null}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error ? (
                            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
                                <span className="block sm:inline">{escapeHtml(error.message || 'Errore durante il login')}</span>
                            </div>
                        ) : null}

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-colors ${validationErrors.email
                                        ? 'border-red-300 focus:border-red-500'
                                        : 'border-gray-300 focus:border-indigo-500'
                                        }`}
                                    placeholder="Email"
                                />
                                {validationErrors.email ? (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                                ) : null}
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-colors ${validationErrors.password
                                        ? 'border-red-300 focus:border-red-500'
                                        : 'border-gray-300 focus:border-indigo-500'
                                        }`}
                                    placeholder="Password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    <span className="text-gray-400 hover:text-gray-600 text-sm">
                                        {showPassword ? 'Nascondi' : 'Mostra'}
                                    </span>
                                </button>
                                {validationErrors.password ? (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                                ) : null}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? (
                                    <>
                                        <LoadingSpinner size="sm" className="mr-2" />
                                        Accesso in corso...
                                    </>
                                ) : (
                                    'Accedi'
                                )}
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <Link
                                    href="/forgot-password"
                                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                                >
                                    Password dimenticata?
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 