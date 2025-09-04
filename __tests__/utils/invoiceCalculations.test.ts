import {
  calculateVatAmount,
  calculateTotalAmount,
  isInvoicePaid,
  getPaymentStatus,
  calculateTotalRevenue,
  filterInvoicesByYear,
  filterUnpaidInvoices,
  sortInvoicesByDate,
} from "@/utils/invoiceCalculations";
import { IInvoice } from "@/types";

describe("Invoice Calculations Utils", () => {
  const today = new Date();
  const recentDate = new Date();
  recentDate.setDate(today.getDate() - 5); // 5 days ago - should be pending

  const mockInvoice: IInvoice = {
    _id: "123",
    userId: "user123",
    number: "INV-001",
    issueDate: recentDate, // Use recent date
    title: "Test Invoice",
    clientName: "Test Client",
    amount: 1000,
    fiscalYear: 2024,
    vat: {
      vatType: "standard",
      vatRate: 22,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockInvoiceWithoutVat: IInvoice = {
    ...mockInvoice,
    _id: "124",
    number: "INV-002",
    vat: undefined,
  };

  const mockPaidInvoice: IInvoice = {
    ...mockInvoice,
    _id: "125",
    number: "INV-003",
    paymentDate: new Date("2024-01-20"),
  };

  const mockOverdueInvoice: IInvoice = {
    ...mockInvoice,
    _id: "126",
    number: "INV-004",
    issueDate: new Date("2023-12-01"), // Over 30 days ago
  };

  describe("calculateVatAmount", () => {
    it("should calculate VAT amount correctly", () => {
      const vatAmount = calculateVatAmount(mockInvoice);
      expect(vatAmount).toBe(220); // 1000 * 22 / 100
    });

    it("should return 0 for invoice without VAT", () => {
      const vatAmount = calculateVatAmount(mockInvoiceWithoutVat);
      expect(vatAmount).toBe(0);
    });

    it("should handle custom VAT rates", () => {
      const customVatInvoice: IInvoice = {
        ...mockInvoice,
        vat: { vatType: "custom", vatRate: 15 },
      };
      const vatAmount = calculateVatAmount(customVatInvoice);
      expect(vatAmount).toBe(150); // 1000 * 15 / 100
    });
  });

  describe("calculateTotalAmount", () => {
    it("should calculate total amount including VAT", () => {
      const totalAmount = calculateTotalAmount(mockInvoice);
      expect(totalAmount).toBe(1220); // 1000 + 220
    });

    it("should return base amount when no VAT", () => {
      const totalAmount = calculateTotalAmount(mockInvoiceWithoutVat);
      expect(totalAmount).toBe(1000);
    });
  });

  describe("isInvoicePaid", () => {
    it("should return true for paid invoice", () => {
      expect(isInvoicePaid(mockPaidInvoice)).toBe(true);
    });

    it("should return false for unpaid invoice", () => {
      expect(isInvoicePaid(mockInvoice)).toBe(false);
    });
  });

  describe("getPaymentStatus", () => {
    it("should return 'paid' for paid invoice", () => {
      expect(getPaymentStatus(mockPaidInvoice)).toBe("paid");
    });

    it("should return 'pending' for recent unpaid invoice", () => {
      expect(getPaymentStatus(mockInvoice)).toBe("pending");
    });

    it("should return 'overdue' for old unpaid invoice", () => {
      expect(getPaymentStatus(mockOverdueInvoice)).toBe("overdue");
    });
  });

  describe("calculateTotalRevenue", () => {
    it("should calculate total revenue from multiple invoices", () => {
      const invoices = [mockInvoice, mockInvoiceWithoutVat, mockPaidInvoice];
      const totalRevenue = calculateTotalRevenue(invoices);
      expect(totalRevenue).toBe(3000); // 1000 + 1000 + 1000
    });

    it("should return 0 for empty array", () => {
      const totalRevenue = calculateTotalRevenue([]);
      expect(totalRevenue).toBe(0);
    });
  });

  describe("filterInvoicesByYear", () => {
    it("should filter invoices by fiscal year", () => {
      const invoice2023: IInvoice = { ...mockInvoice, fiscalYear: 2023 };
      const invoices = [mockInvoice, invoice2023];

      const filtered2024 = filterInvoicesByYear(invoices, 2024);
      const filtered2023 = filterInvoicesByYear(invoices, 2023);

      expect(filtered2024).toHaveLength(1);
      expect(filtered2023).toHaveLength(1);
      expect(filtered2024[0].fiscalYear).toBe(2024);
      expect(filtered2023[0].fiscalYear).toBe(2023);
    });
  });

  describe("filterUnpaidInvoices", () => {
    it("should filter only unpaid invoices", () => {
      const invoices = [mockInvoice, mockPaidInvoice, mockInvoiceWithoutVat];
      const unpaidInvoices = filterUnpaidInvoices(invoices);

      expect(unpaidInvoices).toHaveLength(2);
      expect(unpaidInvoices.every((invoice) => !invoice.paymentDate)).toBe(
        true
      );
    });
  });

  describe("sortInvoicesByDate", () => {
    it("should sort invoices by date ascending", () => {
      const oldInvoice: IInvoice = {
        ...mockInvoice,
        issueDate: new Date("2024-01-01"),
      };
      const newInvoice: IInvoice = {
        ...mockInvoice,
        issueDate: new Date("2024-01-31"),
      };

      const invoices = [newInvoice, oldInvoice];
      const sorted = sortInvoicesByDate(invoices, true);

      expect(sorted[0].issueDate.getTime()).toBeLessThan(
        sorted[1].issueDate.getTime()
      );
    });

    it("should sort invoices by date descending", () => {
      const oldInvoice: IInvoice = {
        ...mockInvoice,
        issueDate: new Date("2024-01-01"),
      };
      const newInvoice: IInvoice = {
        ...mockInvoice,
        issueDate: new Date("2024-01-31"),
      };

      const invoices = [oldInvoice, newInvoice];
      const sorted = sortInvoicesByDate(invoices, false);

      expect(sorted[0].issueDate.getTime()).toBeGreaterThan(
        sorted[1].issueDate.getTime()
      );
    });

    it("should not mutate original array", () => {
      const invoices = [mockInvoice, mockPaidInvoice];
      const originalLength = invoices.length;

      sortInvoicesByDate(invoices);

      expect(invoices).toHaveLength(originalLength);
    });
  });
});
