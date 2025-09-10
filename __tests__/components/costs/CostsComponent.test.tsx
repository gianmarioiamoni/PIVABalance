import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Costs } from '@/components/Costs';

// Mock dependencies
jest.mock('@/hooks/costs/useCosts', () => ({
  useCosts: jest.fn(),
}));

jest.mock('@/hooks/costs/useCostForm', () => ({
  useCostForm: jest.fn(),
}));

jest.mock('@/components/costs/CostFormWrapper', () => ({
  CostFormWrapper: ({ onCancel }: { onCancel: () => void }) => (
    <div data-testid="cost-form-wrapper">
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

jest.mock('@/components/costs/CostList', () => ({
  CostList: () => <div data-testid="cost-list">Cost List</div>,
}));

jest.mock('@/components/costs/SummaryCard', () => ({
  SummaryCard: ({ title }: { title: string }) => (
    <div data-testid="summary-card">{title}</div>
  ),
}));

jest.mock('@/components/ui', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`}>{name}</span>,
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
}));

const mockUseCosts = require('@/hooks/costs/useCosts').useCosts;
const mockUseCostForm = require('@/hooks/costs/useCostForm').useCostForm;

describe('Costs Component', () => {
  let queryClient: QueryClient;
  const mockOpenForm = jest.fn();
  const mockCloseForm = jest.fn();
  const mockSubmitForm = jest.fn();
  const mockRefreshCosts = jest.fn();

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Mock useCosts hook
    mockUseCosts.mockReturnValue({
      costs: [],
      loading: false,
      error: null,
      refreshCosts: mockRefreshCosts,
      handleUpdateCost: jest.fn(),
      handleDeleteCost: jest.fn(),
    });

    // Mock useCostForm hook
    mockUseCostForm.mockReturnValue({
      showForm: false,
      openForm: mockOpenForm,
      closeForm: mockCloseForm,
      submitForm: mockSubmitForm,
      loading: false,
      error: null,
    });

    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <Costs />
      </QueryClientProvider>
    );
  };

  describe('Nuovo Costo Button', () => {
    it('should render "Nuovo Costo" button', () => {
      renderComponent();
      
      const newCostButton = screen.getByRole('button', { name: /nuovo costo/i });
      expect(newCostButton).toBeInTheDocument();
    });

    it('should call openForm when "Nuovo Costo" button is clicked', () => {
      renderComponent();
      
      const newCostButton = screen.getByRole('button', { name: /nuovo costo/i });
      fireEvent.click(newCostButton);
      
      expect(mockOpenForm).toHaveBeenCalledTimes(1);
    });

    it('should display form when showForm is true', () => {
      // Mock form as open
      mockUseCostForm.mockReturnValue({
        showForm: true,
        openForm: mockOpenForm,
        closeForm: mockCloseForm,
        submitForm: mockSubmitForm,
        loading: false,
        error: null,
      });

      renderComponent();
      
      expect(screen.getByTestId('cost-form-wrapper')).toBeInTheDocument();
    });

    it('should not display form when showForm is false', () => {
      renderComponent();
      
      expect(screen.queryByTestId('cost-form-wrapper')).not.toBeInTheDocument();
    });

    it('should have correct button styling and icon', () => {
      renderComponent();
      
      const newCostButton = screen.getByRole('button', { name: /nuovo costo/i });
      expect(newCostButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white');
      
      const plusIcon = screen.getByTestId('icon-PlusIcon');
      expect(plusIcon).toBeInTheDocument();
    });
  });

  describe('Form Integration', () => {
    it('should close form when cancel is clicked', async () => {
      // Mock form as open
      mockUseCostForm.mockReturnValue({
        showForm: true,
        openForm: mockOpenForm,
        closeForm: mockCloseForm,
        submitForm: mockSubmitForm,
        loading: false,
        error: null,
      });

      renderComponent();
      
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
      
      expect(mockCloseForm).toHaveBeenCalledTimes(1);
    });

    it('should pass correct props to CostFormWrapper', () => {
      mockUseCostForm.mockReturnValue({
        showForm: true,
        openForm: mockOpenForm,
        closeForm: mockCloseForm,
        submitForm: mockSubmitForm,
        loading: false,
        error: null,
      });

      renderComponent();
      
      expect(screen.getByTestId('cost-form-wrapper')).toBeInTheDocument();
    });
  });

  describe('Page Elements', () => {
    it('should render page title and description', () => {
      renderComponent();
      
      expect(screen.getByText('Gestione Costi')).toBeInTheDocument();
      expect(screen.getByText('Monitora e gestisci i tuoi costi aziendali')).toBeInTheDocument();
    });

    it('should render year selector', () => {
      renderComponent();
      
      const yearSelect = screen.getByRole('combobox');
      expect(yearSelect).toBeInTheDocument();
    });

    it('should render summary cards', () => {
      renderComponent();
      
      expect(screen.getByText('Costi Totali')).toBeInTheDocument();
      expect(screen.getByText('Costi Deducibili')).toBeInTheDocument();
      expect(screen.getByText('Costi Non Deducibili')).toBeInTheDocument();
    });

    it('should render cost list', () => {
      renderComponent();
      
      expect(screen.getByTestId('cost-list')).toBeInTheDocument();
    });
  });
});
