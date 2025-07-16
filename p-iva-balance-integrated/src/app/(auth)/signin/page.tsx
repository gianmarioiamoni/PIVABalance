'use client';

import { useState, useEffect } from 'react';
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
        onError: (error: any) => {
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

    // Handle server-side error messages
    const errorMessage = error?.response?.data?.message || error?.message;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Logo/Brand */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-indigo-600 mb-2">P.IVA Balance</h1>
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Accedi al tuo account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Oppure{' '}
                        <Link
                            href="/signup"
                            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                        >
                            crea un nuovo account
                        </Link>
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
                    {/* Success message from signup */}
                    {message && (
                        <div className="mb-4 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded-md">
                            <span className="block sm:inline">{decodeURIComponent(message)}</span>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Server Error */}
                        {errorMessage && (
                            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
                                <span className="block sm:inline">{escapeHtml(errorMessage)}</span>
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-colors ${validationErrors.email
                                            ? 'border-red-300 focus:border-red-500'
                                            : 'border-gray-300 focus:border-indigo-500'
                                        }`}
                                    placeholder="esempio@email.com"
                                />
                                {validationErrors.email && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                                )}
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                                    className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-colors ${validationErrors.password
                                            ? 'border-red-300 focus:border-red-500'
                                            : 'border-gray-300 focus:border-indigo-500'
                                        }`}
                                    placeholder="Inserisci la tua password"
                                />
                                {/* Password visibility toggle */}
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    <span className="text-gray-400 hover:text-gray-600 text-sm">
                                        {showPassword ? '👁️‍🗨️' : '👁️'}
                                    </span>
                                </button>
                                {validationErrors.password && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                                className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
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