import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Autenticazione - P.IVA Balance',
  description: 'Accedi o registrati per gestire la tua attività finanziaria professionale',
};

/**
 * Authentication Layout
 * Minimal layout for auth pages (signin, signup, forgot-password, etc.)
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-brand-primary text-white px-4 py-2 rounded-md z-50"
      >
        Vai al contenuto principale
      </a>

      <main id="main-content" role="main">
        {children}
      </main>
    </>
  );
} 