import React from 'react';
import { FeatureCard } from './FeatureCard';
import type { FeaturesSectionProps } from './types';

/**
 * FeaturesSection Component (Server Component)
 * 
 * Single Responsibility: Display the features section with title and feature cards
 * Dependency Inversion: Depends on FeatureCard abstraction, not concrete implementation
 */
export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features }) => {
    return (
        <div className="mx-auto space-section container-wide">
            <div className="space-feature-title animate-fade-in delay-600">
                <h2 className="heading-lg mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Tutto quello che ti serve per gestire la tua P.IVA
                </h2>
                <p className="text-secondary content-medium mx-auto body-lg leading-relaxed">
                    Una piattaforma completa progettata per semplificare la gestione fiscale e amministrativa
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
                {features.map((feature, index) => (
                    <FeatureCard
                        key={`feature-${index}`}
                        {...feature}
                    />
                ))}
            </div>
        </div>
    );
}; 