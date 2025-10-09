'use client';

import Script from 'next/script';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

/**
 * Google Analytics Component
 * Implements GA4 tracking with privacy compliance
 */
export const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ 
  measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID 
}) => {
  // Don't load in development or if no measurement ID
  if (process.env.NODE_ENV !== 'production' || !measurementId) {
    return null;
  }

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      
      {/* GA Configuration */}
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          gtag('config', '${measurementId}', {
            // Privacy-friendly settings
            anonymize_ip: true,
            allow_google_signals: false,
            allow_ad_personalization_signals: false,
            
            // Performance settings
            send_page_view: true,
            
            // Custom dimensions for P.IVA Balance
            custom_map: {
              'dimension1': 'user_type',
              'dimension2': 'tax_regime'
            }
          });
          
          // Enhanced ecommerce for conversion tracking
          gtag('config', '${measurementId}', {
            // Track key business events
            enhanced_conversions: true,
            conversion_linker: true
          });
        `}
      </Script>
    </>
  );
};

/**
 * Analytics Event Tracking Utilities
 */
export const trackEvent = (eventName: string, parameters?: Record<string, string | number | boolean>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'engagement',
      event_label: parameters?.label as string,
      value: parameters?.value as number,
      ...parameters
    });
  }
};

// Predefined events for P.IVA Balance
export const analytics = {
  // User registration events
  signUp: (method: string) => trackEvent('sign_up', { method }),
  signIn: (method: string) => trackEvent('login', { method }),
  
  // Feature usage events
  calculateTax: (regime: string) => trackEvent('calculate_tax', { 
    event_category: 'feature_usage',
    tax_regime: regime 
  }),
  
  createInvoice: () => trackEvent('create_invoice', { 
    event_category: 'feature_usage' 
  }),
  
  addCost: (category: string) => trackEvent('add_cost', { 
    event_category: 'feature_usage',
    cost_category: category 
  }),
  
  // Conversion events
  upgradeAccount: (plan: string) => trackEvent('purchase', { 
    event_category: 'conversion',
    item_name: plan,
    currency: 'EUR'
  }),
  
  // Engagement events
  viewDashboard: () => trackEvent('page_view', { 
    page_title: 'Dashboard',
    page_location: '/dashboard'
  }),
  
  downloadReport: (reportType: string) => trackEvent('file_download', {
    event_category: 'engagement',
    file_name: reportType
  }),
  
  // Error tracking
  trackError: (error: string, location: string) => trackEvent('exception', {
    description: error,
    fatal: false,
    location
  })
};

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, string | number | boolean>) => void;
  }
}
