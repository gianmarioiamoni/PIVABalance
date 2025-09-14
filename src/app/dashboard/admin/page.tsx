import { Metadata } from 'next';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'Amministrazione - PIVABalance',
  description: 'Pannello di amministrazione per la gestione degli utenti e del sistema.',
};

/**
 * Admin Dashboard Page
 * 
 * Server component that renders the admin dashboard interface.
 * Protected route - only accessible to admin users.
 * Follows Next.js 13+ app router patterns and RSC architecture.
 */
export default function AdminPage() {
  return (
    <div className="container-app py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="heading-lg mb-2">Pannello Amministrazione</h1>
          <p className="text-tertiary">
            Gestisci utenti, ruoli e impostazioni del sistema.
          </p>
        </div>
        
        <AdminDashboard />
      </div>
    </div>
  );
}
