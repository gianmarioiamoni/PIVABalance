'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { authService, type SignUpCredentials } from '@/services/authService';
import { useAuth } from '@/hooks/auth/useAuth';
import { sanitizeInput, escapeHtml, isValidEmail, validatePassword } from '@/utils/security';
import { LoadingSpinner } from '@/components/ui';

/**
 * SignUp Page Component
 * Enhanced with real-time validation and password strength indicator
 */
export default function SignUpPage() {
    const router = useRouter();
    const { setToken } = useAuth();
    const [formData, setFormData] = useState<SignUpCredentials>({
        name: '',
        email: '',
        password: '',
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const {
        mutate: signUp,
        isPending: isLoading,
        error
    } = useMutation({
        mutationFn: (credentials: SignUpCredentials) => authService.signUp(credentials),
        onSuccess: async (data) => {
            try {
                const userData = await setToken(data.token);
                if (userData) {
                    // Redirect to signin with success message
                    router.push('/signin?message=' + encodeURIComponent('Account creato con successo! Benvenuto!'));
                } else {
                    throw new Error('Failed to authenticate user');
                }
            } catch (error) {
                console.error('Authentication error:', error);
            }
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

        if (!formData.name.trim()) {
            newErrors.name = 'Nome è obbligatorio';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Nome deve avere almeno 2 caratteri';
        }

        if (!formData.email) {
            newErrors.email = 'Email è obbligatoria';
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Formato email non valido';
        }

        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            newErrors.password = passwordValidation.errors[0];
        }

        if (formData.password !== confirmPassword) {
            newErrors.confirmPassword = 'Le password non coincidono';
        }

        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors);
            return;
        }

        signUp(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'confirmPassword') {
            setConfirmPassword(sanitizeInput(value));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: sanitizeInput(value)
            }));
        }

        // Clear validation error for this field
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Password strength calculation
    const passwordValidation = validatePassword(formData.password);
    const passwordStrength = formData.password.length === 0 ? 0 :
        passwordValidation.isValid ? 100 :
            Math.min(75, (formData.password.length / 8) * 50 +
                (passwordValidation.errors.length < 3 ? 25 : 0));

    const getPasswordStrengthColor = () => {
        if (passwordStrength < 25) return 'bg-red-500';
        if (passwordStrength < 50) return 'bg-yellow-500';
        if (passwordStrength < 75) return 'bg-blue-500';
        return 'bg-green-500';
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength < 25) return 'Debole';
        if (passwordStrength < 50) return 'Sufficiente';
        if (passwordStrength < 75) return 'Buona';
        return 'Forte';
    };

    // Handle server-side error messages
    const errorMessage = error instanceof Error ? error.message : "Errore durante la registrazione";

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Logo/Brand */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-emerald-600 mb-2">P.IVA Balance</h1>
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Crea il tuo account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Oppure{' '}
                        <Link
                            href="/signin"
                            className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
                        >
                            accedi al tuo account
                        </Link>
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Server Error */}
                        {errorMessage && (
                            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
                                <span className="block sm:inline">{escapeHtml(errorMessage)}</span>
                            </div>
                        )}

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
                                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:text-sm transition-colors ${validationErrors.name
                                            ? 'border-red-300 focus:border-red-500'
                                            : 'border-gray-300 focus:border-emerald-500'
                                        }`}
                                    placeholder="Mario Rossi"
                                />
                                {validationErrors.name && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                                )}
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
                                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:text-sm transition-colors ${validationErrors.email
                                            ? 'border-red-300 focus:border-red-500'
                                            : 'border-gray-300 focus:border-emerald-500'
                                        }`}
                                    placeholder="mario@esempio.com"
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
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setPasswordFocused(true)}
                                    onBlur={() => setPasswordFocused(false)}
                                    className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:text-sm transition-colors ${validationErrors.password
                                            ? 'border-red-300 focus:border-red-500'
                                            : 'border-gray-300 focus:border-emerald-500'
                                        }`}
                                    placeholder="Minimo 8 caratteri"
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

                                {/* Password strength indicator */}
                                {(passwordFocused || formData.password) && (
                                    <div className="mt-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs text-gray-600">Sicurezza password:</span>
                                            <span className={`text-xs font-medium ${passwordStrength < 50 ? 'text-red-600' :
                                                    passwordStrength < 75 ? 'text-yellow-600' : 'text-green-600'
                                                }`}>
                                                {getPasswordStrengthText()}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                                style={{ width: `${passwordStrength}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {validationErrors.password && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                                )}
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Conferma password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    value={confirmPassword}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:text-sm transition-colors ${validationErrors.confirmPassword
                                            ? 'border-red-300 focus:border-red-500'
                                            : 'border-gray-300 focus:border-emerald-500'
                                        }`}
                                    placeholder="Ripeti la password"
                                />
                                {validationErrors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? (
                                    <>
                                        <LoadingSpinner size="sm" className="mr-2" />
                                        Creazione account...
                                    </>
                                ) : (
                                    'Crea account'
                                )}
                            </button>
                        </div>

                        {/* Terms & Privacy */}
                        <div className="text-center">
                            <p className="text-xs text-gray-600">
                                Creando un account accetti i nostri{' '}
                                <Link href="/terms" className="text-emerald-600 hover:text-emerald-500">
                                    Termini di Servizio
                                </Link>{' '}
                                e{' '}
                                <Link href="/privacy" className="text-emerald-600 hover:text-emerald-500">
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