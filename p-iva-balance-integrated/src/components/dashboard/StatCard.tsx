import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
}

/**
 * StatCard Component (Updated with Design System)
 * 
 * Reusable component for displaying dashboard statistics
 * Follows SRP by handling only the display of a single statistic
 * Now uses centralized design system classes
 */
export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    variant = 'primary'
}) => {
    // Map variants to design system classes
    const variantClasses = {
        primary: 'bg-brand-primary',
        secondary: 'bg-brand-secondary',
        success: 'bg-success',
        warning: 'bg-warning',
        info: 'bg-info'
    };

    return (
        <div className="card animate-fade-in">
            <div className="card-body">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className={`w-8 h-8 ${variantClasses[variant]} rounded-md flex items-center justify-center text-white`}>
                            {icon}
                        </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-tertiary text-sm font-medium truncate">
                                {title}
                            </dt>
                            <dd className="text-primary text-lg font-medium">
                                {value}
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}; 