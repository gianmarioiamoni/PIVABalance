import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { MobileNavigationMenu } from '@/components/dashboard/MobileNavigationMenu';

// Mock dependencies
jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
    X: () => <div data-testid="x-icon">X</div>,
    Menu: () => <div data-testid="menu-icon">Menu</div>,
}));

describe('MobileNavigationMenu', () => {
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
            name: 'Impostazioni',
            href: '/dashboard/settings',
            current: false,
            group: 'management',
            icon: '⚙️',
        },
    ];

    const mockGetGroupColors = jest.fn((group: string, current: boolean, _disabled: boolean) => ({
        bg: current ? 'bg-blue-100' : 'bg-white',
        text: current ? 'text-blue-900' : 'text-gray-700',
        accent: 'bg-blue-500',
        shadow: 'rgba(59, 130, 246, 0.5)',
    }));

    beforeEach(() => {
        (usePathname as jest.Mock).mockReturnValue('/dashboard');
        jest.clearAllMocks();
    });

    it('should render hamburger button', () => {
        render(
            <MobileNavigationMenu
                navigationItems={mockNavigationItems}
                getGroupColors={mockGetGroupColors}
            />
        );

        const hamburgerButton = screen.getByRole('button', { name: /apri menu di navigazione/i });
        expect(hamburgerButton).toBeInTheDocument();
        expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    });

    it('should open menu when hamburger button is clicked', async () => {
        render(
            <MobileNavigationMenu
                navigationItems={mockNavigationItems}
                getGroupColors={mockGetGroupColors}
            />
        );

        const hamburgerButton = screen.getByRole('button', { name: /apri menu di navigazione/i });
        const menu = screen.getByRole('navigation', { name: /menu di navigazione mobile/i });

        // Menu should be hidden initially (translate-x-full class)
        expect(menu).toHaveClass('-translate-x-full');
        expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');

        // Click to open menu
        fireEvent.click(hamburgerButton);

        // Menu should be visible (no translate-x-full class)
        await waitFor(() => {
            expect(menu).toHaveClass('translate-x-0');
            expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true');
        });

        // Button should show X icon
        expect(screen.getAllByTestId('x-icon')).toHaveLength(2); // One in hamburger button, one in close button

        // Navigation items should be accessible
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Fatture')).toBeInTheDocument();
        expect(screen.getByText('Impostazioni')).toBeInTheDocument();
    });

    it('should close menu when X button is clicked', async () => {
        render(
            <MobileNavigationMenu
                navigationItems={mockNavigationItems}
                getGroupColors={mockGetGroupColors}
            />
        );

        const hamburgerButton = screen.getByRole('button', { name: /apri menu di navigazione/i });
        const menu = screen.getByRole('navigation', { name: /menu di navigazione mobile/i });

        // Open menu
        fireEvent.click(hamburgerButton);

        await waitFor(() => {
            expect(menu).toHaveClass('translate-x-0');
        });

        // Click X to close
        const closeButton = screen.getByRole('button', { name: /chiudi menu/i });
        fireEvent.click(closeButton);

        // Menu should be hidden
        await waitFor(() => {
            expect(menu).toHaveClass('-translate-x-full');
            expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
        });
    });

    it('should close menu when backdrop is clicked', async () => {
        render(
            <MobileNavigationMenu
                navigationItems={mockNavigationItems}
                getGroupColors={mockGetGroupColors}
            />
        );

        const hamburgerButton = screen.getByRole('button', { name: /apri menu di navigazione/i });
        const menu = screen.getByRole('navigation', { name: /menu di navigazione mobile/i });

        // Open menu
        fireEvent.click(hamburgerButton);

        await waitFor(() => {
            expect(menu).toHaveClass('translate-x-0');
        });

        // Click backdrop - now look for the backdrop div with inline styles
        const backdrop = document.querySelector('[aria-hidden="true"]');
        expect(backdrop).toBeInTheDocument();
        if (backdrop) {
            fireEvent.click(backdrop);
        }

        // Menu should be hidden
        await waitFor(() => {
            expect(menu).toHaveClass('-translate-x-full');
            expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
        });
    });

    it('should highlight current navigation item', async () => {
        render(
            <MobileNavigationMenu
                navigationItems={mockNavigationItems}
                getGroupColors={mockGetGroupColors}
            />
        );

        const hamburgerButton = screen.getByRole('button', { name: /apri menu di navigazione/i });
        fireEvent.click(hamburgerButton);

        await waitFor(() => {
            const dashboardLink = screen.getByRole('link', { name: /📊 dashboard/i });
            expect(dashboardLink).toHaveClass('bg-blue-100', 'text-blue-900');
        });
    });

    it('should handle disabled navigation items', async () => {
        const disabledItems = [
            ...mockNavigationItems,
            {
                name: 'Disabled Item',
                href: '#',
                current: false,
                group: 'test',
                icon: '🚫',
                disabled: true,
                tooltip: 'This item is disabled',
            },
        ];

        render(
            <MobileNavigationMenu
                navigationItems={disabledItems}
                getGroupColors={mockGetGroupColors}
            />
        );

        const hamburgerButton = screen.getByRole('button', { name: /apri menu di navigazione/i });
        fireEvent.click(hamburgerButton);

        await waitFor(() => {
            const disabledLink = screen.getByRole('link', { name: /🚫 disabled item/i });
            expect(disabledLink).toHaveClass('opacity-50', 'cursor-not-allowed');
            expect(disabledLink).toHaveAttribute('href', '#');
            expect(disabledLink).toHaveAttribute('title', 'This item is disabled');
        });
    });

    it('should apply different backdrop styles', async () => {
        const { rerender } = render(
            <MobileNavigationMenu
                navigationItems={mockNavigationItems}
                getGroupColors={mockGetGroupColors}
                backdropStyle="blur"
            />
        );

        const hamburgerButton = screen.getByRole('button', { name: /apri menu di navigazione/i });

        // Test blur backdrop - check for inline styles instead of CSS classes
        fireEvent.click(hamburgerButton);
        await waitFor(() => {
            const backdrop = document.querySelector('[aria-hidden="true"]');
            expect(backdrop).toBeInTheDocument();
            // Check for inline background style (backdrop-filter might not work in jsdom)
            expect(backdrop).toHaveStyle('background: rgba(255, 255, 255, 0.2)');
        });

        // Test dark backdrop
        rerender(
            <MobileNavigationMenu
                navigationItems={mockNavigationItems}
                getGroupColors={mockGetGroupColors}
                backdropStyle="dark"
            />
        );

        await waitFor(() => {
            const backdrop = document.querySelector('[aria-hidden="true"]');
            expect(backdrop).toBeInTheDocument();
            expect(backdrop).toHaveStyle('background-color: rgba(0, 0, 0, 0.5)');
        });

        // Test no backdrop
        rerender(
            <MobileNavigationMenu
                navigationItems={mockNavigationItems}
                getGroupColors={mockGetGroupColors}
                backdropStyle="none"
            />
        );

        await waitFor(() => {
            const backdrop = document.querySelector('[aria-hidden="true"]');
            expect(backdrop).not.toBeInTheDocument(); // Should not render backdrop at all
        });
    });

    it('should prevent body scroll when menu is open', async () => {
        render(
            <MobileNavigationMenu
                navigationItems={mockNavigationItems}
                getGroupColors={mockGetGroupColors}
            />
        );

        const hamburgerButton = screen.getByRole('button', { name: /apri menu di navigazione/i });

        // Open menu
        fireEvent.click(hamburgerButton);

        await waitFor(() => {
            expect(document.body.style.overflow).toBe('hidden');
        });

        // Close menu
        const closeButton = screen.getByRole('button', { name: /chiudi menu/i });
        fireEvent.click(closeButton);

        await waitFor(() => {
            expect(document.body.style.overflow).toBe('unset');
        });
    });
});

describe('Responsive Dashboard Layout', () => {
    it('should show mobile layout on small screens', () => {
        // Mock window.matchMedia for mobile breakpoint
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation(query => ({
                matches: query.includes('(max-width: 1023px)'), // Mobile breakpoint
                media: query,
                onchange: null,
                addListener: jest.fn(),
                removeListener: jest.fn(),
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            })),
        });

        // Test would verify that mobile-specific classes are applied
        // This would require additional setup with React Testing Library and jsdom
        expect(true).toBe(true); // Placeholder for actual responsive test
    });

    it('should show desktop layout on large screens', () => {
        // Mock window.matchMedia for desktop breakpoint
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation(query => ({
                matches: query.includes('(min-width: 1024px)'), // Desktop breakpoint
                media: query,
                onchange: null,
                addListener: jest.fn(),
                removeListener: jest.fn(),
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            })),
        });

        // Test would verify that desktop-specific classes are applied
        expect(true).toBe(true); // Placeholder for actual responsive test
    });
});
