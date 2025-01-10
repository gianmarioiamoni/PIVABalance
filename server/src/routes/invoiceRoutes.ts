import express from "express";
import { invoiceController } from "../controllers/invoiceController";
import {
  validateInvoice,
  validateInvoiceUpdate,
} from "../middleware/validation";

const router = express.Router();

// Get invoices for a specific year
router.get("/", invoiceController.getInvoicesByYear);

// Create a new invoice
router.post("/", validateInvoice, invoiceController.createInvoice);

// Update an invoice (payment date)
router.route('/:id/update')
  .post(validateInvoiceUpdate, invoiceController.updateInvoice);

// Delete an invoice
router.delete('/:id', invoiceController.deleteInvoice);

export default router;
