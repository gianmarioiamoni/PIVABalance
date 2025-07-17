import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database/mongodb";
import { Cost } from "@/models";
import { getUserFromRequest } from "@/lib/auth/jwt";
import {
  validateSchema,
  isValidationError,
  costUpdateSchema,
  costIdParamSchema,
} from "@/lib/validations/schemas";
import { CostUpdateRequest, CostResponse, ApiResponse, RawCost } from "@/types";

/**
 * Helper function to format cost data for response
 * Pure function - follows functional programming principles
 */
const formatCostResponse = (cost: RawCost): CostResponse => ({
  id: (cost._id as string).toString(),
  description: cost.description,
  date: cost.date.toISOString(),
  amount: cost.amount,
  createdAt: cost.createdAt?.toISOString() || new Date().toISOString(),
  updatedAt: cost.updatedAt?.toISOString() || new Date().toISOString(),
});

/**
 * GET /api/costs/[id]
 * Get a specific cost by ID for the authenticated user
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<CostResponse>>> {
  try {
    await connectDB();

    // Get user from JWT token
    const userData = await getUserFromRequest(request);
    if (!userData) {
      return NextResponse.json(
        {
          success: false,
          message: "Token di autenticazione mancante o non valido",
        },
        { status: 401 }
      );
    }

    // Validate cost ID parameter
    const resolvedParams = await params;
    const validatedParams = validateSchema(costIdParamSchema, resolvedParams);

    // Find cost by ID and user
    const cost = await Cost.findOne({
      _id: validatedParams.id,
      userId: userData.userId,
    });

    if (!cost) {
      return NextResponse.json(
        {
          success: false,
          message: "Costo non trovato",
        },
        { status: 404 }
      );
    }

    // Return formatted response
    const formattedCost = formatCostResponse(cost as unknown as RawCost);

    return NextResponse.json(
      {
        success: true,
        data: formattedCost,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get cost error:", error);

    // Handle validation errors
    if (isValidationError(error)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID costo non valido",
        },
        { status: 400 }
      );
    }

    // Handle generic errors
    return NextResponse.json(
      {
        success: false,
        message: "Errore interno del server",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/costs/[id]
 * Update a specific cost by ID for the authenticated user
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<CostResponse>>> {
  try {
    await connectDB();

    // Get user from JWT token
    const userData = await getUserFromRequest(request);
    if (!userData) {
      return NextResponse.json(
        {
          success: false,
          message: "Token di autenticazione mancante o non valido",
        },
        { status: 401 }
      );
    }

    // Validate cost ID parameter
    const resolvedParams = await params;
    const validatedParams = validateSchema(costIdParamSchema, resolvedParams);

    // Parse and validate request body
    const body = await request.json();
    const validatedData: CostUpdateRequest = validateSchema(
      costUpdateSchema,
      body
    );

    // Prepare update data - only include provided fields
    const updateData: Partial<CostUpdateRequest> = {};
    if (validatedData.description !== undefined) {
      updateData.description = validatedData.description;
    }
    if (validatedData.date !== undefined) {
      updateData.date = new Date(validatedData.date);
    }
    if (validatedData.amount !== undefined) {
      updateData.amount = validatedData.amount;
    }

    // Update cost
    const cost = await Cost.findOneAndUpdate(
      { _id: validatedParams.id, userId: userData.userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!cost) {
      return NextResponse.json(
        {
          success: false,
          message: "Costo non trovato",
        },
        { status: 404 }
      );
    }

    // Return formatted response
    const formattedCost = formatCostResponse(cost as unknown as RawCost);

    return NextResponse.json(
      {
        success: true,
        message: "Costo aggiornato con successo",
        data: formattedCost,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update cost error:", error);

    // Handle validation errors
    if (isValidationError(error)) {
      const errorMessages = error.errors.issues.map((err) => err.message);
      return NextResponse.json(
        {
          success: false,
          message: "Dati di aggiornamento non validi",
          errors: errorMessages,
        },
        { status: 400 }
      );
    }

    // Handle Mongoose validation errors
    if (error instanceof Error && error.message.includes("validation failed")) {
      return NextResponse.json(
        {
          success: false,
          message: "Errore di validazione del costo",
          errors: [error.message],
        },
        { status: 400 }
      );
    }

    // Handle generic errors
    return NextResponse.json(
      {
        success: false,
        message: "Errore interno del server",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/costs/[id]
 * Delete a specific cost by ID for the authenticated user
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    await connectDB();

    // Get user from JWT token
    const userData = await getUserFromRequest(request);
    if (!userData) {
      return NextResponse.json(
        {
          success: false,
          message: "Token di autenticazione mancante o non valido",
        },
        { status: 401 }
      );
    }

    // Validate cost ID parameter
    const resolvedParams = await params;
    const validatedParams = validateSchema(costIdParamSchema, resolvedParams);

    // Delete cost
    const cost = await Cost.findOneAndDelete({
      _id: validatedParams.id,
      userId: userData.userId,
    });

    if (!cost) {
      return NextResponse.json(
        {
          success: false,
          message: "Costo non trovato",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Costo eliminato con successo",
        data: null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete cost error:", error);

    // Handle validation errors
    if (isValidationError(error)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID costo non valido",
        },
        { status: 400 }
      );
    }

    // Handle generic errors
    return NextResponse.json(
      {
        success: false,
        message: "Errore interno del server",
      },
      { status: 500 }
    );
  }
}
