/**
 * Advanced Analytics Page
 * 
 * SRP: Handles ONLY analytics page orchestration
 * Advanced business analytics dashboard with KPIs and reporting
 * Protected from super admin access - business functionality only
 */

import React from 'react';
import { Metadata } from 'next';
import { AdvancedAnalyticsView } from './AdvancedAnalyticsView';
import { RoleBasedAccess } from '@/components/auth/RoleBasedAccess';

export const metadata: Metadata = {
    title: 'Analytics Avanzate | P.IVA Balance',
    description: 'Dashboard analytics avanzate con KPI, insights e report generation per freelancer',
    keywords: ['analytics', 'KPI', 'business intelligence', 'report', 'freelancer'],
};

/**
 * Advanced Analytics Page (Server Component)
 * 
 * SRP Responsibilities:
 * 1. Analytics page routing ONLY
 * 2. Metadata management ONLY
 * 3. View component orchestration ONLY
 * 
 * NOT responsible for:
 * - Analytics logic (delegated to AdvancedAnalyticsView)
 * - Data fetching (delegated to client components)
 * - User interactions (delegated to client components)
 */
export default function AdvancedAnalyticsPage() {
    return (
        <RoleBasedAccess allowedRoles={['user', 'admin']} redirectSuperAdminTo="/dashboard/admin">
            <AdvancedAnalyticsView />
        </RoleBasedAccess>
    );
}
