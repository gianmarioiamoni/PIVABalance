import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database/mongodb";
import { ProfessionalFund } from "@/models";
import { getUserFromRequest } from "@/lib/auth/jwt";
import {
  validateSchema,
  isValidationError,
  professionalFundCreateSchema,
  professionalFundQuerySchema,
} from "@/lib/validations/schemas";
import {
  ProfessionalFundCreateRequest,
  ProfessionalFundResponse,
  ApiResponse,
  RawProfessionalFund,
  ProfessionalFundQuery,
} from "@/types";

/**
 * Helper function to format professional fund response
 * Pure function - follows functional programming principles
 */
const formatProfessionalFundResponse = (
  fund: RawProfessionalFund
): ProfessionalFundResponse => ({
  id: (fund._id as string).toString(),
  name: fund.name,
  code: fund.code,
  description: fund.description,
  parameters: fund.parameters.map((param) => ({
    contributionRate: param.contributionRate,
    minimumContribution: param.minimumContribution,
    fixedAnnualContributions: param.fixedAnnualContributions,
    year: param.year,
  })),
  allowManualEdit: fund.allowManualEdit,
  isActive: fund.isActive,
  createdAt: fund.createdAt.toISOString(),
  updatedAt: fund.updatedAt.toISOString(),
});

/**
 * GET /api/professional-funds
 * Get all professional funds with optional filters
 * Public endpoint - no authentication required for reading funds
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<ProfessionalFundResponse[]>>> {
  try {
    await connectDB();

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryData = {
      year: searchParams.get("year") || undefined,
      active: searchParams.get("active") || undefined,
      limit: searchParams.get("limit") || undefined,
      offset: searchParams.get("offset") || undefined,
    };

    const validatedQuery = validateSchema(
      professionalFundQuerySchema,
      queryData
    );

    // Build query
    const query: ProfessionalFundQuery = {};

    // Filter by active status if specified
    if (validatedQuery.active !== undefined) {
      query.isActive = validatedQuery.active;
    } else {
      // Default to active funds only
      query.isActive = true;
    }

    // Filter by year if specified
    if (validatedQuery.year) {
      (query as Record<string, unknown>)["parameters.year"] = parseInt(validatedQuery.year);
    }

    // Find professional funds
    const funds = await ProfessionalFund.find(query).sort({ name: 1 });

    // Apply pagination if specified
    let paginatedFunds = funds;
    if (validatedQuery.limit) {
      const limit = parseInt(validatedQuery.limit);
      const offset = validatedQuery.offset
        ? parseInt(validatedQuery.offset)
        : 0;
      paginatedFunds = funds.slice(offset, offset + limit);
    }

    // Format response data
    const formattedFunds = paginatedFunds.map(fund => formatProfessionalFundResponse(fund as unknown as RawProfessionalFund));

    return NextResponse.json(
      {
        success: true,
        data: formattedFunds,
        meta: {
          total: funds.length,
          returned: formattedFunds.length,
          year: validatedQuery.year ? parseInt(validatedQuery.year) : undefined,
          activeOnly: validatedQuery.active !== false,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get professional funds error:", error);

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
 * POST /api/professional-funds
 * Create a new professional fund
 * Requires authentication - typically admin only
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<ProfessionalFundResponse>>> {
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
    const validatedData: ProfessionalFundCreateRequest = validateSchema(
      professionalFundCreateSchema,
      body
    );

    // Check if fund with same code already exists
    const existingFund = await ProfessionalFund.findOne({ code: validatedData.code });
    if (existingFund) {
      return NextResponse.json(
        {
          success: false,
          message: "Un fondo professionale con questo codice esiste già",
        },
        { status: 400 }
      );
    }

    // Create new professional fund
    const fund = new ProfessionalFund({
      name: validatedData.name,
      code: validatedData.code,
      description: validatedData.description,
      parameters: validatedData.parameters,
      allowManualEdit: validatedData.allowManualEdit || false,
      isActive: validatedData.isActive !== false, // Default to true
    });

    await fund.save();

    // Return formatted response
    const formattedFund = formatProfessionalFundResponse(fund as unknown as RawProfessionalFund);

    return NextResponse.json(
      {
        success: true,
        message: "Fondo professionale creato con successo",
        data: formattedFund,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create professional fund error:", error);

    // Handle validation errors
    if (isValidationError(error)) {
      const errorMessages = error.errors.issues.map((err) => err.message);
      return NextResponse.json(
        {
          success: false,
          message: "Dati del fondo professionale non validi",
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
          message: "Errore di validazione del fondo professionale",
          errors: [error.message],
        },
        { status: 400 }
      );
    }

    // Handle MongoDB duplicate key error
    if (error instanceof Error && error.message.includes("E11000")) {
      return NextResponse.json(
        {
          success: false,
          message: "Un fondo professionale con questo codice esiste già",
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
