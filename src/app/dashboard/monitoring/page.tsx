/**
 * Monitoring Dashboard Page
 * SRP: Production monitoring and optimization dashboard ONLY
 * PROTECTED: Admin access only
 */

import React from 'react';
import { AdminProtection } from '@/components/auth/AdminProtection';
import { MonitoringDashboardView } from './MonitoringDashboardView';

export default function MonitoringPage() {
    return (
        <AdminProtection requiredRole="admin">
            <MonitoringDashboardView />
        </AdminProtection>
    );
}
