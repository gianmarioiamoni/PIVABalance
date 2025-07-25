'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { authService, type SignInCredentials } from '@/services/authService';
import { useAuth } from '@/hooks/auth/useAuth';
import { sanitizeInput, escapeHtml, isValidEmail } from '@/utils/security';
import { LoadingSpinner } from '@/components/ui';
import { AuthErrorBoundary } from '@/components/error-boundaries';

// Disable prerendering for this page to avoid SSR issues
export const dynamic = 'force-dynamic';

/**
 * SignIn Content Component
 * Contains the actual signin form logic including useSearchParams
 */
function SignInContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setToken } = useAuth();
    const [formData, setFormData] = useState<SignInCredentials>({
        email: '',
        password: '',
    });
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);

    // Handle redirect from signup or other pages
    const redirect = searchParams.get('redirect') || '/dashboard';
    const message = searchParams.get('message');

    const {
        mutate: signIn,
        isPending: isLoading,
        error
    } = useMutation({
        mutationFn: (credentials: SignInCredentials) => authService.signIn(credentials),
        onSuccess: async (data) => {
            try {
                const userData = await setToken(data.token);
                if (userData) {
                    // Clean URL and redirect
                    window.history.replaceState({}, '', '/signin');
                    router.push(redirect);
                } else {
                    throw new Error('Failed to authenticate user');
                }
            } catch (error) {
                console.error('Authentication error:', error);
            }
        },
        onError: (error: unknown) => {
            console.error('Sign in error:', error);
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous validation errors
        setValidationErrors({});

        // Client-side validation
        const newErrors: Record<string, string> = {};

        if (!formData.email) {
            newErrors.email = 'Email è obbligatoria';
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Formato email non valido';
        }

        if (!formData.password) {
            newErrors.password = 'Password è obbligatoria';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password troppo corta';
        }

        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors);
            return;
        }

        signIn(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: sanitizeInput(value)
        }));

        // Clear validation error for this field
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    return (
        <div className="min-h-screen surface-secondary flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-lg md:max-w-2xl lg:max-w-max">
                {/* Logo/Brand */}
                <div className="text-center">
                    <h1 className="heading-lg text-brand-primary mb-2">P.IVA Balance</h1>
                    <h2 className="heading-xl text-primary">
                        Accedi al tuo account
                    </h2>
                    <p className="mt-2 body-md text-secondary">
                        Oppure{' '}
                        <Link
                            href="/signup"
                            className="font-medium text-brand-primary hover:text-brand-primary-hover transition-colors"
                        >
                            crea un nuovo account
                        </Link>
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg md:max-w-2xl lg:max-w-max">
                <div className="surface-primary py-8 px-6 shadow-xl rounded-2xl sm:px-10 md:px-16 lg:px-20">
                    {/* Success message from signup */}
                    {message ? (
                        <div className="mb-4 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded-md">
                            <span className="block sm:inline">{decodeURIComponent(message)}</span>
                        </div>
                    ) : null}

                    <form className="space-y-6 w-full max-w-2xl mx-auto" onSubmit={handleSubmit}>
                        {error ? (
                            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
                                <span className="block sm:inline">{escapeHtml(error instanceof Error ? error.message : "Errore durante il login")}</span>
                            </div>
                        ) : null}

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block body-sm font-medium text-primary">
                                Indirizzo email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full px-4 py-3 border rounded-xl shadow-sm text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary body-md transition-colors ${validationErrors.email
                                        ? 'border-red-300 focus:border-red-500'
                                        : 'border-gray-200 focus:border-brand-primary'
                                        }`}
                                    placeholder="esempio@email.com"
                                />
                                {validationErrors.email ? (
                                    <p className="mt-1 body-sm text-red-600">{validationErrors.email}</p>
                                ) : null}
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block body-sm font-medium text-primary">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full px-4 py-3 pr-12 border rounded-xl shadow-sm text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary body-md transition-colors ${validationErrors.password
                                        ? 'border-red-300 focus:border-red-500'
                                        : 'border-gray-200 focus:border-brand-primary'
                                        }`}
                                    placeholder="Inserisci la tua password"
                                />
                                {/* Password visibility toggle */}
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    <span className="text-gray-400 hover:text-gray-600 body-md">
                                        {showPassword ? '👁️‍🗨️' : '👁️'}
                                    </span>
                                </button>
                                {validationErrors.password ? (
                                    <p className="mt-1 body-sm text-red-600">{validationErrors.password}</p>
                                ) : null}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-base btn-primary w-full py-3 px-4 rounded-xl body-md font-medium transition-all duration-200 hover:scale-105"
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

                        {/* Additional Links */}
                        <div className="text-center">
                            <Link
                                href="/forgot-password"
                                className="body-sm text-brand-primary hover:text-brand-primary-hover transition-colors"
                            >
                                Password dimenticata?
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

/**
 * SignIn Page Component
 * Enhanced with better UX, validation, and security
 * Wrapped with Suspense to handle SSR compatibility
 * Protected with AuthErrorBoundary for robust error handling
 */
export default function SignInPage() {
    return (
        <AuthErrorBoundary authType="signin">
            <Suspense fallback={
                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            }>
                <SignInContent />
            </Suspense>
        </AuthErrorBoundary>
    );
} 