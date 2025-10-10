import { Inter } from 'next/font/google';
import { AuthProvider } from '@/providers/AuthProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { NotificationProvider } from '@/providers/NotificationProvider';
import { ThemeProvider } from '@/components/ui';
import { ServiceWorkerProvider } from '@/providers/ServiceWorkerProvider';
import { CookieBanner } from '@/components/cookies/CookieBanner';
import { Footer } from '@/components/layout/Footer';
import { GoogleAnalytics } from '@/components/analytics';
import { SkipLinks } from '@/components/common/SkipLinks';
// import { PWAInstallPrompt } from '@/components/pwa';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://pivabalance.com'),
  title: 'P.IVA Balance - Gestione Finanziaria',
  description: 'Sistema di gestione finanziaria per Partite IVA. Calcola tasse, gestisci fatture e costi con semplicità. Regime forfettario e ordinario supportati.',
  keywords: 'partita iva, gestione finanziaria, calcolo tasse, regime forfettario, fatture, costi, INPS, commercialista',
  authors: [{ name: 'P.IVA Balance Team' }],
  creator: 'P.IVA Balance',
  publisher: 'P.IVA Balance',
  manifest: "/api/manifest",

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://pivabalance.com',
    title: 'P.IVA Balance - Gestione Finanziaria per Partite IVA',
    description: 'La soluzione completa per la gestione fiscale della tua partita IVA. Calcola tasse, gestisci fatture e costi con semplicità.',
    siteName: 'P.IVA Balance',
    images: [
      {
        url: '/icons/icon-512x512.svg',
        width: 512,
        height: 512,
        alt: 'P.IVA Balance Logo',
      },
      {
        url: '/icons/icon-192x192.svg',
        width: 192,
        height: 192,
        alt: 'P.IVA Balance Icon',
      },
    ],
  },

  // Twitter Cards
  twitter: {
    card: 'summary_large_image',
    title: 'P.IVA Balance - Gestione Finanziaria',
    description: 'Sistema completo per la gestione fiscale della tua partita IVA. Calcoli automatici, fatture e costi organizzati.',
    images: ['/icons/icon-512x512.svg'],
    creator: '@pivabalance',
    site: '@pivabalance',
  },

  // Additional SEO
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // PWA
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "P.IVA Balance"
  },

  // Verification (to be added when available)
  // verification: {
  //   google: 'google-site-verification-code',
  //   yandex: 'yandex-verification-code',
  //   yahoo: 'yahoo-site-verification-code',
  // },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  // Removed maximumScale and userScalable restrictions for WCAG 2.1 AA compliance
  // Users must be able to zoom up to 200% without loss of functionality
  viewportFit: "cover",
  themeColor: "#3B82F6"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="P.IVA Balance" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="P.IVA Balance" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />

        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Splash Screens */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                    })
                    .catch(function(registrationError) {
                      console.info('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        {/* Skip Links for WCAG 2.1 AA Compliance */}
        <SkipLinks />
        
        {/* Google Analytics */}
        <GoogleAnalytics />
        
        <ThemeProvider>
          <ServiceWorkerProvider>
            <QueryProvider>
              <AuthProvider>
                <NotificationProvider>
                  <div id="main-content" className="flex-grow">
                    {children}
                  </div>
                  <Footer />
                  <CookieBanner />
                  {/* <PWAInstallPrompt autoShow={true} showDelay={5000} /> */}
                </NotificationProvider>
              </AuthProvider>
            </QueryProvider>
          </ServiceWorkerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
