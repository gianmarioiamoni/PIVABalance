'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { authService, type SignUpCredentials } from '@/services/authService';
import { sanitizeInput, escapeHtml, isValidEmail, isValidPassword } from '@/utils/security';
import { LoadingSpinner } from '@/components/ui';
import { AuthErrorBoundary } from '@/components/error-boundaries';

// Disable prerendering for this page to avoid SSR issues
export const dynamic = 'force-dynamic';

// Local type for signup form including confirm password
interface SignUpFormData extends SignUpCredentials {
    confirmPassword: string;
}

/**
 * SignUp Content Component
 * Contains the actual signup form logic including useSearchParams
 */
function SignUpContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState<SignUpFormData>({
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
        mutationFn: (userData: SignUpCredentials) => authService.signUp(userData),
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
        <div className="min-h-screen surface-secondary flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-lg md:max-w-2xl lg:max-w-max">
                {/* Logo/Brand */}
                <div className="text-center">
                    <h1 className="heading-lg text-brand-primary mb-2">P.IVA Balance</h1>
                    <h2 className="heading-xl text-primary">
                        Crea il tuo account
                    </h2>
                    <p className="mt-2 body-md text-secondary">
                        Oppure{' '}
                        <Link
                            href="/signin"
                            className="font-medium text-brand-primary hover:text-brand-primary-hover transition-colors"
                        >
                            accedi al tuo account
                        </Link>
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg md:max-w-2xl lg:max-w-max">
                <div className="surface-primary py-8 px-6 shadow-xl rounded-2xl sm:px-10 md:px-16 lg:px-20">
                    <form className="space-y-6 w-full max-w-2xl mx-auto" onSubmit={handleSubmit}>
                        {error ? (
                            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
                                <span className="block sm:inline">{escapeHtml(error instanceof Error ? error.message : "Errore durante la registrazione")}</span>
                            </div>
                        ) : null}

                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block body-sm font-medium text-primary">
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
                                    className={`appearance-none block w-full px-4 py-3 border rounded-xl shadow-sm text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary body-md transition-colors ${validationErrors.name
                                        ? 'border-red-300 focus:border-red-500'
                                        : 'border-gray-200 focus:border-brand-primary'
                                        }`}
                                    placeholder="Il tuo nome completo"
                                />
                                {validationErrors.name ? (
                                    <p className="mt-1 body-sm text-red-600">{validationErrors.name}</p>
                                ) : null}
                            </div>
                        </div>

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
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full px-4 py-3 pr-12 border rounded-xl shadow-sm text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary body-md transition-colors ${validationErrors.password
                                        ? 'border-red-300 focus:border-red-500'
                                        : 'border-gray-200 focus:border-brand-primary'
                                        }`}
                                    placeholder="Almeno 8 caratteri"
                                />
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

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block body-sm font-medium text-primary">
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
                                    className={`appearance-none block w-full px-4 py-3 pr-12 border rounded-xl shadow-sm text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary body-md transition-colors ${validationErrors.confirmPassword
                                        ? 'border-red-300 focus:border-red-500'
                                        : 'border-gray-200 focus:border-brand-primary'
                                        }`}
                                    placeholder="Ripeti la password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    tabIndex={-1}
                                >
                                    <span className="text-gray-400 hover:text-gray-600 body-md">
                                        {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
                                    </span>
                                </button>
                                {validationErrors.confirmPassword ? (
                                    <p className="mt-1 body-sm text-red-600">{validationErrors.confirmPassword}</p>
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
                                        Creazione in corso...
                                    </>
                                ) : (
                                    'Crea account'
                                )}
                            </button>
                        </div>

                        {/* Terms */}
                        <div className="text-center">
                            <p className="body-sm text-secondary">
                                Creando un account accetti i nostri{' '}
                                <Link href="/terms" className="text-brand-primary hover:text-brand-primary-hover">
                                    Termini di Servizio
                                </Link>{' '}
                                e{' '}
                                <Link href="/privacy" className="text-brand-primary hover:text-brand-primary-hover">
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