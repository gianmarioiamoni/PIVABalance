import React from 'react';

/**
 * Skip Links Component for WCAG 2.1 AA Compliance
 * 
 * Provides keyboard navigation shortcuts to main content areas.
 * Links are visually hidden but become visible when focused.
 * 
 * Features:
 * - WCAG 2.1 AA compliant skip navigation
 * - Visible on focus for keyboard users
 * - High contrast and proper positioning
 * - Screen reader accessible
 */
export const SkipLinks: React.FC = () => {
  return (
    <div className="skip-links">
      <a
        href="#main-content"
        className="skip-link"
        data-testid="skip-to-main"
      >
        Salta al contenuto principale
      </a>
      <a
        href="#navigation"
        className="skip-link"
        data-testid="skip-to-nav"
      >
        Salta alla navigazione
      </a>
      <a
        href="#footer"
        className="skip-link"
        data-testid="skip-to-footer"
      >
        Salta al footer
      </a>
    </div>
  );
};
