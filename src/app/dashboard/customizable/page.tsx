/**
 * Customizable Dashboard Page
 * 
 * SRP: Handles ONLY customizable dashboard page routing
 * New widget-based dashboard with full customization capabilities
 */

'use client';

import { DashboardHybrid } from '@/components/dashboard/hybrid/DashboardHybrid';

export const dynamic = 'force-dynamic';

/**
 * Customizable Dashboard Page Component
 * 
 * SRP Responsibilities:
 * 1. Page routing and setup ONLY
 * 2. Dashboard configuration ONLY
 * 
 * NOT responsible for:
 * - Dashboard logic (delegated to DashboardHybrid)
 * - Widget management (delegated to widget system)
 * - Data fetching (delegated to hooks)
 */
export default function CustomizableDashboardPage() {
    return (
        <DashboardHybrid
            enableCustomization={true}
            className="min-h-screen bg-gray-50"
        />
    );
}
