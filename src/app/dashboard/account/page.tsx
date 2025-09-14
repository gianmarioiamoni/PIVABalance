import { Metadata } from 'next';
import { AccountManagement } from '@/components/account/AccountManagement';

export const metadata: Metadata = {
  title: 'Gestione Account - PIVABalance',
  description: 'Gestisci il tuo account: modifica password, aggiorna profilo e impostazioni di sicurezza.',
};

/**
 * Account Management Page
 * 
 * Server component that renders the account management interface.
 * Follows Next.js 13+ app router patterns and RSC architecture.
 */
export default function AccountPage() {
  return (
    <div className="container-app py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="heading-lg mb-2">Gestione Account</h1>
          <p className="text-tertiary">
            Gestisci le impostazioni del tuo account, sicurezza e preferenze personali.
          </p>
        </div>
        
        <AccountManagement />
      </div>
    </div>
  );
}
