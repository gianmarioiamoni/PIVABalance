'use client';

import React from 'react';
import { LoadingSpinner, ErrorDisplay } from '@/components/ui';

export interface ChartContainerProps {
  title?: string;
  subtitle?: string;
  loading?: boolean;
  error?: string | null;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

/**
 * Chart Container Component
 * 
 * Provides consistent layout and state management for all charts
 * Following Single Responsibility Principle - handles only container logic
 * 
 * Features:
 * - Loading states
 * - Error handling
 * - Consistent styling
 * - Optional header with actions
 * - Responsive design
 */
export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  loading = false,
  error = null,
  children,
  className = '',
  actions
}) => {
  const containerClasses = `
    bg-white rounded-lg shadow-sm border border-gray-200 p-6
    ${className}
  `.trim();

  if (loading) {
    return (
      <div className={containerClasses}>
        {title && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
        )}
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-2 text-gray-500">Caricamento grafico...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={containerClasses}>
        {title && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
        )}
        <div className="h-64">
          <ErrorDisplay 
            message={error} 
            title="Errore nel caricamento del grafico"
            className="h-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {(title || actions) && (
        <div className="flex items-center justify-between mb-6">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      )}
      
      <div className="relative">
        {children}
      </div>
    </div>
  );
};
