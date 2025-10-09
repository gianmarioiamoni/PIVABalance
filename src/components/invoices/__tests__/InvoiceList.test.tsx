import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InvoiceList } from '../InvoiceList';
import { PlainInvoice } from '@/hooks/invoices/useInvoices';

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
    Trash2: ({ className, ...props }: any) => <div data-testid="trash-icon" className={className} {...props} />,
    Calendar: ({ className, ...props }: any) => <div data-testid="calendar-icon" className={className} {...props} />,
    Euro: ({ className, ...props }: any) => <div data-testid="euro-icon" className={className} {...props} />,
    User: ({ className, ...props }: any) => <div data-testid="user-icon" className={className} {...props} />,
    FileText: ({ className, ...props }: any) => <div data-testid="filetext-icon" className={className} {...props} />,
    Hash: ({ className, ...props }: any) => <div data-testid="hash-icon" className={className} {...props} />,
}));

// Mock LoadingSpinner
jest.mock('@/components/ui', () => ({
    LoadingSpinner: ({ size }: { size?: string }) => <div data-testid="loading-spinner" data-size={size} />,
}));

const mockInvoices: PlainInvoice[] = [
    {
        id: '1',
        number: '2025-01',
        issueDate: new Date('2025-01-15'),
        clientName: 'SpaceEnt',
        title: 'Consulenza sviluppo app',
        amount: 2500,
        vat: { vatRate: 22 },
        paymentDate: new Date('2025-02-15'),
    },
    {
        id: '2',
        number: '2025-02',
        issueDate: new Date('2025-01-20'),
        clientName: 'TechCorp Ltd',
        title: 'Progetto e-commerce',
        amount: 3500,
        vat: { vatRate: 22 },
        paymentDate: null,
    },
];

