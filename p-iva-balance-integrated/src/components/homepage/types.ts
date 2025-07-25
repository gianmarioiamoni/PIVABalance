/**
 * Homepage Component Types & Interfaces
 * Following Interface Segregation Principle - small, specific interfaces
 */

export interface TrustData {
  enabled: boolean;
  userCount: number;
  rating: number;
  maxRating: number;
  reviewCount: number;
}

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string; // Link to feature detail page
  textColor: string; // Color for title on hover
  linkColor: string; // Color for "Scopri di più" text
  accentColor: string;
  backgroundGradient: string;
  rotationClass: string;
  animationDelay: string;
}

export interface FeaturesSectionProps {
  features: FeatureCardProps[];
}

export interface TrustBadgeProps {
  trustData: TrustData;
}

export interface HeroSectionProps {
  title: string;
  subtitle: string;
  primaryCTA: {
    text: string;
    href: string;
  };
  secondaryCTA: {
    text: string;
    href: string;
  };
}

export interface CTASectionProps {
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
}

// Configuration types
export interface HomepageConfig {
  trustData: TrustData;
  hero: HeroSectionProps;
  cta: CTASectionProps;
  features: FeatureCardProps[];
}
