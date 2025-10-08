import { render, screen, fireEvent } from '@testing-library/react';
import { AccountManagement } from '../AccountManagement';

// Mock the child components
jest.mock('../ProfileSection', () => ({
    ProfileSection: () => <div data-testid="profile-section">Profile Section</div>
}));

jest.mock('../PasswordSection', () => ({
    PasswordSection: () => <div data-testid="password-section">Password Section</div>
}));

jest.mock('../DangerZone', () => ({
    DangerZone: () => <div data-testid="danger-zone">Danger Zone</div>
}));

jest.mock('../PrivacyRights', () => ({
    PrivacyRights: () => <div data-testid="privacy-rights">Privacy Rights</div>
}));

jest.mock('@/components/cookies', () => ({
    CookieSettings: () => <div data-testid="cookie-settings">Cookie Settings</div>
}));

// Mock Heroicons
jest.mock('@heroicons/react/24/outline', () => ({
    UserIcon: () => <div data-testid="user-icon">User</div>,
    KeyIcon: () => <div data-testid="key-icon">Key</div>,
    ExclamationTriangleIcon: () => <div data-testid="warning-icon">Warning</div>,
    ShieldCheckIcon: () => <div data-testid="shield-icon">Shield</div>,
    DocumentTextIcon: () => <div data-testid="document-icon">Document</div>,
}));

