import { Inter } from 'next/font/google';
import { AuthProvider } from '@/providers/AuthProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { NotificationProvider } from '@/providers/NotificationProvider';
import { ThemeProvider } from '@/components/ui';
import { ServiceWorkerProvider } from '@/providers/ServiceWorkerProvider';
import { CookieBanner } from '@/components/cookies/CookieBanner';
import { Footer } from '@/components/layout/Footer';
// import { PWAInstallPrompt } from '@/components/pwa';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
});

export const metadata = {
  title: 'P.IVA Balance - Gestione Finanziaria',
  description: 'Sistema di gestione finanziaria per Partite IVA',
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "P.IVA Balance"
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
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
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ThemeProvider>
          <ServiceWorkerProvider>
            <QueryProvider>
              <AuthProvider>
                <NotificationProvider>
                  <div className="flex-grow">
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
