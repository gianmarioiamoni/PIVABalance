/**
 * Dashboard SSR Component
 * 
 * SRP: Handles ONLY server-side dashboard structure rendering
 * Server-side component for initial dashboard layout and SEO
 */

import React from 'react';
import { WidgetSkeleton } from '@/components/widgets/base/WidgetSkeleton';
import { Layout, BarChart3 } from 'lucide-react';

/**
 * Dashboard SSR Props
 * SRP: Interface for server-side dashboard properties
 */
export interface DashboardSSRProps {
    userId?: string;
    layoutName?: string;
    className?: string;
}

/**
 * Default Dashboard Structure
 * SRP: Handles only default layout structure definition
 */
const getDefaultDashboardStructure = () => [
    { id: 'cashflow', title: 'Cash Flow', size: 'full' as const, showChart: true },
    { id: 'revenue', title: 'Ricavi', size: 'small' as const, showStats: true },
    { id: 'costs', title: 'Costi', size: 'small' as const, showStats: true },
    { id: 'profit', title: 'Profittabilità', size: 'medium' as const, showStats: true },
    { id: 'tax', title: 'Tasse', size: 'full' as const, showTable: true }
];

/**
 * Dashboard Header Component
 * SRP: Handles only dashboard header rendering
 */
const DashboardHeader: React.FC<{ layoutName: string }> = ({ layoutName }) => (
    <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Dashboard Finanziaria
                </h1>
                <p className="text-sm text-gray-600">
                    {layoutName} • Panoramica completa della tua attività
                </p>
            </div>
        </div>

        <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <Layout className="h-4 w-4" />
                <span>Layout Personalizzabile</span>
            </div>
        </div>
    </div>
);

/**
 * Dashboard Grid Structure
 * SRP: Handles only grid layout structure rendering
 */
const DashboardGrid: React.FC<{ widgets: ReturnType<typeof getDefaultDashboardStructure> }> = ({
    widgets
}) => (
    <div className="grid grid-cols-12 gap-4 auto-rows-fr min-h-[200px] p-6">
        {widgets.map(widget => (
            <div
                key={widget.id}
                className={`
          ${widget.size === 'small' ? 'col-span-12 sm:col-span-6 lg:col-span-3' : ''}
          ${widget.size === 'medium' ? 'col-span-12 sm:col-span-6' : ''}
          ${widget.size === 'full' ? 'col-span-12' : ''}
        `}
            >
                <WidgetSkeleton
                    size={widget.size}
                    title={widget.title}
                    showHeader={true}
                    showChart={widget.showChart}
                    showStats={widget.showStats}
                    showTable={widget.showTable}
                />
            </div>
        ))}
    </div>
);

// Dashboard Loading State and Empty State components removed as they're not used
// They can be re-added later if needed for specific use cases

/**
 * Dashboard SSR Component (Server-Side Rendered)
 * 
 * SRP Responsibilities:
 * 1. Initial dashboard structure rendering ONLY
 * 2. SEO-friendly dashboard markup ONLY
 * 3. Loading states for progressive enhancement ONLY
 * 
 * NOT responsible for:
 * - Interactive dashboard features (handled by client components)
 * - Data fetching (handled by hooks)
 * - Widget logic (handled by widget components)
 */
export const DashboardSSR: React.FC<DashboardSSRProps> = ({
    userId: _userId,
    layoutName = 'Layout Predefinito',
    className = ''
}) => {
    // For SSR, we render the structure with skeletons
    // The client-side component will hydrate with real data

    return (
        <div className={`dashboard-ssr min-h-screen bg-gray-50 ${className}`}>
            <DashboardHeader layoutName={layoutName} />
            <DashboardGrid widgets={getDefaultDashboardStructure()} />

            {/* SEO and Accessibility */}
            <div className="sr-only">
                <h2>Dashboard Finanziaria per Partite IVA</h2>
                <p>
                    Monitora ricavi, costi, profittabilità e situazione fiscale della tua attività.
                    Dashboard personalizzabile con widget interattivi e analisi in tempo reale.
                </p>
                <ul>
                    <li>Analisi Cash Flow con grafici interattivi</li>
                    <li>Monitoraggio ricavi e trend mensili</li>
                    <li>Gestione costi per categoria</li>
                    <li>Calcoli fiscali automatici</li>
                    <li>Indicatori di profittabilità</li>
                </ul>
            </div>
        </div>
    );
};

export default DashboardSSR;
