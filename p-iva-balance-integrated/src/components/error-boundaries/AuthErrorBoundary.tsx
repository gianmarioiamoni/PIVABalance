'use client';

import React from 'react';
import { ErrorBoundary, ErrorBoundaryProps } from './ErrorBoundary';
import Link from 'next/link';
import { ShieldExclamationIcon, ArrowPathIcon, HomeIcon } from '../ui/Icon';

interface AuthErrorBoundaryProps extends Omit<ErrorBoundaryProps, 'level' | 'fallback'> {
    children: React.ReactNode;
    authType?: 'signin' | 'signup' | 'forgot-password' | 'reset-password';
}

/**
 * Authentication Error Boundary
 * 
 * Specialized error boundary for auth pages with:
 * - Auth-specific error handling
 * - Secure fallback UI
 * - Alternative auth options
 * - Clear user guidance
 */
export const AuthErrorBoundary: React.FC<AuthErrorBoundaryProps> = ({
    children,
    authType = 'signin',
    onError,
    ...props
}) => {
    return (
        <ErrorBoundary
            level="page"
            onError={(error, errorInfo) => {
                // Log auth-specific errors with additional context
                console.error(`Auth Error [${authType}]:`, {
                    error: error.message,
                    stack: error.stack,
                    componentStack: errorInfo.componentStack,
                    authType,
                    timestamp: new Date().toISOString(),
                    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
                });

                onError?.(error, errorInfo);
            }}
            fallback={<AuthErrorFallback authType={authType} />}
            {...props}
        >
            {children}
        </ErrorBoundary>
    );
};

/**
 * Authentication error fallback UI
 */
const AuthErrorFallback: React.FC<{
    authType: 'signin' | 'signup' | 'forgot-password' | 'reset-password';
}> = ({ authType }) => {
    const getAuthMessages = () => {
        switch (authType) {
            case 'signin':
                return {
                    title: 'Errore di accesso',
                    description: 'Si è verificato un problema durante l\'accesso al tuo account.',
                    alternativeText: 'Non hai un account?',
                    alternativeLink: '/signup',
                    alternativeLinkText: 'Registrati',
                };
            case 'signup':
                return {
                    title: 'Errore di registrazione',
                    description: 'Si è verificato un problema durante la creazione del tuo account.',
                    alternativeText: 'Hai già un account?',
                    alternativeLink: '/signin',
                    alternativeLinkText: 'Accedi',
                };
            case 'forgot-password':
                return {
                    title: 'Errore recupero password',
                    description: 'Si è verificato un problema durante il recupero della password.',
                    alternativeText: 'Ricordi la password?',
                    alternativeLink: '/signin',
                    alternativeLinkText: 'Accedi',
                };
            case 'reset-password':
                return {
                    title: 'Errore reset password',
                    description: 'Si è verificato un problema durante il reset della password.',
                    alternativeText: 'Richiedi un nuovo link',
                    alternativeLink: '/forgot-password',
                    alternativeLinkText: 'Recupera password',
                };
            default:
                return {
                    title: 'Errore di autenticazione',
                    description: 'Si è verificato un problema con l\'autenticazione.',
                    alternativeText: 'Torna al login',
                    alternativeLink: '/signin',
                    alternativeLinkText: 'Accedi',
                };
        }
    };

    const messages = getAuthMessages();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 text-red-500 mb-6">
                        <ShieldExclamationIcon className="h-full w-full" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {messages.title}
                    </h1>

                    <p className="text-gray-600 mb-8">
                        {messages.description}
                        <br />
                        Il nostro team è stato notificato e stiamo lavorando per risolvere il problema.
                    </p>
                </div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
                    <div className="space-y-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            <ArrowPathIcon className="h-4 w-4 mr-2" />
                            Riprova
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">oppure</span>
                            </div>
                        </div>

                        <Link
                            href={messages.alternativeLink}
                            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            {messages.alternativeLinkText}
                        </Link>

                        <div className="text-center">
                            <Link
                                href="/"
                                className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                            >
                                <HomeIcon className="h-4 w-4 mr-1" />
                                Torna alla home
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        {messages.alternativeText}{' '}
                        <Link
                            href={messages.alternativeLink}
                            className="text-indigo-600 hover:text-indigo-500"
                        >
                            {messages.alternativeLinkText}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}; 