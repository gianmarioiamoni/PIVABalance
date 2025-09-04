import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database/mongodb";
import { Cost } from "@/models";
import { Document as MongoDocument } from "mongoose";
import { getUserFromRequest } from "@/lib/auth/jwt";
import {
  validateSchema,
  isValidationError,
  costCreateSchema,
  costQuerySchema,
} from "@/lib/validations/schemas";
import { findCostsByUserAndYear, findCostsByUserId } from "@/utils/costQueries";import { CostCreateRequest, CostResponse, ApiResponse, ICost } from "@/types";
import { Document } from "mongoose";

/**
 * Helper function to format cost data for response
 * Pure function - follows functional programming principles
 */
const formatCostResponse = (cost: Document & ICost): CostResponse => ({
  id: cost._id?.toString() || "unknown",
  description: cost.description,
  date: cost.date.toISOString(),
  amount: cost.amount,
  createdAt: cost.createdAt?.toISOString() || new Date().toISOString(),
  updatedAt: cost.updatedAt?.toISOString() || new Date().toISOString(),
});

/**
 * GET /api/costs
 * Get all costs for the authenticated user
 * Supports optional year filter and pagination
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<CostResponse[]>>> {
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

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryData = {
      year: searchParams.get("year") || undefined,
      limit: searchParams.get("limit") || undefined,
      offset: searchParams.get("offset") || undefined,
    };

    const validatedQuery = validateSchema(costQuerySchema, queryData);

    // Build query based on parameters
    let costs;
    if (validatedQuery.year) {
      costs = await findCostsByUserAndYear(
        userData.userId,
        parseInt(validatedQuery.year)
      );
    } else {
      costs = await findCostsByUserId(userData.userId);
    }

    // Apply pagination if specified
    let paginatedCosts = costs;
    if (validatedQuery.limit) {
      const limit = parseInt(validatedQuery.limit);
      const offset = validatedQuery.offset
        ? parseInt(validatedQuery.offset)
        : 0;
      paginatedCosts = costs.slice(offset, offset + limit);
    }

    // Format response data
    const formattedCosts = paginatedCosts.map(cost => formatCostResponse(cost as MongoDocument & ICost));

    return NextResponse.json(
      {
        success: true,
        data: formattedCosts,
        meta: {
          total: costs.length,
          returned: formattedCosts.length,
          year: validatedQuery.year ? parseInt(validatedQuery.year) : undefined,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get costs error:", error);

    // Handle validation errors
    if (isValidationError(error)) {
      const errorMessages = error.errors.issues.map((err) => err.message);
      return NextResponse.json(
        {
          success: false,
          message: "Parametri di query non validi",
          errors: errorMessages,
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
 * POST /api/costs
 * Create a new cost for the authenticated user
 */
export async function POST(
  request: NextRequest
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

    // Parse and validate request body
    const body = await request.json();
    const validatedData: CostCreateRequest = validateSchema(
      costCreateSchema,
      body
    );

    // Create new cost
    const cost = new Cost({
      userId: userData.userId,
      description: validatedData.description,
      date: new Date(validatedData.date),
      amount: validatedData.amount,
    });

    await cost.save();

    // Return formatted response
    const formattedCost = formatCostResponse(cost);

    return NextResponse.json(
      {
        success: true,
        message: "Costo creato con successo",
        data: formattedCost,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create cost error:", error);

    // Handle validation errors
    if (isValidationError(error)) {
      const errorMessages = error.errors.issues.map((err) => err.message);
      return NextResponse.json(
        {
          success: false,
          message: "Dati del costo non validi",
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
