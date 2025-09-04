'use client';

import React from 'react';
import { ErrorBoundary, ErrorBoundaryProps } from './ErrorBoundary';
import { useNotifications } from '@/providers/NotificationProvider';
import Link from 'next/link';
import { HomeIcon, ArrowPathIcon } from '../ui/Icon';

interface PageErrorBoundaryProps extends Omit<ErrorBoundaryProps, 'level' | 'fallback'> {
    children: React.ReactNode;
    pageName?: string;
    showHomeLink?: boolean;
}

/**
 * Page-level Error Boundary
 * 
 * Specialized error boundary for full page errors with:
 * - Full-page fallback UI
 * - Navigation options (home, reload)
 * - Integration with notification system
 * - Page-specific error reporting
 */
export const PageErrorBoundary: React.FC<PageErrorBoundaryProps> = ({
    children,
    pageName = 'questa pagina',
    showHomeLink = true,
    onError,
    ...props
}) => {
    // We can't use hooks in class components, so we'll pass the notification
    // function through a wrapper component
    return (
        <NotificationWrapper>
            {(showError) => (
                <ErrorBoundary
                    level="page"
                    onError={(error, errorInfo) => {
                        // Show user-friendly notification
                        showError(
                            'Errore di pagina',
                            `Si è verificato un errore nel caricamento di ${pageName}. La pagina è stata ricaricata automaticamente.`,
                            0 // Don't auto-dismiss
                        );

                        // Call custom error handler if provided
                        onError?.(error, errorInfo);
                    }}
                    fallback={
                        <PageErrorFallback
                            pageName={pageName}
                            showHomeLink={showHomeLink}
                        />
                    }
                    {...props}
                >
                    {children}
                </ErrorBoundary>
            )}
        </NotificationWrapper>
    );
};

/**
 * Wrapper component to provide notification access to class component
 */
const NotificationWrapper: React.FC<{
    children: (showError: (title: string, message: string, duration?: number) => void) => React.ReactNode;
}> = ({ children }) => {
    const { showError } = useNotifications();
    return <>{children(showError)}</>;
};

/**
 * Full-page error fallback UI
 */
const PageErrorFallback: React.FC<{
    pageName: string;
    showHomeLink: boolean;
}> = ({ pageName, showHomeLink }) => (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="text-center">
                <div className="mx-auto h-20 w-20 text-red-500 mb-4">
                    <svg
                        className="h-full w-full"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Errore di caricamento
                </h1>

                <p className="text-gray-600 mb-8">
                    Si è verificato un errore nel caricamento di {pageName}.
                    Questo problema è stato segnalato al nostro team tecnico.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        <ArrowPathIcon className="h-5 w-5 mr-2" />
                        Ricarica pagina
                    </button>

                    {showHomeLink && (
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            <HomeIcon className="h-5 w-5 mr-2" />
                            Torna alla home
                        </Link>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Se il problema persiste, contatta il supporto tecnico.
                    </p>
                </div>
            </div>
        </div>
    </div>
); 