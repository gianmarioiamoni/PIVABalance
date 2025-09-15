import React from 'react';
import Link from 'next/link';

/**
 * Footer Component
 * 
 * Simple footer with legal links and basic information
 */
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Left side - Brand and copyright */}
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600">
              © {currentYear} PIVABalance. Tutti i diritti riservati.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Sistema di gestione finanziaria per Partite IVA
            </p>
          </div>

          {/* Right side - Legal links */}
          <div className="flex flex-wrap justify-center md:justify-end items-center space-x-6 text-sm">
            <Link 
              href="/privacy-policy"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/cookie-policy"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cookie Policy
            </Link>
            <span className="text-gray-400">|</span>
            <span className="text-xs text-gray-500">
              Conforme GDPR
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
