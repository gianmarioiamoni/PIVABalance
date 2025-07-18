'use client';

import React from 'react';
import { ErrorBoundary, ErrorBoundaryProps } from './ErrorBoundary';
import { ExclamationTriangleIcon, ArrowPathIcon } from '../ui/Icon';

interface SectionErrorBoundaryProps extends Omit<ErrorBoundaryProps, 'level' | 'fallback'> {
    children: React.ReactNode;
    sectionName?: string;
    description?: string;
    showRetry?: boolean;
    compact?: boolean;
}

/**
 * Section-level Error Boundary
 * 
 * Specialized error boundary for app sections with:
 * - Section-specific fallback UI
 * - Compact or full display modes
 * - Retry functionality
 * - Non-intrusive error handling
 */
export const SectionErrorBoundary: React.FC<SectionErrorBoundaryProps> = ({
    children,
    sectionName = 'questa sezione',
    description,
    showRetry = true,
    compact = false,
    onError,
    ...props
}) => {
    return (
        <ErrorBoundary
            level="section"
            onError={(error, errorInfo) => {
                console.warn(`Section Error in ${sectionName}:`, error);
                onError?.(error, errorInfo);
            }}
            fallback={
                <SectionErrorFallback
                    sectionName={sectionName}
                    description={description}
                    showRetry={showRetry}
                    compact={compact}
                />
            }
            {...props}
        >
            {children}
        </ErrorBoundary>
    );
};

/**
 * Section error fallback UI
 */
const SectionErrorFallback: React.FC<{
    sectionName: string;
    description?: string;
    showRetry: boolean;
    compact: boolean;
}> = ({ sectionName, description, showRetry, compact }) => {
    const handleRetry = () => {
        window.location.reload();
    };

    if (compact) {
        return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                    <div className="flex-1">
                        <p className="text-sm text-yellow-800">
                            Errore nel caricamento di {sectionName}
                        </p>
                    </div>
                    {showRetry && (
                        <button
                            onClick={handleRetry}
                            className="ml-3 text-sm text-yellow-800 hover:text-yellow-900 underline"
                        >
                            Riprova
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-center">
                <ExclamationTriangleIcon className="mx-auto h-8 w-8 text-gray-400 mb-3" />

                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Errore nel caricamento
                </h3>

                <p className="text-gray-600 mb-4">
                    {description || `Non è stato possibile caricare ${sectionName}.`}
                </p>

                {showRetry && (
                    <button
                        onClick={handleRetry}
                        className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                    >
                        <ArrowPathIcon className="h-4 w-4 mr-2" />
                        Ricarica sezione
                    </button>
                )}
            </div>
        </div>
    );
}; 