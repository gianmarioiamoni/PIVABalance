import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InvoiceHeader } from '../InvoiceHeader';

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
    PlusIcon: ({ className, ...props }: any) => <div data-testid="plus-icon" className={className} {...props} />,
}));

describe('InvoiceHeader', () => {
    const mockOnYearChange = jest.fn();
    const mockOnNewInvoiceClick = jest.fn();
    const availableYears = [2020, 2021, 2022, 2023, 2024, 2025];

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

    it('renders header with title correctly', () => {
        render(
            <InvoiceHeader
                selectedYear={2025}
                availableYears={availableYears}
                onYearChange={mockOnYearChange}
                onNewInvoiceClick={mockOnNewInvoiceClick}
                totalInvoices={0}
            />
        );

        expect(screen.getByText('Fatture')).toBeInTheDocument();
        expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
    });

    it('shows invoice count when totalInvoices > 0', () => {
        render(
            <InvoiceHeader
                selectedYear={2025}
                availableYears={availableYears}
                onYearChange={mockOnYearChange}
                onNewInvoiceClick={mockOnNewInvoiceClick}
                totalInvoices={5}
            />
        );

        expect(screen.getByText('5 fatture per il 2025')).toBeInTheDocument();
    });

    it('shows singular form for single invoice', () => {
        render(
            <InvoiceHeader
                selectedYear={2025}
                availableYears={availableYears}
                onYearChange={mockOnYearChange}
                onNewInvoiceClick={mockOnNewInvoiceClick}
                totalInvoices={1}
            />
        );

        expect(screen.getByText('1 fattura per il 2025')).toBeInTheDocument();
    });

    it('does not show invoice count when totalInvoices is 0', () => {
        render(
            <InvoiceHeader
                selectedYear={2025}
                availableYears={availableYears}
                onYearChange={mockOnYearChange}
                onNewInvoiceClick={mockOnNewInvoiceClick}
                totalInvoices={0}
            />
        );

        expect(screen.queryByText(/fatture per il/)).not.toBeInTheDocument();
    });

    it('renders year selector with all available years', () => {
        render(
            <InvoiceHeader
                selectedYear={2025}
                availableYears={availableYears}
                onYearChange={mockOnYearChange}
                onNewInvoiceClick={mockOnNewInvoiceClick}
                totalInvoices={0}
            />
        );

        const yearSelector = screen.getByLabelText('Seleziona anno') as HTMLSelectElement;
        expect(yearSelector).toBeInTheDocument();
        expect(yearSelector.value).toBe('2025');

        // Check all years are present as options
        availableYears.forEach(year => {
            expect(screen.getByText(year.toString())).toBeInTheDocument();
        });
    });

    it('calls onYearChange when year is selected', () => {
        render(
            <InvoiceHeader
                selectedYear={2025}
                availableYears={availableYears}
                onYearChange={mockOnYearChange}
                onNewInvoiceClick={mockOnNewInvoiceClick}
                totalInvoices={0}
            />
        );

        const yearSelector = screen.getByLabelText('Seleziona anno');
        fireEvent.change(yearSelector, { target: { value: '2024' } });

        expect(mockOnYearChange).toHaveBeenCalledWith(2024);
    });

    it('calls onNewInvoiceClick when new invoice button is clicked', () => {
        render(
            <InvoiceHeader
                selectedYear={2025}
                availableYears={availableYears}
                onYearChange={mockOnYearChange}
                onNewInvoiceClick={mockOnNewInvoiceClick}
                totalInvoices={0}
            />
        );

        const newInvoiceButton = screen.getByLabelText('Crea nuova fattura');
        fireEvent.click(newInvoiceButton);

        expect(mockOnNewInvoiceClick).toHaveBeenCalledTimes(1);
    });

    it('renders new invoice button with responsive text', () => {
        render(
            <InvoiceHeader
                selectedYear={2025}
                availableYears={availableYears}
                onYearChange={mockOnYearChange}
                onNewInvoiceClick={mockOnNewInvoiceClick}
                totalInvoices={0}
            />
        );

        // Check for both text variants (hidden/visible based on screen size)
        expect(screen.getByText('Nuova Fattura')).toBeInTheDocument();
        expect(screen.getByText('Nuova')).toBeInTheDocument();
    });

    it('has proper accessibility attributes', () => {
        render(
            <InvoiceHeader
                selectedYear={2025}
                availableYears={availableYears}
                onYearChange={mockOnYearChange}
                onNewInvoiceClick={mockOnNewInvoiceClick}
                totalInvoices={0}
            />
        );

        expect(screen.getByLabelText('Seleziona anno')).toBeInTheDocument();
        expect(screen.getByLabelText('Crea nuova fattura')).toBeInTheDocument();
    });

    it('applies responsive layout classes correctly', () => {
        render(
            <InvoiceHeader
                selectedYear={2025}
                availableYears={availableYears}
                onYearChange={mockOnYearChange}
                onNewInvoiceClick={mockOnNewInvoiceClick}
                totalInvoices={0}
            />
        );

        // Check for responsive button layout
        const buttonContainer = document.querySelector('.flex.flex-row.items-center.gap-2');
        expect(buttonContainer).toBeInTheDocument();

        // Check for invoice-add-button class
        const addButton = document.querySelector('.invoice-add-button');
        expect(addButton).toBeInTheDocument();
    });

    it('applies compact styling on mobile', () => {
        render(
            <InvoiceHeader
                selectedYear={2025}
                availableYears={availableYears}
                onYearChange={mockOnYearChange}
                onNewInvoiceClick={mockOnNewInvoiceClick}
                totalInvoices={0}
            />
        );

        // Check that year selector has responsive padding
        const yearSelector = screen.getByLabelText('Seleziona anno');
        expect(yearSelector).toHaveClass('px-2', 'py-2', 'sm:px-3');

        // Check that button has responsive padding
        const addButton = screen.getByLabelText('Crea nuova fattura');
        expect(addButton).toHaveClass('px-3', 'py-2', 'sm:px-4');
    });

    it('handles edge case with empty availableYears array', () => {
        render(
            <InvoiceHeader
                selectedYear={2025}
                availableYears={[]}
                onYearChange={mockOnYearChange}
                onNewInvoiceClick={mockOnNewInvoiceClick}
                totalInvoices={0}
            />
        );

        const yearSelector = screen.getByLabelText('Seleziona anno');
        expect(yearSelector).toBeInTheDocument();

        // Should not have any options
        const options = yearSelector.querySelectorAll('option');
        expect(options).toHaveLength(0);
    });
});
