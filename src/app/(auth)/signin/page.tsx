'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/auth/useAuth';
import { sanitizeInput, isValidEmail } from '@/utils/security';
import { EyeIcon, EyeSlashIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const SignInPage = () => {
    const router = useRouter();
    const { signIn } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const validateForm = () => {
        let isValid = true;
        if (!formData.email) {
            setError('Email è obbligatorio.');
            isValid = false;
        } else if (!isValidEmail(formData.email)) {
            setError('Email non valida.');
            isValid = false;
        }
        if (!formData.password) {
            setError('Password è obbligatorio.');
            isValid = false;
        }
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const sanitizedEmail = sanitizeInput(formData.email);
            const sanitizedPassword = sanitizeInput(formData.password);

            await signIn({
                email: sanitizedEmail,
                password: sanitizedPassword
            });

            router.push('/dashboard');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Errore durante il login. Riprova.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-center text-3xl font-bold mb-6">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                                placeholder="Enter your password"
                            />
                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                                {showPassword ? (
                                    <EyeSlashIcon className="h-5 w-5 text-gray-500" onClick={() => setShowPassword(false)} />
                                ) : (
                                    <EyeIcon className="h-5 w-5 text-gray-500" onClick={() => setShowPassword(true)} />
                                )}
                            </span>
                        </div>
                    </div>
                    {error && (
                        <div className="flex items-center text-red-500 text-sm mb-4">
                            <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-6">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-blue-600 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignInPage; 