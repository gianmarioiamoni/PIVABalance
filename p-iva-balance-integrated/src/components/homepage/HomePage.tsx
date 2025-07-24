import React from 'react';
import { AnimatedBackground } from './AnimatedBackground';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { CTASection } from './CTASection';
import { HOMEPAGE_CONFIG } from './config';

/**
 * HomePage Component (Server Component)
 * 
 * Single Responsibility: Orchestrate homepage layout and structure
 * Open/Closed Principle: Open for extension (new sections) closed for modification
 * Dependency Inversion: Depends on abstractions (child components) not concrete implementations
 * 
 * This is the main homepage that composes all sections together.
 * The majority of content is server-side rendered for better SEO and performance.
 * Only auth logic and animations require client-side rendering.
 */
export const HomePage: React.FC = () => {
    const { hero, features, cta, trustData } = HOMEPAGE_CONFIG;

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Client-side animated background */}
            <AnimatedBackground />

            {/* Server-side content */}
            <div className="relative container-app">
                <div className="pt-20 pb-16 text-center lg:pt-32">
                    {/* Hero Section with Trust Badge */}
                    <HeroSection
                        {...hero}
                        trustData={trustData}
                    />

                    {/* Features Section */}
                    <FeaturesSection features={features} />

                    {/* Bottom CTA Section */}
                    <CTASection {...cta} />
                </div>
            </div>
        </div>
    );
}; 