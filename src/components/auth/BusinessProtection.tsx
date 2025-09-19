'use client';

import React from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { ExclamationTriangleIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';

interface BusinessProtectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Business Protection Component
 * 
 * Protects business pages from super admin access.
 * Super admins should only manage the system, not access business functionality.
 * 
 * Features:
 * - Blocks super_admin from business pages
 * - Allows user and admin access
 * - Custom fallback UI for super admins
 * - Clear messaging about access restrictions
 */
export const BusinessProtection: React.FC<BusinessProtectionProps> = ({
  children,
  fallback
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifica autorizzazioni...</p>
        </div>
      </div>
    );
  }

  // Check authentication
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="card">
            <div className="card-body py-12">
              <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-6" />
              <h2 className="heading-md mb-4 text-red-800">Accesso Negato</h2>
              <p className="text-gray-600 mb-6">
                È necessario effettuare il login per accedere a questa pagina.
              </p>
              <a href="/signin" className="btn-primary">
                Vai al Login
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Block super admin from business pages
  if ((user as { role?: string }).role === 'super_admin') {
    // Show custom fallback if provided
    if (fallback) {
      return <>{fallback}</>;
    }

    // Default super admin restriction message
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-lg mx-auto text-center">
          <div className="card">
            <div className="card-body py-12">
              <ShieldExclamationIcon className="h-16 w-16 text-blue-500 mx-auto mb-6" />
              <h2 className="heading-md mb-4 text-blue-800">Accesso Limitato per Super Admin</h2>
              <p className="text-gray-600 mb-4">
                Come <strong>Super Amministratore</strong>, il tuo ruolo è focalizzato sulla gestione del sistema.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">Le tue funzionalità:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 👨‍💼 Gestione Utenti e Ruoli</li>
                  <li>• 🔍 Monitoring del Sistema</li>
                  <li>• ⚙️ Configurazioni Globali</li>
                  <li>• 👤 Gestione Account Personale</li>
                </ul>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Le funzionalità business (Dashboard, Fatture, Costi) sono riservate agli utenti operativi.
              </p>
              <div className="space-y-2">
                <a href="/dashboard/admin" className="btn-primary block">
                  Vai al Pannello Amministrazione
                </a>
                <a href="/dashboard/monitoring" className="btn-secondary block">
                  Vai al Monitoring
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User has appropriate role (user or admin), show protected content
  return <>{children}</>;
};
