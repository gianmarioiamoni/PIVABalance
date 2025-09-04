import React from 'react';
import type { HomepageConfig } from './types';

/**
 * Homepage Configuration
 * 
 * Open/Closed Principle: Open for extension (add new features/data) closed for modification
 * Single Responsibility: Centralized configuration management
 */

// Feature Icons as React components for better performance
const CalculatorIcon = (
    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H3.75zM3.75 6h-.75m0 0v.75c0 .414.336.75.75.75h.75m0-1.5h.75m0 0V4.5c0-.621.504-1.125 1.125-1.125h.75m0 1.5v.75c0 .414.336.75.75.75h.75M6 12v.75c0 .414.336.75.75.75h.75m0-.75V12c0-.621.504-1.125 1.125-1.125h.75m0 1.125v.75c0 .414.336.75.75.75h.75m0-.75V12c0-.621.504-1.125 1.125-1.125h.75M6 7.5v.75c0 .414.336.75.75.75h.75m0-.75V7.5c0-.621.504-1.125 1.125-1.125h.75m0 1.125v.75c0 .414.336.75.75.75h.75M6 18v.75c0 .414.336.75.75.75h.75m0-.75V18c0-.621.504-1.125 1.125-1.125h.75" />
        </svg>
    </div>
);

const DocumentIcon = (
    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
    </div>
);

const DashboardIcon = (
    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-2.25m2.25 0l.5 1.5m.5-1.5l1 3m-16.5-3l-1 3m1.5 1.5l.5-1.5m.5 1.5l1 3m-16.5-3l1 3m0 0l.5 1.5m-.5-1.5h2.25m-2.25 0l-.5 1.5" />
        </svg>
    </div>
);

// Homepage Configuration Object
export const HOMEPAGE_CONFIG: HomepageConfig = {
    trustData: {
        enabled: false, // Set to true when we have real data
        userCount: 0, // e.g., 250
        rating: 0, // e.g., 4.9
        maxRating: 5,
        reviewCount: 0 // e.g., 127
    },

    hero: {
        title: "P.IVA Balance",
        subtitle: `La <span class="font-semibold text-brand-primary">soluzione completa</span> per la gestione fiscale della tua partita IVA.<br class="hidden sm:block" />Calcola tasse, gestisci fatture e costi con <span class="font-semibold text-brand-secondary">semplicità</span>.`,
        primaryCTA: {
            text: "Accedi alla Dashboard",
            href: "/signin"
        },
        secondaryCTA: {
            text: "Inizia Gratis",
            href: "/signup"
        }
    },

    cta: {
        title: "Pronto a semplificare la tua gestione fiscale?",
        description: "Unisciti a centinaia di professionisti che hanno già scelto P.IVA Balance per gestire la loro attività",
        ctaText: "Inizia la prova gratuita",
        ctaHref: "/signup"
    },

    features: [
        {
            icon: CalculatorIcon,
            title: "Calcoli Fiscali Automatici",
            description: "Calcola automaticamente tasse, contributi INPS e previdenziali per regime forfettario e ordinario con precisione garantita.",
            href: "/features/calcoli-fiscali",
            textColor: "text-blue-600",       // Blue theme for calculator
            linkColor: "text-blue-600",       // Matching link color
            accentColor: "bg-green-400",
            backgroundGradient: "bg-gradient-to-r from-blue-500/10 to-indigo-500/10",
            rotationClass: "rotate-3",
            animationDelay: "delay-700"
        },
        {
            icon: DocumentIcon,
            title: "Gestione Fatture e Costi",
            description: "Organizza fatture emesse e costi sostenuti con categorizzazione automatica per deducibilità fiscale e reporting avanzato.",
            href: "/features/gestione-fatture",
            textColor: "text-purple-600",     // Purple theme for documents
            linkColor: "text-purple-600",     // Matching link color
            accentColor: "bg-orange-400",
            backgroundGradient: "bg-gradient-to-r from-purple-500/10 to-pink-500/10",
            rotationClass: "-rotate-3",
            animationDelay: "delay-800"
        },
        {
            icon: DashboardIcon,
            title: "Dashboard Completa",
            description: "Visualizza in tempo reale la situazione fiscale con grafici intuitivi, report dettagliati e analisi predittive personalizzate.",
            href: "/features/dashboard-completa",
            textColor: "text-green-600",      // Green theme for dashboard
            linkColor: "text-green-600",      // Matching link color
            accentColor: "bg-purple-400",
            backgroundGradient: "bg-gradient-to-r from-green-500/10 to-teal-500/10",
            rotationClass: "rotate-2",
            animationDelay: "delay-900"
        }
    ]
}; 