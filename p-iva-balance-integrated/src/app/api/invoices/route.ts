import { NextRequest, NextResponse } from "next/server";
import { getInvoicesByYear, createInvoice } from "@/utils/invoiceQueries";
import { validateSchema, invoiceSchema } from "@/lib/validations/schemas";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/database/mongodb";
import { IInvoice } from "@/types";
import { z } from "zod";

/**
 * Invoice API Routes
 * Handles CRUD operations for invoices with authentication
 * Follows the same pattern as costs API
 */

// Query schema for year parameter
const invoiceQuerySchema = z.object({
  year: z
    .string()
    .regex(/^\d{4}$/, "Year must be a 4-digit number")
    .refine((val) => {
      const year = parseInt(val);
      return year >= 2000 && year <= new Date().getFullYear();
    }, "Year must be between 2000 and current year")
    .optional(),
});

/**
 * GET /api/invoices
 * Retrieve invoices for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Authenticate request
    const userData = await getUserFromRequest(request);
    if (!userData) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse query parameters
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());

    // Validate query parameters
    const { year } = validateSchema(invoiceQuerySchema, queryParams);

    // Get invoices
    if (year) {
      const invoices = await getInvoicesByYear(userData.userId, parseInt(year));
      return NextResponse.json({ success: true, data: invoices });
    } else {
      // Get all invoices for user (you might want to implement pagination here)
      const currentYear = new Date().getFullYear();
      const invoices = await getInvoicesByYear(userData.userId, currentYear);
      return NextResponse.json({ success: true, data: invoices });
    }
  } catch (error) {
    console.error("Get invoices error:", error);

    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/invoices
 * Create a new invoice
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Authenticate request
    const userData = await getUserFromRequest(request);
    if (!userData) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate invoice data
    const validatedData = validateSchema(invoiceSchema, body);

    // Convert string dates to Date objects
    const processedData: Omit<
      IInvoice,
      "id" | "userId" | "createdAt" | "updatedAt"
    > = {
      ...validatedData,
      // Override date fields with converted values
      issueDate: new Date(validatedData.issueDate),
      ...(validatedData.paymentDate && {
        paymentDate: new Date(validatedData.paymentDate),
      }),
    } as Omit<IInvoice, "id" | "userId" | "createdAt" | "updatedAt">;

    // Create invoice
    const invoice = await createInvoice(userData.userId, processedData);

    return NextResponse.json({ success: true, data: invoice }, { status: 201 });
  } catch (error) {
    console.error("Create invoice error:", error);

    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
