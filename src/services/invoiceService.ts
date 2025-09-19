import { api } from "./api";

/**
 * Invoice interface for API responses
 */
export interface Invoice {
  id: string;
  userId: string;
  number: string;
  issueDate: string;
  title: string;
  clientName: string;
  amount: number;
  paymentDate?: string;
  fiscalYear: number;
  vat?: {
    type: "standard" | "reduced10" | "reduced5" | "reduced4" | "custom";
    rate: number;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Invoice creation data interface
 */
export interface CreateInvoiceData {
  number: string;
  issueDate: string;
  title: string;
  clientName: string;
  amount: number;
  paymentDate?: string;
  fiscalYear: number;
  vat?: {
    type: "standard" | "reduced10" | "reduced5" | "reduced4" | "custom";
    rate: number;
  };
}

/**
 * Invoice update data interface
 */
export interface UpdateInvoiceData {
  number?: string;
  issueDate?: string;
  title?: string;
  clientName?: string;
  amount?: number;
  paymentDate?: string;
  fiscalYear?: number;
  vat?: {
    type: "standard" | "reduced10" | "reduced5" | "reduced4" | "custom";
    rate: number;
  };
}

/**
 * Enhanced Invoice Service for Next.js API Routes
 *
 * Handles invoice management using Next.js API Routes.
 * Uses JWT authentication and follows the new ApiResponse format.
 *
 * Features:
 * - TypeScript strict typing (zero 'any')
 * - JWT authentication integration
 * - Error handling and validation
 * - Integration with new API client
 * - SOLID principles adherence
 */
class InvoiceService {
  /**
   * Get invoices by year
   * Uses GET /api/invoices?year={year} endpoint
   */
  async getInvoicesByYear(year: number): Promise<Invoice[]> {
    try {
      const invoices = await api.get<Invoice[]>(`/invoices?year=${year}`);
      return invoices;
    } catch (error) {
      console.error("Error fetching invoices:", error);
      throw error;
    }
  }

  /**
   * Get all invoices for the authenticated user
   * Uses GET /api/invoices endpoint
   */
  async getAllInvoices(): Promise<Invoice[]> {
    try {
      const invoices = await api.get<Invoice[]>("/invoices");
      return invoices;
    } catch (error) {
      console.error("Error fetching all invoices:", error);
      throw error;
    }
  }

  /**
   * Get a specific invoice by ID
   * Uses GET /api/invoices/{id} endpoint
   */
  async getInvoiceById(id: string): Promise<Invoice> {
    try {
      const invoice = await api.get<Invoice>(`/invoices/${id}`);
      return invoice;
    } catch (error) {
      console.error("Error fetching invoice:", error);
      throw error;
    }
  }

  /**
   * Create a new invoice
   * Uses POST /api/invoices endpoint
   */
  async createInvoice(data: CreateInvoiceData): Promise<Invoice> {
    try {
      console.warn(
        "Creating invoice with data:",
        JSON.stringify(data, null, 2)
      );
      const invoice = await api.post<Invoice>("/invoices", data);
      console.warn("Invoice created successfully:", invoice);
      return invoice;
    } catch (error) {
      console.error("Error creating invoice:", error);
      throw error;
    }
  }

  /**
   * Update an existing invoice
   * Uses PUT /api/invoices/{id} endpoint
   */
  async updateInvoice(_id: string, data: UpdateInvoiceData): Promise<Invoice> {
    try {
      const invoice = await api.put<Invoice>(`/invoices/${_id}`, data);
      return invoice;
    } catch (error) {
      console.error("Error updating invoice:", error);
      throw error;
    }
  }

  /**
   * Delete an invoice
   * Uses DELETE /api/invoices/{id} endpoint
   */
  async deleteInvoice(id: string): Promise<void> {
    try {
      await api.delete(`/invoices/${id}`);
    } catch (error) {
      console.error("Error deleting invoice:", error);
      throw error;
    }
  }

  /**
   * Update payment date for an invoice
   * Convenience method for payment tracking
   */
  async updatePaymentDate(
    id: string,
    paymentDate: string | null
  ): Promise<Invoice> {
    try {
      const invoice = await api.put<Invoice>(`/invoices/${id}`, {
        paymentDate: paymentDate || undefined,
      });
      return invoice;
    } catch (error) {
      console.error("Error updating payment date:", error);
      throw error;
    }
  }

  /**
   * Calculate total revenue for a year
   * Client-side calculation helper
   */
  calculateYearRevenue(invoices: Invoice[], year: number): number {
    return invoices
      .filter((invoice) => {
        const issueYear = new Date(invoice.issueDate).getFullYear();
        return issueYear === year;
      })
      .reduce((total, invoice) => total + invoice.amount, 0);
  }

  /**
   * Calculate paid revenue for a year
   * Client-side calculation helper
   */
  calculatePaidRevenue(invoices: Invoice[], year: number): number {
    return invoices
      .filter((invoice) => {
        const issueYear = new Date(invoice.issueDate).getFullYear();
        return issueYear === year && invoice.paymentDate;
      })
      .reduce((total, invoice) => total + invoice.amount, 0);
  }

  /**
   * Get unpaid invoices
   * Client-side filtering helper
   */
  getUnpaidInvoices(invoices: Invoice[]): Invoice[] {
    return invoices.filter((invoice) => !invoice.paymentDate);
  }

  /**
   * Filter invoices by date range
   * Client-side filtering helper
   */
  filterByDateRange(
    invoices: Invoice[],
    startDate: string,
    endDate: string
  ): Invoice[] {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return invoices.filter((invoice) => {
      const issueDate = new Date(invoice.issueDate);
      return issueDate >= start && issueDate <= end;
    });
  }

  /**
   * Group invoices by month
   * Client-side grouping helper
   */
  groupByMonth(invoices: Invoice[], year: number): Record<string, Invoice[]> {
    const yearInvoices = invoices.filter(
      (invoice) => new Date(invoice.issueDate).getFullYear() === year
    );

    return yearInvoices.reduce((groups, invoice) => {
      const month = new Date(invoice.issueDate).toISOString().substring(0, 7); // YYYY-MM
      if (!groups[month]) {
        groups[month] = [];
      }
      groups[month].push(invoice);
      return groups;
    }, {} as Record<string, Invoice[]>);
  }

  /**
   * Calculate VAT for an invoice
   * Client-side calculation helper
   */
  calculateVAT(invoice: Invoice): number {
    if (!invoice.vat) {
      return 0;
    }
    return (invoice.amount * invoice.vat.rate) / 100;
  }

  /**
   * Calculate total amount including VAT
   * Client-side calculation helper
   */
  calculateTotalWithVAT(invoice: Invoice): number {
    return invoice.amount + this.calculateVAT(invoice);
  }

  /**
   * Validate invoice data
   * Client-side validation helper
   */
  validateInvoiceData(data: CreateInvoiceData | UpdateInvoiceData): string[] {
    const errors: string[] = [];

    if ("number" in data) {
      if (!data.number || data.number.trim().length === 0) {
        errors.push("Numero fattura richiesto");
      }
      if (data.number && data.number.length > 50) {
        errors.push("Numero fattura troppo lungo (max 50 caratteri)");
      }
    }

    if ("title" in data) {
      if (!data.title || data.title.trim().length === 0) {
        errors.push("Oggetto fattura richiesto");
      }
      if (data.title && data.title.length > 200) {
        errors.push("Oggetto troppo lungo (max 200 caratteri)");
      }
    }

    if ("clientName" in data) {
      if (!data.clientName || data.clientName.trim().length === 0) {
        errors.push("Nome cliente richiesto");
      }
      if (data.clientName && data.clientName.length > 100) {
        errors.push("Nome cliente troppo lungo (max 100 caratteri)");
      }
    }

    if ("amount" in data) {
      if (data.amount === undefined || data.amount <= 0) {
        errors.push("Importo deve essere maggiore di zero");
      }
      if (data.amount && data.amount > 999999.99) {
        errors.push("Importo troppo elevato");
      }
    }

    if ("issueDate" in data) {
      if (!data.issueDate) {
        errors.push("Data emissione richiesta");
      } else {
        const date = new Date(data.issueDate);
        if (isNaN(date.getTime())) {
          errors.push("Data emissione non valida");
        }
      }
    }

    if ("paymentDate" in data && data.paymentDate) {
      const paymentDate = new Date(data.paymentDate);
      if (isNaN(paymentDate.getTime())) {
        errors.push("Data pagamento non valida");
      }
      if ("issueDate" in data && data.issueDate) {
        const issueDate = new Date(data.issueDate);
        if (paymentDate < issueDate) {
          errors.push(
            "Data pagamento non può essere precedente alla data di emissione"
          );
        }
      }
    }

    if ("fiscalYear" in data) {
      if (
        !data.fiscalYear ||
        data.fiscalYear < 2000 ||
        data.fiscalYear > 2100
      ) {
        errors.push("Anno fiscale non valido");
      }
    }

    if ("vat" in data && data.vat) {
      if (data.vat.rate < 0 || data.vat.rate > 100) {
        errors.push("Aliquota IVA non valida (0-100%)");
      }
    }

    return errors;
  }
}

/**
 * Global invoice service instance
 * Singleton pattern for consistent state management
 */
export const invoiceService = new InvoiceService();
