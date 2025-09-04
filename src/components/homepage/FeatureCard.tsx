import React from 'react';
import Link from 'next/link';
import { FeatureCardProps } from './types';

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
    href,
    textColor,
    linkColor,
    accentColor,
    backgroundGradient,
    rotationClass,
    animationDelay
}) => {
    // Estrae il colore hex dai Tailwind classes per CSS variables
    const titleHoverColor = textColor.replace('text-', '').replace('-', ' ');
    const linkHoverColor = linkColor.replace('text-', '').replace('-', ' ');

    return (
        <div
            className={`group bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-slide-up ${animationDelay} relative overflow-hidden`}
            style={{
                '--title-hover-color': titleHoverColor,
                '--link-hover-color': linkHoverColor
            } as React.CSSProperties}
        >
            {/* Gradient background */}
            <div className={`absolute inset-0 ${backgroundGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

            {/* Accent dot */}
            <div className={`absolute top-4 right-4 w-3 h-3 ${accentColor} rounded-full opacity-60`}></div>

            {/* Content */}
            <div className="relative z-10">
                {/* Icon */}
                <div className={`mb-6 transform ${rotationClass} group-hover:rotate-0 transition-transform duration-500 text-6xl opacity-80 group-hover:opacity-100`}>
                    {icon}
                </div>

                {/* Title */}
                <h3
                    className={`heading-lg mb-4 group-hover:text-[var(--title-hover-color)] transition-colors duration-300`}
                >
                    {title}
                </h3>
                <p className="body-lg leading-relaxed">
                    {description}
                </p>
                <Link href={href} className="mt-6 flex items-center body-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 text-gray-600 group-hover:text-[var(--link-hover-color)] cursor-pointer hover:underline">
                    Scopri di più
                    <svg className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}; 