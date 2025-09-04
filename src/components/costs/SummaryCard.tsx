import React from 'react';
import { formatCurrency } from '@/utils/formatters';

interface SummaryCardProps {
    title: string;
    amount: number;
    count: number;
    icon: React.ComponentType<{ className?: string }>;
    bgColor: string;
    textColor: string;
}

/**
 * SummaryCard Component
 * 
 * Displays a summary card with financial information
 * Follows SRP by handling only the display of summary data
 */
export const SummaryCard: React.FC<SummaryCardProps> = ({
    title,
    amount,
    count,
    icon: Icon,
    bgColor,
    textColor
}) => {
    return (
        <div className={`${bgColor} rounded-lg shadow-sm border border-gray-200 p-6`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className={`text-sm font-medium ${textColor}`}>
                        {title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(amount)}
                    </p>
                    <p className="text-sm text-gray-500">
                        {count} {count === 1 ? 'voce' : 'voci'}
                    </p>
                </div>
                <Icon className={`h-8 w-8 ${textColor}`} />
            </div>
        </div>
    );
}; 