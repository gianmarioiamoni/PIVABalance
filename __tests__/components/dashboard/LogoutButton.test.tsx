import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { LogoutButton } from '@/components/dashboard/LogoutButton';
import { useAuth } from '@/hooks/auth/useAuth';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/auth/useAuth', () => ({
  useAuth: jest.fn(),
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('LogoutButton', () => {
  let queryClient: QueryClient;
  const mockPush = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    } as any);

    mockUseAuth.mockReturnValue({
      user: { id: '1', name: 'Test User', email: 'test@example.com' },
      logout: mockLogout,
      isLoading: false,
      isAuthenticated: true,
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <LogoutButton {...props} />
      </QueryClientProvider>
    );
  };

  describe('Rendering', () => {
    it('should render logout button with correct text', () => {
      renderComponent();
      
      const button = screen.getByRole('button', { name: /logout|esci/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Logout');
    });

    it('should render placeholder when user is null', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        logout: mockLogout,
        isLoading: false,
        isAuthenticated: false,
      } as any);

      renderComponent();
      
      const placeholder = screen.getByText('Logout');
      expect(placeholder).toBeInTheDocument();
      expect(placeholder.parentElement).toHaveStyle({ opacity: '0.5' });
    });

    it('should render with custom className when provided', () => {
      renderComponent({ className: 'custom-class' });
      
      const button = screen.getByRole('button', { name: /logout|esci/i });
      expect(button).toHaveClass('custom-class');
    });

    it('should be disabled when loading', () => {
      mockUseAuth.mockReturnValue({
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        logout: mockLogout,
        isLoading: true,
        isAuthenticated: true,
      } as any);

      renderComponent();
      
      const button = screen.getByRole('button', { name: /logout|esci/i });
      expect(button).toBeDisabled();
    });
  });

  describe('Functionality', () => {
    it('should call logout function when clicked', async () => {
      mockLogout.mockResolvedValue(undefined);
      renderComponent();
      
      const button = screen.getByRole('button', { name: /logout|esci/i });
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalledTimes(1);
      });
    });

    it('should show loading state during logout process', async () => {
      let resolveLogout: () => void;
      const logoutPromise = new Promise<void>((resolve) => {
        resolveLogout = resolve;
      });
      mockLogout.mockReturnValue(logoutPromise);

      renderComponent();
      
      const button = screen.getByRole('button', { name: /logout|esci/i });
      fireEvent.click(button);

      // Button should be disabled during logout
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent('Logout...');

      // Resolve the logout
      resolveLogout!();
      await waitFor(() => {
        expect(button).not.toBeDisabled();
        expect(button).toHaveTextContent('Logout');
      });
    });

    it('should handle logout error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockLogout.mockRejectedValue(new Error('Logout failed'));

      renderComponent();
      
      const button = screen.getByRole('button', { name: /logout|esci/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Logout error:', expect.any(Error));
      });

      // Button should be re-enabled after error
      expect(button).not.toBeDisabled();
      expect(button).toHaveTextContent('Logout');

      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label', () => {
      renderComponent();
      
      const button = screen.getByRole('button', { name: /logout|esci/i });
      expect(button).toHaveAttribute('aria-label', 'Esci dal sistema');
    });

    it('should be keyboard accessible', () => {
      renderComponent();
      
      const button = screen.getByRole('button', { name: /logout|esci/i });
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Integration', () => {
    it('should work with different button variants', () => {
      renderComponent({ variant: 'outline' });
      
      const button = screen.getByRole('button', { name: /logout|esci/i });
      expect(button).toBeInTheDocument();
    });

    it('should work with different sizes', () => {
      renderComponent({ size: 'sm' });
      
      const button = screen.getByRole('button', { name: /logout|esci/i });
      expect(button).toBeInTheDocument();
    });
  });
});
