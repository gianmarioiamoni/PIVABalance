/**
 * Homepage Components Barrel Export
 *
 * Centralizes all homepage component exports following the Single Responsibility Principle
 */

// Main components
export { HomePage } from "./HomePage";
export { AuthRedirectWrapper } from "./AuthRedirectWrapper";

// Section components
export { HeroSection } from "./HeroSection";
export { FeaturesSection } from "./FeaturesSection";
export { FeatureCard } from "./FeatureCard";
export { TrustBadge } from "./TrustBadge";
export { CTASection } from "./CTASection";
export { AnimatedBackground } from "./AnimatedBackground";

// Configuration and types
export { HOMEPAGE_CONFIG } from "./config";
export type * from "./types";
