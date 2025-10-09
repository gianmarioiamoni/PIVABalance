import Link from 'next/link';

interface RelatedLink {
  title: string;
  href: string;
  description: string;
  category?: string;
}

interface RelatedLinksProps {
  links: RelatedLink[];
  title?: string;
  className?: string;
}

/**
 * Related Links Component for Internal SEO Linking
 * Helps with internal link building and user navigation
 */
export const RelatedLinks: React.FC<RelatedLinksProps> = ({ 
  links, 
  title = "Pagine Correlate", 
  className = "" 
}) => {
  if (!links.length) return null;

  return (
    <div className={`bg-gray-50 rounded-2xl p-8 ${className}`}>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        {title}
      </h3>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex flex-col h-full">
              {link.category && (
                <span className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">
                  {link.category}
                </span>
              )}
              
              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                {link.title}
              </h4>
              
              <p className="text-sm text-gray-600 flex-grow">
                {link.description}
              </p>
              
              <div className="mt-3 text-sm text-blue-600 font-medium group-hover:text-blue-700">
                Scopri di più →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

/**
 * Predefined related links for common pages
 */
export const getRelatedLinks = (currentPage: string): RelatedLink[] => {
  const allLinks: Record<string, RelatedLink[]> = {
    'calcoli-fiscali': [
      {
        title: 'Gestione Fatture',
        href: '/features/gestione-fatture',
        description: 'Organizza fatture e costi per ottimizzare i calcoli fiscali',
        category: 'Funzionalità'
      },
      {
        title: 'Dashboard Completa',
        href: '/features/dashboard-completa',
        description: 'Visualizza i risultati dei calcoli in grafici interattivi',
        category: 'Funzionalità'
      },
      {
        title: 'Privacy Policy',
        href: '/privacy-policy',
        description: 'Come proteggiamo i tuoi dati fiscali sensibili',
        category: 'Legale'
      }
    ],
    
    'gestione-fatture': [
      {
        title: 'Calcoli Fiscali',
        href: '/features/calcoli-fiscali',
        description: 'Calcola automaticamente tasse su fatture e costi',
        category: 'Funzionalità'
      },
      {
        title: 'Dashboard Completa',
        href: '/features/dashboard-completa',
        description: 'Analizza le performance delle tue fatture',
        category: 'Funzionalità'
      },
      {
        title: 'Accedi alla Dashboard',
        href: '/signin',
        description: 'Inizia subito a gestire le tue fatture',
        category: 'Azione'
      }
    ],
    
    'dashboard-completa': [
      {
        title: 'Calcoli Fiscali',
        href: '/features/calcoli-fiscali',
        description: 'I dati per alimentare la tua dashboard',
        category: 'Funzionalità'
      },
      {
        title: 'Gestione Fatture',
        href: '/features/gestione-fatture',
        description: 'Organizza i dati che visualizzi nella dashboard',
        category: 'Funzionalità'
      },
      {
        title: 'Registrati Gratis',
        href: '/signup',
        description: 'Crea il tuo account per accedere alla dashboard',
        category: 'Azione'
      }
    ],
    
    'homepage': [
      {
        title: 'Calcoli Fiscali Automatici',
        href: '/features/calcoli-fiscali',
        description: 'Scopri come automatizzare i tuoi calcoli fiscali',
        category: 'Funzionalità'
      },
      {
        title: 'Gestione Fatture e Costi',
        href: '/features/gestione-fatture',
        description: 'Organizza tutti i tuoi documenti fiscali',
        category: 'Funzionalità'
      },
      {
        title: 'Dashboard Completa',
        href: '/features/dashboard-completa',
        description: 'Visualizza la tua situazione finanziaria',
        category: 'Funzionalità'
      }
    ]
  };

  return allLinks[currentPage] || [];
};
