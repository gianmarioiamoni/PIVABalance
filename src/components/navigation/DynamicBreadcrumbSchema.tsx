'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Dynamic Breadcrumb Schema for Client Components
 * Generates JSON-LD breadcrumb schema based on current pathname
 */
export const DynamicBreadcrumbSchema: React.FC = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Don't generate schema for home page or single-level paths
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    if (pathname === '/' || pathSegments.length <= 1) {
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pivabalance.com';
    
    // Generate breadcrumbs
    const breadcrumbs: Array<{ label: string; href: string }> = [{ label: 'Home', href: '/' }];

    let currentPath = '';
    pathSegments.forEach((segment, _index) => {
      currentPath += `/${segment}`;
      
      // Convert segment to readable label
      const routeLabels: Record<string, string> = {
        'dashboard': 'Dashboard',
        'settings': 'Impostazioni',
        'invoices': 'Fatture',
        'costs': 'Costi',
        'taxes': 'Tasse',
        'analytics': 'Analytics',
        'account': 'Account',
        'customizable': 'Personalizzabile',
        'features': 'Funzionalità',
        'calcoli-fiscali': 'Calcoli Fiscali',
        'gestione-fatture': 'Gestione Fatture',
        'dashboard-completa': 'Dashboard Completa',
        'privacy-policy': 'Privacy Policy',
        'cookie-policy': 'Cookie Policy',
      };
      
      const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({ label, href: currentPath });
    });

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.label,
        "item": `${baseUrl}${item.href}`
      }))
    };

    // Remove existing breadcrumb schema if any
    const existingSchema = document.querySelector('script[data-breadcrumb-schema]');
    if (existingSchema) {
      existingSchema.remove();
    }

    // Add new breadcrumb schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-breadcrumb-schema', 'true');
    script.textContent = JSON.stringify(breadcrumbSchema, null, 2);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const schemaToRemove = document.querySelector('script[data-breadcrumb-schema]');
      if (schemaToRemove) {
        schemaToRemove.remove();
      }
    };
  }, [pathname]);

  return null; // This component doesn't render anything visible
};
