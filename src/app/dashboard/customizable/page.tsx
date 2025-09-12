/**
 * Customizable Dashboard Page
 * 
 * SRP: Handles ONLY customizable dashboard page routing
 * New widget-based dashboard with full customization capabilities
 * Optimized with lazy loading for better performance
 */

'use client';

import { LazyCustomizableDashboard } from '@/components/common/LazyComponents';

export const dynamic = 'force-dynamic';

/**
 * Customizable Dashboard Page Component
 * 
 * SRP Responsibilities:
 * 1. Page routing and setup ONLY
 * 2. Dashboard configuration ONLY
 * 3. Performance optimization with lazy loading
 * 
 * NOT responsible for:
 * - Dashboard logic (delegated to LazyCustomizableDashboard)
 * - Widget management (delegated to widget system)
 * - Data fetching (delegated to hooks)
 */
export default function CustomizableDashboardPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <LazyCustomizableDashboard />
        </div>
    );
}
