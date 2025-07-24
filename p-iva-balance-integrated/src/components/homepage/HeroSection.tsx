import React from 'react';
import Link from 'next/link';
import { TrustBadge } from './TrustBadge';
import type { HeroSectionProps, TrustData } from './types';

/**
 * HeroSection Component (Server Component)
 * 
 * Single Responsibility: Display hero content (title, subtitle, CTAs, trust badge)
 * Dependency Inversion: Depends on TrustBadge abstraction
 */
interface HeroSectionWithTrustProps extends HeroSectionProps {
  trustData: TrustData;
}

export const HeroSection: React.FC<HeroSectionWithTrustProps> = ({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  trustData
}) => {
  return (
    <div className="content-medium">
      <h1 className="heading-xxl space-hero-title animate-slide-up bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
        {title}
      </h1>

      <div
        className="body-xl leading-relaxed content-wide mx-auto space-hero-subtitle animate-slide-up delay-200"
        dangerouslySetInnerHTML={{ __html: subtitle }}
      />

      {/* Enhanced CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 space-hero-buttons animate-slide-up delay-300">
        <Link
          href={primaryCTA.href}
          className="btn-base btn-primary px-8 py-4 text-base rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <span className="relative">{primaryCTA.text}</span>
          <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>

        <Link
          href={secondaryCTA.href}
          className="btn-base btn-secondary px-8 py-4 text-base rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
        >
          {secondaryCTA.text}
          <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Trust Badge */}
      <TrustBadge trustData={trustData} />
    </div>
  );
}; 