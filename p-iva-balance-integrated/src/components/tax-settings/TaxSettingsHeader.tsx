import React from 'react';

/**
 * Header component for Tax Settings
 * Follows Single Responsibility Principle - only handles header rendering
 */
interface TaxSettingsHeaderProps {
  className?: string;
}

/**
 * Tax Settings Header Component
 * 
 * Displays the main title and description for the tax settings page.
 * Focused solely on header presentation following SRP.
 * 
 * @param className - Optional CSS classes for styling
 */
export const TaxSettingsHeader: React.FC<TaxSettingsHeaderProps> = ({
    className = ''
}) => {
    return (
        <div className={`px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 ${className}`}>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Impostazioni Fiscali
            </h2>
            <p className="text-gray-600 text-sm">
                Configura i parametri per il calcolo delle imposte e dei contributi previdenziali
            </p>
        </div>
    );
}; 