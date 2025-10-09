interface BreadcrumbItem {
    label: string;
    href: string;
    current?: boolean;
}

interface BreadcrumbSchemaProps {
    pathname: string;
    items?: BreadcrumbItem[];
}

/**
 * Server-side Breadcrumb Schema.org Structured Data
 * Generates JSON-LD for breadcrumb navigation without client-side hooks
 */
export const BreadcrumbSchema: React.FC<BreadcrumbSchemaProps> = ({ pathname, items }) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pivabalance.com';

    // Generate breadcrumbs if not provided
    const breadcrumbItems = items || (() => {
        const pathSegments = pathname.split('/').filter(segment => segment !== '');
        const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

        let currentPath = '';
        pathSegments.forEach((segment, index) => {
            currentPath += `/${segment}`;

            // Convert segment to readable label
            const routeLabels: Record<string, string> = {
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

        return breadcrumbs;
    })();

    // Don't generate schema for home page
    if (pathname === '/' || breadcrumbItems.length <= 1) {
        return null;
    }

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbItems.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.label,
            "item": `${baseUrl}${item.href}`
        }))
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(breadcrumbSchema, null, 2)
            }}
        />
    );
};
