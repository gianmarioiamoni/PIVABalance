'use client';

import React, { useState } from 'react';
import { ProfileSection } from './ProfileSection';
import { PasswordSection } from './PasswordSection';
import { DangerZone } from './DangerZone';
import { PrivacyRights } from './PrivacyRights';
import { CookieSettings } from '@/components/cookies';
import { 
  UserIcon, 
  KeyIcon, 
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

/**
 * Account Management Component
 * 
 * Main container for all account-related settings and actions.
 * Organized in clear sections following UX best practices:
 * - Profile information (safe operations)
 * - Security settings (password changes)
 * - Danger zone (destructive operations)
 * 
 * Follows SRP by delegating specific functionality to specialized components.
 */
export const AccountManagement: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'profile' | 'security' | 'privacy' | 'rights' | 'danger'>('profile');

  const sections = [
    {
      id: 'profile' as const,
      title: 'Profilo',
      description: 'Informazioni personali e dati account',
      icon: UserIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'security' as const,
      title: 'Sicurezza',
      description: 'Password e impostazioni di sicurezza',
      icon: KeyIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'privacy' as const,
      title: 'Privacy e Cookie',
      description: 'Gestisci le tue preferenze su privacy e cookie',
      icon: ShieldCheckIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: 'rights' as const,
      title: 'Diritti Privacy',
      description: 'Esercita i tuoi diritti GDPR (accesso, portabilità dati)',
      icon: DocumentTextIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      id: 'danger' as const,
      title: 'Zona Pericolosa',
      description: 'Eliminazione account e operazioni irreversibili',
      icon: ExclamationTriangleIcon,
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
        {activeSection === 'profile' && (
          <div>
            <div className="mb-6">
              <h2 className="heading-md mb-2">Informazioni Profilo</h2>
              <p className="text-tertiary">
                Gestisci le tue informazioni personali e i dati del profilo.
              </p>
            </div>
            <ProfileSection />
          </div>
        )}

        {activeSection === 'security' && (
          <div>
            <div className="mb-6">
              <h2 className="heading-md mb-2">Sicurezza Account</h2>
              <p className="text-tertiary">
                Modifica la tua password e gestisci le impostazioni di sicurezza.
              </p>
            </div>
            <PasswordSection />
          </div>
        )}

      {activeSection === 'privacy' && (
        <div>
          <div className="mb-6">
            <h2 className="heading-md mb-2">Privacy e Cookie</h2>
            <p className="text-tertiary">
              Gestisci le tue preferenze sulla privacy e il consenso ai cookie secondo il GDPR.
            </p>
          </div>
          <CookieSettings />
        </div>
      )}

      {activeSection === 'rights' && (
        <div>
          <div className="mb-6">
            <h2 className="heading-md mb-2">Diritti Privacy (GDPR)</h2>
            <p className="text-tertiary">
              Esercita i tuoi diritti sulla protezione dei dati personali secondo il GDPR.
            </p>
          </div>
          <PrivacyRights />
        </div>
      )}

        {activeSection === 'danger' && (
          <div>
            <div className="mb-6">
              <h2 className="heading-md mb-2 text-red-600">Zona Pericolosa</h2>
              <p className="text-tertiary">
                Operazioni irreversibili che elimineranno permanentemente i tuoi dati.
              </p>
            </div>
            <DangerZone />
          </div>
        )}
      </div>
    </div>
  );
};
