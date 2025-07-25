import Link from 'next/link';

export default function FeaturesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="surface-primary min-h-screen">
            {/* Navigation breadcrumb */}
            <div className="container-app py-4">
                <nav className="flex items-center space-x-2 body-sm text-secondary">
                    <Link href="/" className="hover:text-brand-primary transition-colors">
                        Home
                    </Link>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-primary">Features</span>
                </nav>
            </div>

            {/* Content */}
            <main className="container-app pb-16">
                {children}
            </main>

            {/* Back to home CTA */}
            <div className="border-t border-gray-200 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5">
                <div className="container-app py-12 text-center">
                    <h3 className="heading-lg text-primary mb-4">
                        Pronto a iniziare?
                    </h3>
                    <p className="body-lg text-secondary mb-6 max-w-2xl mx-auto">
                        Scopri tutte le funzionalità di P.IVA Balance e semplifica la gestione della tua partita IVA.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/signup"
                            className="btn-base btn-primary px-8 py-4 rounded-xl body-md font-medium transition-all duration-200 hover:scale-105"
                        >
                            Inizia Gratis
                        </Link>
                        <Link
                            href="/signin"
                            className="btn-base btn-secondary px-8 py-4 rounded-xl body-md font-medium transition-all duration-200 hover:scale-105"
                        >
                            Accedi
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
} 