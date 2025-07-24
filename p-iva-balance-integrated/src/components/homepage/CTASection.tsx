import React from 'react';
import Link from 'next/link';
import type { CTASectionProps } from './types';

/**
 * CTASection Component (Server Component)
 * 
 * Single Responsibility: Display final call-to-action section
 */
export const CTASection: React.FC<CTASectionProps> = ({
    title,
    description,
    ctaText,
    ctaHref
}) => {
    return (
        <div className="mt-20 animate-fade-in delay-1000">
            <div className="relative p-8 lg:p-12 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                </div>
                <div className="relative text-center">
                    <h3 className="heading-lg text-white mb-4">
                        {title}
                    </h3>
                    <p className="text-blue-100 body-lg mb-8 content-medium mx-auto leading-relaxed">
                        {description}
                    </p>
                    <Link
                        href={ctaHref}
                        className="btn-base btn-primary px-8 py-4 body-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                        {ctaText}
                        <svg className="ml-2 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}; 