'use client';

import React, { useState } from 'react';
import { UserManagement } from './UserManagement';
import { 
  UsersIcon, 
  ChartBarIcon, 
  CogIcon,
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';

/**
 * Admin Dashboard Component
 * 
 * Main container for all admin-related functionality.
 * Organized in clear sections following admin UX best practices:
 * - User management (primary function)
 * - System statistics
 * - Configuration settings
 * - Security monitoring
 * 
 * Follows SRP by delegating specific functionality to specialized components.
 */
export const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'users' | 'stats' | 'settings' | 'security'>('users');

  const sections = [
    {
      id: 'users' as const,
      title: 'Gestione Utenti',
      description: 'Visualizza e gestisci gli utenti registrati',
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'stats' as const,
      title: 'Statistiche',
      description: 'Analytics e metriche del sistema',
      icon: ChartBarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'settings' as const,
      title: 'Configurazioni',
      description: 'Impostazioni globali del sistema',
      icon: CogIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: 'security' as const,
      title: 'Sicurezza',
      description: 'Audit log e monitoraggio sicurezza',
      icon: ShieldCheckIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Section Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${isActive 
                    ? `border-current ${section.color}` 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span>{section.title}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Section Content */}
      <div className="animate-fade-in">
        {activeSection === 'users' && (
          <div>
            <div className="mb-6">
              <h2 className="heading-md mb-2">Gestione Utenti</h2>
              <p className="text-tertiary">
                Visualizza, modifica e gestisci tutti gli utenti registrati nel sistema.
              </p>
            </div>
            <UserManagement />
          </div>
        )}

        {activeSection === 'stats' && (
          <div>
            <div className="mb-6">
              <h2 className="heading-md mb-2">Statistiche Sistema</h2>
              <p className="text-tertiary">
                Analytics e metriche di utilizzo del sistema.
              </p>
            </div>
            <div className="card">
              <div className="card-body text-center py-12">
                <ChartBarIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Statistiche in Sviluppo
                </h3>
                <p className="text-gray-600">
                  Le statistiche dettagliate saranno disponibili nella prossima versione.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'settings' && (
          <div>
            <div className="mb-6">
              <h2 className="heading-md mb-2">Configurazioni Sistema</h2>
              <p className="text-tertiary">
                Impostazioni globali e configurazioni del sistema.
              </p>
            </div>
            <div className="card">
              <div className="card-body text-center py-12">
                <CogIcon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Configurazioni in Sviluppo
                </h3>
                <p className="text-gray-600">
                  Le configurazioni di sistema saranno disponibili nella prossima versione.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'security' && (
          <div>
            <div className="mb-6">
              <h2 className="heading-md mb-2">Sicurezza e Audit</h2>
              <p className="text-tertiary">
                Log delle attività e monitoraggio della sicurezza.
              </p>
            </div>
            <div className="card">
              <div className="card-body text-center py-12">
                <ShieldCheckIcon className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Audit Log in Sviluppo
                </h3>
                <p className="text-gray-600">
                  Il sistema di audit e monitoraggio sarà disponibile nella prossima versione.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
