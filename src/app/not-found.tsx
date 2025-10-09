import Link from 'next/link';
import { Metadata } from 'next';
import { AccessibleIcon } from '@/components/common';

export const metadata: Metadata = {
  title: 'Pagina Non Trovata | P.IVA Balance',
  description: 'La pagina che stai cercando non esiste. Torna alla homepage o esplora le nostre funzionalità.',
  robots: {
    index: false,
    follow: true,
  },
};

/**
 * Custom 404 Page
 * Provides helpful navigation and maintains brand consistency
 */
export default function NotFound() {
  const suggestedLinks = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      description: 'Accedi alla tua dashboard personale',
      icon: '📊'
    },
    {
      title: 'Calcoli Fiscali',
      href: '/features/calcoli-fiscali',
      description: 'Scopri i nostri calcoli automatici',
      icon: '🧮'
    },
    {
      title: 'Gestione Fatture',
      href: '/features/gestione-fatture',
      description: 'Organizza le tue fatture e costi',
      icon: '📄'
    },
    {
      title: 'Supporto',
      href: '/support',
      description: 'Hai bisogno di aiuto? Contattaci',
      icon: '💬'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-16 px-8 shadow-lg rounded-2xl sm:px-16">
          {/* Error Icon and Code */}
          <div className="text-center mb-8">
            <AccessibleIcon 
              emoji="🔍" 
              alt="Pagina non trovata" 
              size="xxl" 
              className="mb-6 text-gray-400"
            />
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Pagina Non Trovata
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Oops! La pagina che stai cercando non esiste o è stata spostata.
              Non preoccuparti, ti aiutiamo a trovare quello che cerchi.
            </p>
          </div>

          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <AccessibleIcon 
                emoji="🏠" 
                alt="" 
                size="sm" 
                className="mr-2" 
                aria-hidden 
              />
              Torna alla Homepage
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <AccessibleIcon 
                emoji="↩️" 
                alt="" 
                size="sm" 
                className="mr-2" 
                aria-hidden 
              />
              Torna Indietro
            </button>
          </div>

          {/* Suggested Links */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
              Pagine Popolari
            </h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {suggestedLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-start space-x-3">
                    <AccessibleIcon 
                      emoji={link.icon} 
                      alt="" 
                      size="md" 
                      className="text-blue-600 mt-1" 
                      aria-hidden 
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {link.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {link.description}
                      </p>
                    </div>
                    <AccessibleIcon 
                      emoji="→" 
                      alt="" 
                      size="sm" 
                      className="text-gray-400 group-hover:text-blue-600 transition-colors mt-1" 
                      aria-hidden 
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Search Suggestion */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-blue-700">
              <AccessibleIcon 
                emoji="💡" 
                alt="Suggerimento" 
                size="sm" 
              />
              <p className="text-sm font-medium">
                Suggerimento: Usa la barra di ricerca nella homepage per trovare rapidamente quello che cerchi
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Hai ancora problemi? {' '}
              <Link 
                href="/support" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Contatta il supporto
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
