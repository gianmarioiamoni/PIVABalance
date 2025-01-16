import api from './api';

export interface Invoice {
  _id?: string;
  userId: string;
  number: string;
  issueDate: Date;
  title: string;
  clientName: string;
  amount: number;
  paymentDate?: Date;
  fiscalYear: number;
  vat: {
    type: 'standard' | 'reduced10' | 'reduced5' | 'reduced4' | 'custom';
    rate: number;
  };
}

class InvoiceService {
  async getInvoicesByYear(year: number): Promise<Invoice[]> {
    try {
      const response = await api.get(`/api/invoices?year=${year}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }

  async createInvoice(invoice: Omit<Invoice, '_id'>): Promise<Invoice> {
    try {
      const response = await api.post('/api/invoices', invoice);
      return response.data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  async updateInvoice(id: string, invoice: Partial<Invoice>): Promise<Invoice> {
    try {
      const response = await api.post(`/api/invoices/${id}/update`, invoice);
      return response.data;
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  }

  async deleteInvoice(id: string): Promise<void> {
    try {
      await api.delete(`/api/invoices/${id}`);
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  }
}

export const invoiceService = new InvoiceService();
