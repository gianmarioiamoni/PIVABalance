import { Request, Response } from 'express';
import { Invoice } from '../models/Invoice';

export const invoiceController = {
  // Get invoices for a specific year
  async getInvoicesByYear(req: Request, res: Response) {
    try {
      const { year } = req.query;
      const userId = req.user?._id;

      if (!year || !userId) {
        return res.status(400).json({ message: 'Year parameter is required' });
      }

      const invoices = await Invoice.find({
        userId,
        fiscalYear: parseInt(year as string)
      }).sort({ issueDate: 1 });

      res.json(invoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      res.status(500).json({ message: 'Error fetching invoices' });
    }
  },

  // Create a new invoice
  async createInvoice(req: Request, res: Response) {
    console.log('Received create invoice request');
    console.log('Request user:', req.user);
    console.log('Request body:', req.body);

    try {
      const userId = req.user?._id;
      console.log('User ID from request:', userId);

      if (!userId) {
        console.log('Authentication error: No user ID found');
        return res.status(401).json({
          message: 'User not authenticated',
          details: 'No user ID found in request'
        });
      }

      // Check if invoice number already exists for this user
      console.log('Checking for existing invoice with number:', req.body.number);
      const existingInvoice = await Invoice.findOne({
        userId,
        number: req.body.number
      });

      if (existingInvoice) {
        console.log('Invoice number already exists:', req.body.number);
        return res.status(400).json({
          message: 'An invoice with this number already exists',
          details: `Invoice number ${req.body.number} is already in use`
        });
      }

      console.log('Creating new invoice with data:', {
        ...req.body,
        userId
      });

      const invoice = new Invoice({
        ...req.body,
        userId
      });

      // Log validation errors if any
      const validationError = invoice.validateSync();
      if (validationError) {
        console.error('Validation error:', JSON.stringify(validationError, null, 2));
        return res.status(400).json({
          message: 'Validation error',
          errors: Object.values(validationError.errors).map(err => ({
            field: err.path,
            message: err.message,
            value: err.value
          }))
        });
      }

      console.log('Saving invoice...');
      await invoice.save();
      console.log('Invoice saved successfully:', invoice._id);
      res.status(201).json(invoice);
    } catch (error: any) {
      console.error('Error in createInvoice:', error);
      if (error.name === 'ValidationError') {
        console.error('Mongoose validation error:', JSON.stringify(error, null, 2));
        return res.status(400).json({
          message: 'Validation error',
          errors: Object.values(error.errors).map((err: any) => ({
            field: err.path,
            message: err.message,
            value: err.value
          }))
        });
      }
      console.error('Unexpected error:', error);
      res.status(500).json({
        message: 'Error creating invoice',
        details: error.message
      });
    }
  },

  // Update an invoice (payment date)
  async updateInvoice(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?._id;

      if (!id) {
        return res.status(400).json({ message: 'Invoice ID is required' });
      }

      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      // Ensure user can only update their own invoices
      const invoice = await Invoice.findOne({ _id: id, userId });

      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }

      // Only allow updating payment date
      if (req.body.paymentDate !== undefined) {
        invoice.paymentDate = req.body.paymentDate;
        await invoice.save();
        console.log('Invoice updated successfully:', invoice);
      }

      res.json(invoice);
    } catch (error) {
      console.error('Error updating invoice:', error);
      res.status(500).json({ message: 'Error updating invoice' });
    }
  },

  // Delete an invoice
  async deleteInvoice(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?._id;

      if (!id) {
        return res.status(400).json({ message: 'Invoice ID is required' });
      }

      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      // Ensure user can only delete their own invoices
      const invoice = await Invoice.findOne({ _id: id, userId });

      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }

      await Invoice.deleteOne({ _id: id, userId });
      res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (error) {
      console.error('Error deleting invoice:', error);
      res.status(500).json({ message: 'Error deleting invoice' });
    }
  }
};
