'use client';

import { useState, useEffect } from 'react';

/**
 * Cookie Categories according to GDPR
 */
export type CookieCategory = 'necessary' | 'functional' | 'analytics' | 'marketing';

/**
 * Cookie Consent State
 */
export interface CookieConsent {
  necessary: boolean;      // Always true, cannot be disabled
  functional: boolean;     // User preferences, UI state
  analytics: boolean;      // Google Analytics, usage tracking
  marketing: boolean;      // Advertising, social media
}

/**
 * Cookie Consent Status
 */
export interface CookieConsentState {
  hasConsent: boolean;
  showBanner: boolean;
  preferences: CookieConsent;
  consentDate?: Date;
}

const CONSENT_STORAGE_KEY = 'piva-balance-cookie-consent';
const CONSENT_VERSION = '1.0'; // Increment when cookie policy changes

/**
 * Default cookie preferences (only necessary cookies enabled)
 */
const DEFAULT_PREFERENCES: CookieConsent = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

/**
 * Hook for managing cookie consent according to GDPR
 * 
 * Features:
 * - Persistent consent storage
 * - Category-based cookie management
 * - Banner visibility control
 * - Consent expiration (1 year)
 * - Version tracking for policy updates
 */
export const useCookieConsent = () => {
  const [state, setState] = useState<CookieConsentState>({
    hasConsent: false,
    showBanner: true,
    preferences: DEFAULT_PREFERENCES,
  });

  // Load consent from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Check if consent is still valid (1 year) and version matches
        const consentDate = new Date(parsed.consentDate);
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        
        const isValid = consentDate > oneYearAgo && parsed.version === CONSENT_VERSION;
        
        if (isValid) {
          setState({
            hasConsent: true,
            showBanner: false,
            preferences: {
              necessary: true, // Always true
              functional: parsed.preferences?.functional || false,
              analytics: parsed.preferences?.analytics || false,
              marketing: parsed.preferences?.marketing || false,
            },
            consentDate: consentDate,
          });
        } else {
          // Clear expired or outdated consent
          localStorage.removeItem(CONSENT_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading cookie consent:', error);
      // Clear corrupted data
      localStorage.removeItem(CONSENT_STORAGE_KEY);
    }
  }, []);

  /**
   * Accept all cookies
   */
  const acceptAll = () => {
    console.log('🍪 useCookieConsent: acceptAll called');
    const newPreferences: CookieConsent = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    
    saveConsent(newPreferences);
  };

  /**
   * Accept only necessary cookies
   */
  const acceptNecessaryOnly = () => {
    console.log('🍪 useCookieConsent: acceptNecessaryOnly called');
    saveConsent(DEFAULT_PREFERENCES);
  };

  /**
   * Save custom preferences
   */
  const savePreferences = (preferences: Partial<CookieConsent>) => {
    console.log('🍪 useCookieConsent: savePreferences called with', preferences);
    const newPreferences: CookieConsent = {
      necessary: true, // Always true
      functional: preferences.functional ?? false,
      analytics: preferences.analytics ?? false,
      marketing: preferences.marketing ?? false,
    };
    
    console.log('🍪 useCookieConsent: processed preferences', newPreferences);
    saveConsent(newPreferences);
  };

  /**
   * Show banner again (for settings)
   */
  const reopenBanner = () => {
    setState(prev => ({
      ...prev,
      showBanner: true,
    }));
  };

  /**
   * Hide banner without saving consent
   */
  const hideBanner = () => {
    setState(prev => ({
      ...prev,
      showBanner: false,
    }));
  };

  /**
   * Clear all consent (for testing or user request)
   */
  const clearConsent = () => {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    setState({
      hasConsent: false,
      showBanner: true,
      preferences: DEFAULT_PREFERENCES,
    });
  };

  /**
   * Save consent to localStorage and update state
   */
  const saveConsent = (preferences: CookieConsent) => {
    console.log('🍪 useCookieConsent: saveConsent called with', preferences);
    const consentDate = new Date();
    const consentData = {
      version: CONSENT_VERSION,
      preferences,
      consentDate: consentDate.toISOString(),
    };

    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
      console.log('🍪 useCookieConsent: consent saved to localStorage', consentData);
      setState({
        hasConsent: true,
        showBanner: false,
        preferences,
        consentDate,
      });
      console.log('🍪 useCookieConsent: state updated, banner should be hidden');
    } catch (error) {
      console.error('Error saving cookie consent:', error);
    }
  };

  /**
   * Check if a specific cookie category is allowed
   */
  const isAllowed = (category: CookieCategory): boolean => {
    return state.preferences[category];
  };

  /**
   * Get consent status for analytics (Google Analytics, etc.)
   */
  const canUseAnalytics = (): boolean => {
    return state.hasConsent && state.preferences.analytics;
  };

  /**
   * Get consent status for marketing cookies
   */
  const canUseMarketing = (): boolean => {
    return state.hasConsent && state.preferences.marketing;
  };

  /**
   * Get consent status for functional cookies
   */
  const canUseFunctional = (): boolean => {
    return state.hasConsent && state.preferences.functional;
  };

  return {
    // State
    hasConsent: state.hasConsent,
    showBanner: state.showBanner,
    preferences: state.preferences,
    consentDate: state.consentDate,
    
    // Actions
    acceptAll,
    acceptNecessaryOnly,
    savePreferences,
    reopenBanner,
    hideBanner,
    clearConsent,
    
    // Utilities
    isAllowed,
    canUseAnalytics,
    canUseMarketing,
    canUseFunctional,
  };
};