describe('AccountManagement', () => {
    beforeEach(() => {
        // Reset window size
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024,
        });
    });

    it('should render account management sections', () => {
        render(<AccountManagement />);

        // Check that both desktop and mobile navigation exist
        const desktopNav = document.querySelector('.hidden.md\\:flex');
        const mobileNav = document.querySelector('.md\\:hidden.overflow-x-auto');

        expect(desktopNav).toBeInTheDocument();
        expect(mobileNav).toBeInTheDocument();

        // Check that we have the correct number of section buttons
        const allSectionButtons = screen.getAllByRole('button');
        const sectionButtons = allSectionButtons.filter(button =>
            button.textContent?.includes('Profilo') ||
            button.textContent?.includes('Sicurezza') ||
            button.textContent?.includes('Privacy') ||
            button.textContent?.includes('Diritti') ||
            button.textContent?.includes('Pericolo')
        );
        expect(sectionButtons.length).toBeGreaterThanOrEqual(5); // At least 5 section buttons
    });

    it('should show desktop navigation on large screens', () => {
        render(<AccountManagement />);

        // Desktop navigation should be visible
        const desktopNav = document.querySelector('.hidden.md\\:flex');
        expect(desktopNav).toBeInTheDocument();

        // Mobile navigation should be hidden
        const mobileNav = document.querySelector('.md\\:hidden');
        expect(mobileNav).toBeInTheDocument();
    });

    it('should switch between sections correctly', () => {
        render(<AccountManagement />);

        // Initially should show profile (default)
        expect(screen.getByTestId('profile-section')).toBeInTheDocument();

        // Get desktop tabs (first set)
        const securityTabs = screen.getAllByRole('button').filter(btn =>
            btn.textContent?.includes('Sicurezza')
        );
        const desktopSecurityTab = securityTabs[0]; // Desktop version
        fireEvent.click(desktopSecurityTab);

        // Security section should now be active
        expect(screen.getByTestId('password-section')).toBeInTheDocument();
    });

    it('should render mobile-friendly tabs with uniform styling', () => {
        render(<AccountManagement />);

        // Check mobile navigation exists
        const mobileNav = document.querySelector('.md\\:hidden.overflow-x-auto.scrollbar-hide');
        expect(mobileNav).toBeInTheDocument();

        // Check mobile tabs have uniform sizing classes
        const uniformTabs = document.querySelectorAll('.account-tab-uniform');
        expect(uniformTabs.length).toBeGreaterThan(0);

        // Check mobile tabs container has proper classes
        const mobileTabsContainer = document.querySelector('.flex.space-x-1.min-w-max');
        expect(mobileTabsContainer).toBeInTheDocument();
    });

    it('should have proper accessibility attributes', () => {
        render(<AccountManagement />);

        // Check ARIA labels
        const navElements = screen.getAllByRole('navigation');
        expect(navElements.length).toBeGreaterThanOrEqual(1);

        // Check all sections are buttons
        const sectionButtons = screen.getAllByRole('button');
        expect(sectionButtons.length).toBeGreaterThanOrEqual(10); // 5 sections x 2 (desktop + mobile)
    });

    it('should render all section content correctly', () => {
        render(<AccountManagement />);

        // Test Profile section (default)
        expect(screen.getByTestId('profile-section')).toBeInTheDocument();

        // Switch to Security section
        const securityTabs = screen.getAllByRole('button').filter(btn =>
            btn.textContent?.includes('Sicurezza')
        );
        fireEvent.click(securityTabs[0]);
        expect(screen.getByTestId('password-section')).toBeInTheDocument();

        // Switch to Privacy section
        const privacyTabs = screen.getAllByRole('button').filter(btn =>
            btn.textContent?.includes('Privacy')
        );
        fireEvent.click(privacyTabs[0]);
        expect(screen.getByTestId('cookie-settings')).toBeInTheDocument();

        // Switch to Rights section
        const rightsTabs = screen.getAllByRole('button').filter(btn =>
            btn.textContent?.includes('Diritti')
        );
        fireEvent.click(rightsTabs[0]);
        expect(screen.getByTestId('privacy-rights')).toBeInTheDocument();

        // Switch to Danger section
        const dangerTabs = screen.getAllByRole('button').filter(btn =>
            btn.textContent?.includes('Pericolo')
        );
        fireEvent.click(dangerTabs[0]);
        expect(screen.getByTestId('danger-zone')).toBeInTheDocument();
    });

    it('should have responsive design classes with uniform dimensions', () => {
        render(<AccountManagement />);

        // Check that mobile tabs have uniform sizing
        const uniformTabs = document.querySelectorAll('.account-tab-uniform');
        expect(uniformTabs.length).toBeGreaterThan(0);

        // Check that tabs have consistent styling and dimensions
        uniformTabs.forEach(tab => {
            expect(tab).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');
            // Check that each tab has inline styles for ultra-compact sizing
            expect(tab).toHaveStyle('min-width: 48px');
            expect(tab).toHaveStyle('max-width: 48px');
            expect(tab).toHaveStyle('height: 48px');
        });

        // Check that abbreviated text is used for mobile (check specific elements)
        const mobileTabs = document.querySelectorAll('.account-tab-uniform');
        expect(mobileTabs.length).toBe(5);

        // Check that mobile tabs contain the expected abbreviated text
        const mobileTabTexts = Array.from(mobileTabs).map(tab => tab.textContent);
        expect(mobileTabTexts.some(text => text?.includes('Profilo'))).toBe(true);
        expect(mobileTabTexts.some(text => text?.includes('Sicurezza'))).toBe(true);
        expect(mobileTabTexts.some(text => text?.includes('Privacy'))).toBe(true);
        expect(mobileTabTexts.some(text => text?.includes('Diritti'))).toBe(true);
        expect(mobileTabTexts.some(text => text?.includes('Pericolo'))).toBe(true);
    });

    it('should maintain active section styling', () => {
        render(<AccountManagement />);

        // Profile should be active by default
        const profileTabs = screen.getAllByRole('button').filter(btn =>
            btn.textContent?.includes('Profilo')
        );
        const desktopProfileTab = profileTabs[0];

        // Check active styling (should have color classes)
        expect(desktopProfileTab).toHaveClass('text-blue-600');

        // Switch to security and check styling
        const securityTabs = screen.getAllByRole('button').filter(btn =>
            btn.textContent?.includes('Sicurezza')
        );
        fireEvent.click(securityTabs[0]);

        const desktopSecurityTab = securityTabs[0];
        expect(desktopSecurityTab).toHaveClass('text-green-600');
    });
});
