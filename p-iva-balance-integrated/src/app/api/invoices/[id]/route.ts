import { NextRequest, NextResponse } from "next/server";
import {
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} from "@/utils/invoiceQueries";
import { validateSchema, invoiceSchema } from "@/lib/validations/schemas";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/database/mongodb";
import { IInvoice } from "@/types";
import { z } from "zod";

/**
 * Invoice by ID API Routes
 * Handles operations on specific invoices
 */

const invoiceIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid invoice ID format"),
});

const updateInvoiceSchema = invoiceSchema.partial();

/**
 * GET /api/invoices/[id]
 * Get a specific invoice by ID
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    // Await params
    const params = await context.params;

    // Validate invoice ID
    const { id } = validateSchema(invoiceIdSchema, params);

    // Get invoice
    const invoice = await getInvoiceById(id, userData.userId);

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: invoice });
  } catch (error) {
    console.error("Get invoice error:", error);

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
 * PUT /api/invoices/[id]
 * Update a specific invoice
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    // Await params
    const params = await context.params;

    // Validate invoice ID
    const { id } = validateSchema(invoiceIdSchema, params);

    // Parse request body
    const body = await request.json();

    // Validate update data
    const validatedData = validateSchema(updateInvoiceSchema, body);

    // Convert string dates to Date objects
    const processedData: Partial<
      Omit<IInvoice, "id" | "userId" | "createdAt" | "updatedAt">
    > = {
      ...validatedData,
      // Override date fields with converted values
      ...(validatedData.issueDate && {
        issueDate: new Date(validatedData.issueDate),
      }),
      ...(validatedData.paymentDate && {
        paymentDate: new Date(validatedData.paymentDate),
      }),
    } as Partial<Omit<IInvoice, "id" | "userId" | "createdAt" | "updatedAt">>;

    // Update invoice
    const invoice = await updateInvoice(id, userData.userId, processedData);

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: invoice });
  } catch (error) {
    console.error("Update invoice error:", error);

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
 * DELETE /api/invoices/[id]
 * Delete a specific invoice
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    // Await params
    const params = await context.params;

    // Validate invoice ID
    const { id } = validateSchema(invoiceIdSchema, params);

    // Delete invoice
    const success = await deleteInvoice(id, userData.userId);

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    console.error("Delete invoice error:", error);

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
