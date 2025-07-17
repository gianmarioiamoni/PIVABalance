/**
 * Dashboard Components
 * Exports for dashboard-related components following client/server separation
 */

// Main components
export { Dashboard } from './Dashboard';           // Client container
export { DashboardView } from './DashboardView';   // Server presentational

// Sub-components  
export { StatCard } from './StatCard';             // Server component
export { QuickActions } from './QuickActions';     // Client component
export { RecentActivities } from './RecentActivities'; // Server component 