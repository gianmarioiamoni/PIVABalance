/**
 * Dashboard Hybrid Component
 * 
 * SRP: Handles ONLY SSR/CSR coordination for dashboard
 * Progressive enhancement from SSR skeleton to interactive CSR dashboard
 */

'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { DashboardSSR } from '../server/DashboardSSR';

/**
 * Dashboard Hybrid Props
 * SRP: Interface for hybrid dashboard properties
 */
export interface DashboardHybridProps {
    userId?: string;
    layoutId?: string;
    enableCustomization?: boolean;
    className?: string;
}

/**
 * Dynamic Import for Customizable Dashboard
 * SRP: Handles only client-side dashboard loading
 */
const DynamicCustomizableDashboard = dynamic(
    () => import('../CustomizableDashboard').then(mod => ({
        default: mod.CustomizableDashboard
    })),
    {
        ssr: false, // Client-side only for interactivity
        loading: () => <DashboardSSR layoutName="Caricamento Dashboard Interattiva..." />
    }
);

/**
 * Dashboard Hybrid Component (Progressive Enhancement)
 * 
 * SRP Responsibilities:
 * 1. SSR to CSR transition coordination ONLY
 * 2. Progressive enhancement orchestration ONLY
 * 3. Loading state management ONLY
 * 
 * NOT responsible for:
 * - Dashboard logic (delegated to CustomizableDashboard)
 * - Widget management (delegated to widget system)
 * - Data fetching (delegated to hooks)
 * 
 * Architecture:
 * 1. SSR: Immediate skeleton with SEO-friendly structure
 * 2. Hydration: Progressive enhancement to interactive dashboard
 * 3. CSR: Full interactivity with real-time data
 */
export const DashboardHybrid: React.FC<DashboardHybridProps> = ({
    userId,
    layoutId,
    enableCustomization = true,
    className = ''
}) => {
    return (
        <div className={`dashboard-hybrid ${className}`}>
            <Suspense fallback={<DashboardSSR userId={userId} layoutName="Inizializzazione..." />}>
                <DynamicCustomizableDashboard
                    defaultLayout={layoutId}
                    enableCustomization={enableCustomization}
                    maxWidgets={20}
                    className="min-h-screen"
                />
            </Suspense>
        </div>
    );
};

export default DashboardHybrid;
