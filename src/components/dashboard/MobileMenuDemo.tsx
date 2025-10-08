/**
 * Mobile Navigation Menu Backdrop Style Demo
 * 
 * This component demonstrates different backdrop styles for the mobile menu.
 * Use this to test and choose the best visual option.
 */

'use client';

import { useState } from 'react';
import { MobileNavigationMenu } from '@/components/dashboard/MobileNavigationMenu';

type BackdropStyle = 'blur' | 'dark' | 'light' | 'none';

const mockNavigationItems = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        current: true,
        group: 'core',
        icon: '📊',
    },
    {
        name: 'Fatture',
        href: '/dashboard/invoices',
        current: false,
        group: 'financial',
        icon: '📄',
    },
    {
        name: 'Costi',
        href: '/dashboard/costs',
        current: false,
        group: 'financial',
        icon: '💰',
    },
    {
        name: 'Impostazioni',
        href: '/dashboard/settings',
        current: false,
        group: 'management',
        icon: '⚙️',
    },
];

const mockGetGroupColors = (group: string, current: boolean, _disabled: boolean) => ({
    bg: current ? 'bg-blue-100' : 'bg-white',
    text: current ? 'text-blue-900' : 'text-gray-700',
    accent: 'bg-blue-500',
    shadow: 'rgba(59, 130, 246, 0.5)',
});

export const MobileMenuDemo = () => {
    const [currentStyle, setCurrentStyle] = useState<BackdropStyle>('blur');

    const backdropOptions: { value: BackdropStyle; label: string; description: string }[] = [
        {
            value: 'blur',
            label: '🌟 Blur Effect (Consigliato)',
            description: 'Sfocatura elegante del contenuto sottostante'
        },
        {
            value: 'light',
            label: '☁️ Light Overlay',
            description: 'Overlay chiaro e discreto'
        },
        {
            value: 'dark',
            label: '🌙 Dark Overlay',
            description: 'Overlay scuro tradizionale (quello precedente)'
        },
        {
            value: 'none',
            label: '🚫 No Backdrop',
            description: 'Nessun overlay, solo il menu'
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            {/* Demo Content */}
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        🎨 Mobile Menu Backdrop Demo
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Prova i diversi stili di backdrop per il menu mobile
                    </p>
                </div>

                {/* Style Selector */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Seleziona lo stile del backdrop:
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {backdropOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setCurrentStyle(option.value)}
                                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${currentStyle === option.value
                                        ? 'border-blue-500 bg-blue-50 shadow-md'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="font-medium text-gray-900 mb-1">
                                    {option.label}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {option.description}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sample Content */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        📊 Contenuto della Dashboard
                    </h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                            <h3 className="text-lg font-semibold mb-2">Fatture Totali</h3>
                            <p className="text-3xl font-bold">€45,230</p>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                            <h3 className="text-lg font-semibold mb-2">Guadagno Netto</h3>
                            <p className="text-3xl font-bold">€32,180</p>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                            <h3 className="text-lg font-semibold mb-2">Tasse Pagate</h3>
                            <p className="text-3xl font-bold">€8,420</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Grafico delle Performance
                        </h3>
                        <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <div className="text-4xl mb-2">📈</div>
                                <p>Grafico delle entrate mensili</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                        🔍 Come testare:
                    </h3>
                    <ol className="list-decimal list-inside text-yellow-700 space-y-1">
                        <li>Seleziona uno stile di backdrop sopra</li>
                        <li>Clicca il menu hamburger (☰) in alto a sinistra</li>
                        <li>Osserva come appare il contenuto dietro al menu</li>
                        <li>Prova diversi stili per confrontare l&apos;effetto visivo</li>
                    </ol>
                </div>
            </div>

            {/* Mobile Navigation Menu with current style */}
            <MobileNavigationMenu
                navigationItems={mockNavigationItems}
                getGroupColors={mockGetGroupColors}
                backdropStyle={currentStyle}
            />
        </div>
    );
};
