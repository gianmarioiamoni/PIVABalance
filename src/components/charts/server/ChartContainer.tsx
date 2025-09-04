import React from 'react';

export interface ServerChartContainerProps {
    title?: string;
    subtitle?: string;
    className?: string;
    actions?: React.ReactNode;
    children: React.ReactNode;
}

/**
 * Server-Side Chart Container Component
 * 
 * Pure server component for static layout and metadata
 * No client-side dependencies - optimized for SSR
 * 
 * Features:
 * - SEO-friendly metadata
 * - Static layout structure
 * - Consistent styling
 * - No JavaScript bundle impact
 * - Faster initial paint
 */
export const ServerChartContainer: React.FC<ServerChartContainerProps> = ({
    title,
    subtitle,
    className = '',
    actions,
    children
}) => {
    const containerClasses = `
    bg-white rounded-lg shadow-sm border border-gray-200 p-6
    ${className}
  `.trim();

    return (
        <div className={containerClasses}>
            {/* Header Section - SSR Optimized */}
            {(title || subtitle || actions) && (
                <div className="mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            {title && (
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {title}
                                </h3>
                            )}
                            {subtitle && (
                                <p className="text-sm text-gray-600 mt-1">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                        {actions && (
                            <div className="ml-4 flex-shrink-0">
                                {actions}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Content Section */}
            <div className="relative">
                {children}
            </div>
        </div>
    );
};

export default ServerChartContainer;
