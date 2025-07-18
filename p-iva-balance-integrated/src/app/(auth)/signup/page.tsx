'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { authService, type SignUpData } from '@/services/authService';
import { sanitizeInput, escapeHtml, isValidEmail, isValidPassword } from '@/utils/security';
import { LoadingSpinner } from '@/components/ui';
import { AuthErrorBoundary } from '@/components/error-boundaries';

// Disable prerendering for this page to avoid SSR issues
export const dynamic = 'force-dynamic';

/**
 * SignUp Content Component
 * Contains the actual signup form logic including useSearchParams
 */
function SignUpContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState<SignUpData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Handle redirect parameter
    const redirect = searchParams.get('redirect') || '/dashboard';

    const {
        mutate: signUp,
        isPending: isLoading,
        error
    } = useMutation({
        mutationFn: (userData: SignUpData) => authService.signUp(userData),
        onSuccess: () => {
            // Redirect to signin with success message
            const message = encodeURIComponent('Account creato con successo! Ora puoi effettuare il login.');
            router.push(`/signin?message=${message}&redirect=${encodeURIComponent(redirect)}`);
        },
        onError: (error: unknown) => {
            console.error('Sign up error:', error);
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous validation errors
        setValidationErrors({});

        // Client-side validation
        const newErrors: Record<string, string> = {};

        if (!formData.name) {
            newErrors.name = 'Nome è obbligatorio';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Nome troppo corto';
        }

        if (!formData.email) {
            newErrors.email = 'Email è obbligatoria';
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Formato email non valido';
        }

        if (!formData.password) {
            newErrors.password = 'Password è obbligatoria';
        } else {
            const passwordValidation = isValidPassword(formData.password);
            if (!passwordValidation.isValid) {
                newErrors.password = passwordValidation.errors[0];
            }
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Conferma password è obbligatoria';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Le password non corrispondono';
        }

        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors);
            return;
        }

        signUp(formData);
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Logo/Brand */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-indigo-600 mb-2">P.IVA Balance</h1>
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Crea il tuo account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Oppure{' '}
                        <Link
                            href="/signin"
                            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                        >
                            accedi con il tuo account esistente
                        </Link>
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error ? (
                            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
                                <span className="block sm:inline">{escapeHtml(error instanceof Error ? error.message : "Errore durante la registrazione")}</span>
                            </div>
                        ) : null}

                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Nome completo
                            </label>
                            <div className="mt-1">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-colors ${validationErrors.name
                                        ? 'border-red-300 focus:border-red-500'
                                        : 'border-gray-300 focus:border-indigo-500'
                                        }`}
                                    placeholder="Mario Rossi"
                                />
                                {validationErrors.name ? (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                                ) : null}
                            </div>
                        </div>

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
                                {validationErrors.email ? (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                                ) : null}
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
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-colors ${validationErrors.password
                                        ? 'border-red-300 focus:border-red-500'
                                        : 'border-gray-300 focus:border-indigo-500'
                                        }`}
                                    placeholder="Crea una password sicura"
                                />
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
                                {validationErrors.password ? (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                                ) : null}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Minimo 8 caratteri, almeno una lettera maiuscola, una minuscola e un numero
                            </p>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Conferma password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-colors ${validationErrors.confirmPassword
                                        ? 'border-red-300 focus:border-red-500'
                                        : 'border-gray-300 focus:border-indigo-500'
                                        }`}
                                    placeholder="Ripeti la password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    tabIndex={-1}
                                >
                                    <span className="text-gray-400 hover:text-gray-600 text-sm">
                                        {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
                                    </span>
                                </button>
                                {validationErrors.confirmPassword ? (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                                ) : null}
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
                                        Registrazione in corso...
                                    </>
                                ) : (
                                    'Crea account'
                                )}
                            </button>
                        </div>

                        {/* Terms and Privacy */}
                        <div className="text-center">
                            <p className="text-xs text-gray-500">
                                Creando un account accetti i nostri{' '}
                                <Link
                                    href="/terms"
                                    className="text-indigo-600 hover:text-indigo-500"
                                >
                                    Termini di Servizio
                                </Link>{' '}
                                e{' '}
                                <Link
                                    href="/privacy"
                                    className="text-indigo-600 hover:text-indigo-500"
                                >
                                    Privacy Policy
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

/**
 * SignUp Page Component
 * Enhanced with comprehensive validation, better UX, and security
 * Wrapped with Suspense to handle SSR compatibility
 * Protected with AuthErrorBoundary for robust error handling
 */
export default function SignUpPage() {
    return (
        <AuthErrorBoundary authType="signup">
            <Suspense fallback={
                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            }>
                <SignUpContent />
            </Suspense>
        </AuthErrorBoundary>
    );
} 