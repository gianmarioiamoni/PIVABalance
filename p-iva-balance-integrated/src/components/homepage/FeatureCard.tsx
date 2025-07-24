import React from 'react';
import type { FeatureCardProps } from './types';

/**
 * FeatureCard Component (Server Component)
 * 
 * Single Responsibility: Display a single feature with icon, title, description
 * Open/Closed Principle: Open for extension (different styles) closed for modification
 * Liskov Substitution: All FeatureCard instances are interchangeable
 */
export const FeatureCard: React.FC<FeatureCardProps> = ({
    icon,
    title,
    description,
    textColor,
    linkColor,
    accentColor,
    backgroundGradient,
    rotationClass,
    animationDelay
}) => {
    // Determine hover rotation based on initial rotation
    const getHoverRotation = (rotation: string) => {
        if (rotation.includes('-rotate-3')) return 'group-hover:-rotate-6';
        if (rotation.includes('rotate-3')) return 'group-hover:rotate-6';
        if (rotation.includes('rotate-2')) return 'group-hover:rotate-4';
        return 'group-hover:rotate-6'; // default
    };

    const hoverRotation = getHoverRotation(rotationClass);

    // Extract color values for CSS custom properties
    const getColorValue = (colorClass: string) => {
        if (colorClass.includes('blue-600')) return '#2563eb';
        if (colorClass.includes('purple-600')) return '#9333ea';
        if (colorClass.includes('green-600')) return '#16a34a';
        return '#2563eb'; // default blue
    };

    const titleHoverColor = getColorValue(textColor);
    const linkHoverColor = getColorValue(linkColor);

    return (
        <div
            className={`group relative animate-slide-up ${animationDelay}`}
            style={{
                '--title-hover-color': titleHoverColor,
                '--link-color': linkHoverColor
            } as React.CSSProperties}
        >
            <div className={`absolute inset-0 ${backgroundGradient} rounded-2xl transform ${rotationClass} ${hoverRotation} transition-transform duration-300`}></div>
            <div className="relative card card-body hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 backdrop-blur-sm">
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        {icon}
                        <div className={`absolute -top-1 -right-1 w-4 h-4 ${accentColor} rounded-full animate-pulse`}></div>
                    </div>
                </div>
                <h3 className="heading-sm mb-4 transition-colors duration-300 group-hover:text-[var(--title-hover-color)]">
                    {title}
                </h3>
                <p className="body-lg leading-relaxed">
                    {description}
                </p>
                <div className="mt-6 flex items-center body-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[var(--link-color)]">
                    Scopri di più
                    <svg className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </div>
    );
}; 