'use client';

import React from 'react';

interface QuickAction {
    label: string;
    onClick: () => void;
    bgColor: string;
    hoverColor: string;
}

interface QuickActionsProps {
    actions: QuickAction[];
}

/**
 * QuickActions Component (Client Component)
 * 
 * Displays a list of quick action buttons with click handlers.
 * Requires client-side execution due to onClick event handlers.
 * Follows SRP by handling only quick actions display and interaction.
 */
export const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                    Azioni Rapide
                </h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        onClick={action.onClick}
                        className={`${action.bgColor} ${action.hoverColor} text-white px-4 py-3 rounded-md font-medium transition-colors text-center`}
                    >
                        {action.label}
                    </button>
                ))}
            </div>
        </div>
    );
}; 