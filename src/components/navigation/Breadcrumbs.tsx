'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumbs Component for Navigation and SEO
 * Automatically generates breadcrumbs based on URL path or accepts custom items
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname if no custom items provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(segment => segment !== '');

    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      // Convert segment to readable label
      const label = getSegmentLabel(segment, pathSegments, index);

      breadcrumbs.push({
        label,
        href: currentPath,
        current: isLast
      });
    });

    return breadcrumbs;
  };

  // Convert URL segment to human-readable label
  const getSegmentLabel = (segment: string, segments: string[], index: number): string => {
    // Handle specific routes
    const routeLabels: Record<string, string> = {
      'dashboard': 'Dashboard',
      'features': 'Funzionalità',
      'calcoli-fiscali': 'Calcoli Fiscali',
      'gestione-fatture': 'Gestione Fatture',
      'dashboard-completa': 'Dashboard Completa',
      'privacy-policy': 'Privacy Policy',
      'cookie-policy': 'Cookie Policy',
      'donations': 'Donazioni',
      'signin': 'Accedi',
      'signup': 'Registrati',
      'account': 'Account',
      'settings': 'Impostazioni',
      'invoices': 'Fatture',
      'costs': 'Costi',
      'taxes': 'Tasse',
      'analytics': 'Analytics',
      'admin': 'Amministrazione',
      'monitoring': 'Monitoraggio',
      'customizable': 'Personalizzabile'
    };

    return routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (pathname === '/' || breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav
      className={`flex ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRightIcon className="w-4 h-4 text-gray-400 mx-1" />
            )}

            {item.current ? (
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {index === 0 && (
                  <HomeIcon className="w-4 h-4 mr-2 inline" />
                )}
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                {index === 0 && (
                  <HomeIcon className="w-4 h-4 mr-2" />
                )}
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

