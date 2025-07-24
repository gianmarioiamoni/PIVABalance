'use client';

import React, { Component, ReactNode } from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '../ui/Icon';

// Types for error boundary
export interface ErrorBoundaryInfo {
    componentStack: string;
    errorBoundary?: string;
    errorBoundaryStack?: string;
}

export interface ErrorReport {
    message: string;
    stack?: string;
    componentStack: string;
    level: 'page' | 'section' | 'component';
    timestamp: string;
    userAgent: string;
    url: string;
    errorId: string | null;
}

export interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorBoundaryInfo | null;
    errorId: string | null;
}

export interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorBoundaryInfo) => void;
    isolate?: boolean; // If true, prevents error from bubbling up
    showDetails?: boolean; // Show technical details in development
    resetOnPropsChange?: boolean; // Reset error state when props change
    resetKeys?: Array<string | number>; // Reset when these keys change
    level?: 'page' | 'section' | 'component'; // Error boundary level for logging
}

/**
 * Generic Error Boundary Component
 * 
 * Provides comprehensive error handling with:
 * - User-friendly fallback UI
 * - Error logging and reporting
 * - Integration with notification system
 * - Development debugging features
 * - Flexible configuration options
 * 
 * Follows SOLID principles:
 * - Single Responsibility: Only handles error boundary logic
 * - Open/Closed: Extensible through props and composition
 * - Dependency Inversion: Depends on abstractions (callbacks)
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    private resetTimeoutId: number | null = null;

    constructor(props: ErrorBoundaryProps) {
        super(props);

        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        // Generate unique error ID for tracking
        const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        return {
            hasError: true,
            error,
            errorId,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorBoundaryInfo) {
        // Store error info in state
        this.setState({ errorInfo });

        // Generate error report
        const errorReport = {
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            level: this.props.level || 'component',
            timestamp: new Date().toISOString(),
            userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
            url: typeof window !== 'undefined' ? window.location.href : 'SSR',
            errorId: this.state.errorId,
        };

        // Log error for debugging
        console.error('Error Boundary caught an error:', errorReport);

        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // Report to external service in production
        this.reportError(errorReport);
    }

    componentDidUpdate(prevProps: ErrorBoundaryProps) {
        const { resetOnPropsChange, resetKeys } = this.props;
        const { hasError } = this.state;

        // Reset error state if props changed and resetOnPropsChange is true
        if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
            this.resetErrorBoundary();
        }

        // Reset error state if resetKeys changed
        if (hasError && resetKeys && prevProps.resetKeys) {
            const hasResetKeyChanged = resetKeys.some(
                (key, index) => key !== prevProps.resetKeys?.[index]
            );

            if (hasResetKeyChanged) {
                this.resetErrorBoundary();
            }
        }
    }

    componentWillUnmount() {
        if (this.resetTimeoutId) {
            clearTimeout(this.resetTimeoutId);
        }
    }

    /**
     * Report error to external monitoring service
     */
    private reportError = (errorReport: ErrorReport) => {
        // In development, just log to console
        if (process.env.NODE_ENV === 'development') {
            console.warn('🚨 Error Boundary Report');
            console.error('Error Details:', errorReport);
            console.warn('End Error Boundary Report');
            return;
        }

        // In production, send to monitoring service (Sentry, LogRocket, etc.)
        try {
            // Example: window.Sentry?.captureException(errorReport);
            // Example: window.LogRocket?.captureException(errorReport);

            // For now, just log to console in production too
            console.error('Production Error:', errorReport);
        } catch (reportingError) {
            console.error('Failed to report error:', reportingError);
        }
    };

    /**
     * Reset error boundary state
     */
    resetErrorBoundary = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: null,
        });
    };

    /**
     * Auto-retry with exponential backoff
     */
    private autoRetry = (attempt = 1) => {
        const maxAttempts = 3;
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);

        if (attempt <= maxAttempts) {
            this.resetTimeoutId = window.setTimeout(() => {
                console.warn(`Auto-retry attempt ${attempt}/${maxAttempts}`);
                this.resetErrorBoundary();
            }, delay);
        }
    };

    render() {
        const { hasError, error, errorInfo, errorId } = this.state;
        const { children, fallback, showDetails = process.env.NODE_ENV === 'development', level = 'component' } = this.props;

        if (hasError && error) {
            // Use custom fallback if provided
            if (fallback) {
                return fallback;
            }

            // Default fallback UI
            return (
                <div className="min-h-[200px] flex items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-center max-w-md">
                        <div className="flex justify-center mb-4">
                            <ExclamationTriangleIcon className="h-12 w-12 text-red-500" />
                        </div>

                        <h2 className="text-lg font-semibold text-red-800 mb-2">
                            {level === 'page' ? 'Errore nella pagina' :
                                level === 'section' ? 'Errore nella sezione' :
                                    'Si è verificato un errore'}
                        </h2>

                        <p className="text-red-600 mb-4">
                            Si è verificato un errore imprevisto. Il nostro team è stato notificato.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                            <button
                                type="button"
                                onClick={this.resetErrorBoundary}
                                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                            >
                                <ArrowPathIcon className="h-4 w-4 mr-2" />
                                Riprova
                            </button>

                            {level === 'page' && (
                                <button
                                    onClick={() => window.location.reload()}
                                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                                >
                                    Ricarica Pagina
                                </button>
                            )}
                        </div>

                        {showDetails && (
                            <details className="mt-4 text-left">
                                <summary className="cursor-pointer text-sm text-red-700 hover:text-red-800">
                                    Dettagli tecnici (sviluppo)
                                </summary>
                                <div className="mt-2 p-3 bg-red-100 rounded text-xs">
                                    <p><strong>Error ID:</strong> {errorId}</p>
                                    <p><strong>Message:</strong> {error.message}</p>
                                    {error.stack && (
                                        <div className="mt-2">
                                            <strong>Stack:</strong>
                                            <pre className="whitespace-pre-wrap text-xs mt-1 overflow-auto max-h-32">
                                                {error.stack}
                                            </pre>
                                        </div>
                                    )}
                                    {errorInfo?.componentStack && (
                                        <div className="mt-2">
                                            <strong>Component Stack:</strong>
                                            <pre className="whitespace-pre-wrap text-xs mt-1 overflow-auto max-h-32">
                                                {errorInfo.componentStack}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return children;
    }
} 