import { render, screen, fireEvent } from '@testing-library/react';
import { AdvancedAnalyticsView } from '../AdvancedAnalyticsView';

// Mock dependencies
jest.mock('@/hooks/auth/useAuth', () => ({
    useAuth: jest.fn(() => ({
        user: { id: 'test-user-id', name: 'Test User' }
    }))
}));

jest.mock('@/components/analytics/BusinessAnalytics', () => ({
    BusinessAnalytics: () => <div data-testid="business-analytics">Business Analytics</div>
}));

jest.mock('@/components/reports/ReportGenerator', () => ({
    ReportGenerator: () => <div data-testid="report-generator">Report Generator</div>
}));

jest.mock('@/components/charts/advanced/HeatmapChart', () => ({
    HeatmapChart: () => <div data-testid="heatmap-chart">Heatmap Chart</div>
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
    Brain: () => <div data-testid="brain-icon">Brain</div>,
    BarChart3: () => <div data-testid="barchart-icon">BarChart</div>,
    FileText: () => <div data-testid="filetext-icon">FileText</div>,
    Zap: () => <div data-testid="zap-icon">Zap</div>,
}));

describe('AdvancedAnalyticsView', () => {
    beforeEach(() => {
        // Reset window size
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024,
        });
    });

    it('should render analytics tabs', () => {
        render(<AdvancedAnalyticsView />);

        // Check that both desktop and mobile navigation exist
        const desktopNav = document.querySelector('.hidden.md\\:flex');
        const mobileNav = document.querySelector('.md\\:hidden.overflow-x-auto');

        expect(desktopNav).toBeInTheDocument();
        expect(mobileNav).toBeInTheDocument();

        // Check that we have the correct number of tab buttons (4 desktop + 4 mobile = 8 total)
        const allTabButtons = screen.getAllByRole('button');
        const tabButtons = allTabButtons.filter(button =>
            button.textContent?.includes('Panoramica') ||
            button.textContent?.includes('KPI Dashboard') ||
            button.textContent?.includes('Report Generator') ||
            button.textContent?.includes('Heatmap Analisi') ||
            button.textContent?.includes('KPI') ||
            button.textContent?.includes('Report') ||
            button.textContent?.includes('Heatmap')
        );
        expect(tabButtons.length).toBeGreaterThanOrEqual(7); // At least 7 tab buttons (some abbreviated)
    });

    it('should show desktop navigation on large screens', () => {
        render(<AdvancedAnalyticsView />);

        // Desktop navigation should be visible
        const desktopNav = document.querySelector('.hidden.md\\:flex');
        expect(desktopNav).toBeInTheDocument();

        // Mobile navigation should be hidden
        const mobileNav = document.querySelector('.md\\:hidden');
        expect(mobileNav).toBeInTheDocument();
    });

    it('should switch between tabs correctly', () => {
        render(<AdvancedAnalyticsView />);

        // Get desktop tabs (first set)
        const overviewTabs = screen.getAllByRole('button', { name: /panoramica/i });
        const desktopOverviewTab = overviewTabs[0]; // Desktop version
        expect(desktopOverviewTab).toHaveClass('border-blue-500', 'text-blue-600');

        // Click on KPI Dashboard tab (desktop version)
        const kpiTabs = screen.getAllByRole('button', { name: /kpi dashboard/i });
        const desktopKpiTab = kpiTabs[0]; // Desktop version
        fireEvent.click(desktopKpiTab);

        // KPI tab should now be active
        expect(desktopKpiTab).toHaveClass('border-blue-500', 'text-blue-600');
        expect(desktopOverviewTab).not.toHaveClass('border-blue-500', 'text-blue-600');
    });

    it('should render mobile-friendly tabs with proper styling', () => {
        render(<AdvancedAnalyticsView />);

        // Check mobile navigation exists
        const mobileNav = document.querySelector('.md\\:hidden.overflow-x-auto.scrollbar-hide');
        expect(mobileNav).toBeInTheDocument();

        // Check mobile tabs have proper classes including uniform sizing
        const mobileTabsContainer = document.querySelector('.flex.space-x-1.min-w-max');
        expect(mobileTabsContainer).toBeInTheDocument();

        // Check that tabs have uniform sizing classes
        const uniformTabs = document.querySelectorAll('.analytics-tab-uniform');
        expect(uniformTabs.length).toBeGreaterThan(0);
    });

    it('should have proper accessibility attributes', () => {
        render(<AdvancedAnalyticsView />);

        // Check ARIA labels
        const navElements = screen.getAllByRole('navigation', { name: /tabs/i });
        expect(navElements).toHaveLength(2); // Desktop and mobile navigation

        // Check all tabs are buttons
        const tabButtons = screen.getAllByRole('button');
        expect(tabButtons.length).toBeGreaterThanOrEqual(8); // 4 tabs x 2 (desktop + mobile)
    });

    it('should render tab content correctly', () => {
        render(<AdvancedAnalyticsView />);

        // Default content should be overview
        // Since we're mocking the components, we need to check the actual implementation
        // The overview tab should render AnalyticsOverview component

        // Switch to KPI tab
        const kpiTabs = screen.getAllByRole('button', { name: /kpi dashboard/i });
        const desktopKpiTab = kpiTabs[0]; // Desktop version
        fireEvent.click(desktopKpiTab);

        // Should render BusinessAnalytics component
        expect(screen.getByTestId('business-analytics')).toBeInTheDocument();

        // Switch to Reports tab
        const reportsTabs = screen.getAllByRole('button', { name: /report generator/i });
        const desktopReportsTab = reportsTabs[0]; // Desktop version
        fireEvent.click(desktopReportsTab);

        // Should render ReportGenerator component
        expect(screen.getByTestId('report-generator')).toBeInTheDocument();
    });

    it('should have responsive design classes', () => {
        render(<AdvancedAnalyticsView />);

        // Check that mobile tabs have uniform sizing
        const uniformTabs = document.querySelectorAll('.analytics-tab-uniform');
        expect(uniformTabs.length).toBeGreaterThan(0);

        // Check that tabs have consistent styling and dimensions
        uniformTabs.forEach(tab => {
            expect(tab).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');
            // Check that each tab has inline styles for consistent sizing
            expect(tab).toHaveStyle('min-width: 64px');
            expect(tab).toHaveStyle('max-width: 64px');
            expect(tab).toHaveStyle('height: 56px');
        });

        // Check that abbreviated text is used for mobile (only mobile has abbreviated text)
        expect(screen.getByText('KPI')).toBeInTheDocument(); // Mobile abbreviated version
        expect(screen.getByText('Report')).toBeInTheDocument(); // Mobile abbreviated version
        expect(screen.getByText('Heatmap')).toBeInTheDocument(); // Mobile abbreviated version

        // Desktop should still have full text (check within nav buttons)
        const desktopNavButtons = document.querySelectorAll('.hidden.md\\:flex button');
        expect(desktopNavButtons).toHaveLength(4);

        // Check that desktop buttons contain full text
        const desktopTexts = Array.from(desktopNavButtons).map(btn => btn.textContent);
        expect(desktopTexts).toContain('BrainPanoramica');
        expect(desktopTexts.some(text => text?.includes('KPI Dashboard'))).toBe(true);
        expect(desktopTexts.some(text => text?.includes('Report Generator'))).toBe(true);
        expect(desktopTexts.some(text => text?.includes('Heatmap Analisi'))).toBe(true);
    });
});
