/**
 * Structured Data Component for SEO
 * Implements Schema.org markup for better search engine understanding
 */

interface StructuredDataProps {
  type: 'website' | 'software' | 'organization' | 'service' | 'article';
  data?: Record<string, string | number | boolean | Date>;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ type, data = {} }) => {
  const getStructuredData = () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pivabalance.com';
    
    switch (type) {
      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "P.IVA Balance",
          "alternateName": "PIVABalance",
          "url": baseUrl,
          "description": "Sistema di gestione finanziaria per Partite IVA. Calcola tasse, gestisci fatture e costi con semplicità.",
          "inLanguage": "it-IT",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${baseUrl}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          },
          "publisher": {
            "@type": "Organization",
            "name": "P.IVA Balance",
            "url": baseUrl,
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/icons/icon-512x512.svg`,
              "width": 512,
              "height": 512
            }
          }
        };

      case 'software':
        return {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "P.IVA Balance",
          "applicationCategory": "BusinessApplication",
          "applicationSubCategory": "FinanceApplication",
          "operatingSystem": "Web Browser",
          "description": "Sistema completo di gestione finanziaria per freelancer e partite IVA. Calcoli fiscali automatici, gestione fatture e costi.",
          "url": baseUrl,
          "screenshot": `${baseUrl}/icons/icon-512x512.svg`,
          "softwareVersion": "1.0",
          "datePublished": "2024-01-01",
          "dateModified": new Date().toISOString().split('T')[0],
          "inLanguage": "it-IT",
          "copyrightYear": new Date().getFullYear(),
          "copyrightHolder": {
            "@type": "Organization",
            "name": "P.IVA Balance"
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock",
            "category": "Free"
          },
          "featureList": [
            "Calcoli fiscali automatici",
            "Gestione fatture",
            "Controllo costi",
            "Dashboard analytics",
            "Regime forfettario e ordinario",
            "Export dati",
            "Backup automatico"
          ],
          "requirements": "Browser web moderno con JavaScript abilitato",
          "author": {
            "@type": "Organization",
            "name": "P.IVA Balance Team"
          }
        };

      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "P.IVA Balance",
          "alternateName": "PIVABalance",
          "url": baseUrl,
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/icons/icon-512x512.svg`,
            "width": 512,
            "height": 512
          },
          "description": "Piattaforma digitale per la gestione finanziaria delle partite IVA italiane",
          "foundingDate": "2024",
          "industry": "Financial Technology",
          "numberOfEmployees": "1-10",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "IT",
            "addressLocality": "Italia"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "support@pivabalance.com",
            "availableLanguage": "Italian"
          },
          "sameAs": [
            // Add social media profiles when available
          ]
        };

      case 'service':
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": data.name || "Gestione Finanziaria P.IVA",
          "description": data.description || "Servizio completo di gestione finanziaria per partite IVA con calcoli fiscali automatici",
          "provider": {
            "@type": "Organization",
            "name": "P.IVA Balance",
            "url": baseUrl
          },
          "areaServed": {
            "@type": "Country",
            "name": "Italy"
          },
          "availableChannel": {
            "@type": "ServiceChannel",
            "serviceUrl": baseUrl,
            "serviceSmsNumber": null,
            "servicePhone": null
          },
          "category": "Financial Services",
          "serviceType": "Business Software",
          "hoursAvailable": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
            ],
            "opens": "00:00",
            "closes": "23:59"
          }
        };

      case 'article':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data.title,
          "description": data.description,
          "image": data.image || `${baseUrl}/icons/icon-512x512.svg`,
          "author": {
            "@type": "Organization",
            "name": "P.IVA Balance Team"
          },
          "publisher": {
            "@type": "Organization",
            "name": "P.IVA Balance",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/icons/icon-512x512.svg`,
              "width": 512,
              "height": 512
            }
          },
          "datePublished": data.datePublished || new Date().toISOString(),
          "dateModified": data.dateModified || new Date().toISOString(),
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": data.url || baseUrl
          },
          "inLanguage": "it-IT"
        };

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
};