describe('InvoiceList', () => {
    const mockOnUpdatePaymentDate = jest.fn();
    const mockOnDeleteClick = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        // Reset window size after each test
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024,
        });
    });

    it('renders loading state correctly', () => {
        render(
            <InvoiceList
                invoices={[]}
                onUpdatePaymentDate={mockOnUpdatePaymentDate}
                onDeleteClick={mockOnDeleteClick}
                isLoading={true}
            />
        );

        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('renders empty state correctly', () => {
        render(
            <InvoiceList
                invoices={[]}
                onUpdatePaymentDate={mockOnUpdatePaymentDate}
                onDeleteClick={mockOnDeleteClick}
                isLoading={false}
            />
        );

        expect(screen.getByText('Nessuna fattura')).toBeInTheDocument();
        expect(screen.getByText('Inizia creando la tua prima fattura per questo anno.')).toBeInTheDocument();
        expect(screen.getByTestId('filetext-icon')).toBeInTheDocument();
    });

    it('renders desktop table view on large screens', () => {
        // Mock large screen
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024,
        });

        render(
            <InvoiceList
                invoices={mockInvoices}
                onUpdatePaymentDate={mockOnUpdatePaymentDate}
                onDeleteClick={mockOnDeleteClick}
                isLoading={false}
            />
        );

        // Check for desktop table headers
        expect(screen.getByText('Numero')).toBeInTheDocument();
        expect(screen.getByText('Data')).toBeInTheDocument();
        expect(screen.getByText('Cliente')).toBeInTheDocument();
        expect(screen.getByText('Importo')).toBeInTheDocument();
        expect(screen.getByText('Pagamento')).toBeInTheDocument();

        // Check for table structure
        const table = document.querySelector('table');
        expect(table).toBeInTheDocument();

        // Check for desktop table visibility
        const desktopView = document.querySelector('.hidden.md\\:block');
        expect(desktopView).toBeInTheDocument();
    });

    it('renders mobile card view on small screens', () => {
        // Mock small screen
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 375,
        });

        render(
            <InvoiceList
                invoices={mockInvoices}
                onUpdatePaymentDate={mockOnUpdatePaymentDate}
                onDeleteClick={mockOnDeleteClick}
                isLoading={false}
            />
        );

        // Check for mobile card view
        const mobileView = document.querySelector('.md\\:hidden');
        expect(mobileView).toBeInTheDocument();

        // Check that invoice data is rendered in cards (using getAllByText since both views are present)
        expect(screen.getAllByText('2025-01')).toHaveLength(2); // Desktop table + mobile card
        expect(screen.getAllByText('SpaceEnt')).toHaveLength(2);
        expect(screen.getAllByText('2.500,00 €')).toHaveLength(2);
    });

    it('handles payment date updates correctly', async () => {
        const mockPromise = Promise.resolve();
        mockOnUpdatePaymentDate.mockReturnValue(mockPromise);

        render(
            <InvoiceList
                invoices={mockInvoices}
                onUpdatePaymentDate={mockOnUpdatePaymentDate}
                onDeleteClick={mockOnDeleteClick}
                isLoading={false}
            />
        );

        // Find date input for first invoice (desktop view)
        const dateInputs = screen.getAllByLabelText(/Data pagamento per fattura/);
        const firstDateInput = dateInputs[0];

        // Change the date
        fireEvent.change(firstDateInput, { target: { value: '2025-03-01' } });

        await waitFor(() => {
            expect(mockOnUpdatePaymentDate).toHaveBeenCalledWith('1', new Date('2025-03-01'));
        });
    });

    it('handles delete click correctly', () => {
        render(
            <InvoiceList
                invoices={mockInvoices}
                onUpdatePaymentDate={mockOnUpdatePaymentDate}
                onDeleteClick={mockOnDeleteClick}
                isLoading={false}
            />
        );

        // Find delete buttons
        const deleteButtons = screen.getAllByLabelText(/Elimina fattura/);
        const firstDeleteButton = deleteButtons[0];

        fireEvent.click(firstDeleteButton);

        expect(mockOnDeleteClick).toHaveBeenCalledWith('1');
    });

    it('shows loading spinner during payment date update', async () => {
        const mockPromise = new Promise((resolve) => setTimeout(resolve, 100));
        mockOnUpdatePaymentDate.mockReturnValue(mockPromise);

        render(
            <InvoiceList
                invoices={mockInvoices}
                onUpdatePaymentDate={mockOnUpdatePaymentDate}
                onDeleteClick={mockOnDeleteClick}
                isLoading={false}
            />
        );

        // Find date input for first invoice
        const dateInputs = screen.getAllByLabelText(/Data pagamento per fattura/);
        const firstDateInput = dateInputs[0];

        // Change the date
        fireEvent.change(firstDateInput, { target: { value: '2025-03-01' } });

        // Check for loading spinner (should appear briefly)
        await waitFor(() => {
            const loadingSpinners = screen.getAllByTestId('loading-spinner');
            expect(loadingSpinners.length).toBeGreaterThan(0);
        });

        // Wait for promise to resolve
        await mockPromise;
    });

    it('formats currency correctly', () => {
        render(
            <InvoiceList
                invoices={mockInvoices}
                onUpdatePaymentDate={mockOnUpdatePaymentDate}
                onDeleteClick={mockOnDeleteClick}
                isLoading={false}
            />
        );

        // Check for Italian currency formatting (both desktop and mobile views)
        expect(screen.getAllByText('2.500,00 €')).toHaveLength(2); // Desktop + mobile
        expect(screen.getAllByText('3.500,00 €')).toHaveLength(2); // Desktop + mobile
    });

    it('formats dates correctly', () => {
        render(
            <InvoiceList
                invoices={mockInvoices}
                onUpdatePaymentDate={mockOnUpdatePaymentDate}
                onDeleteClick={mockOnDeleteClick}
                isLoading={false}
            />
        );

        // Check for Italian date formatting (both desktop and mobile views)
        expect(screen.getAllByText('15/01/2025')).toHaveLength(2); // Desktop + mobile
        expect(screen.getAllByText('20/01/2025')).toHaveLength(2); // Desktop + mobile
    });

    it('shows VAT information when available', () => {
        render(
            <InvoiceList
                invoices={mockInvoices}
                onUpdatePaymentDate={mockOnUpdatePaymentDate}
                onDeleteClick={mockOnDeleteClick}
                isLoading={false}
            />
        );

        // Check for VAT display in mobile cards (look for the pattern)
        expect(screen.getAllByText('IVA:')).toHaveLength(2); // Both mobile cards
        expect(screen.getAllByText('22%')).toHaveLength(4); // 2 desktop table cells + 2 mobile cards
    });

    it('handles invoices without payment dates', () => {
        render(
            <InvoiceList
                invoices={mockInvoices}
                onUpdatePaymentDate={mockOnUpdatePaymentDate}
                onDeleteClick={mockOnDeleteClick}
                isLoading={false}
            />
        );

        // Find date inputs
        const dateInputs = screen.getAllByLabelText(/Data pagamento per fattura/);

        // Second invoice should have empty payment date
        const secondDateInput = dateInputs[1] as HTMLInputElement;
        expect(secondDateInput.value).toBe('');
    });

    it('shows proper accessibility labels', () => {
        render(
            <InvoiceList
                invoices={mockInvoices}
                onUpdatePaymentDate={mockOnUpdatePaymentDate}
                onDeleteClick={mockOnDeleteClick}
                isLoading={false}
            />
        );

        // Check for accessibility labels (now we have both desktop and mobile versions)
        expect(screen.getAllByLabelText('Data pagamento per fattura 2025-01')).toHaveLength(2);
        expect(screen.getAllByLabelText('Data pagamento per fattura 2025-02')).toHaveLength(2);
        expect(screen.getAllByLabelText('Elimina fattura 2025-01')).toHaveLength(2);
        expect(screen.getAllByLabelText('Elimina fattura 2025-02')).toHaveLength(2);
    });
});
