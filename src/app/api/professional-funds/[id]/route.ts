import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database/mongodb";
import { ProfessionalFund } from "@/models";
import { getUserFromRequest } from "@/lib/auth/jwt";
import {
  validateSchema,
  isValidationError,
  professionalFundUpdateSchema,
  professionalFundIdParamSchema,
} from "@/lib/validations/schemas";
import {
  ProfessionalFundUpdateRequest,
  ProfessionalFundResponse,
  ApiResponse,
  RawProfessionalFund,
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
 * GET /api/professional-funds/[id]
 * Get a specific professional fund by ID
 * Public endpoint - no authentication required
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<ProfessionalFundResponse>>> {
  try {
    await connectDB();

    // Validate professional fund ID parameter
    const resolvedParams = await params;
    const validatedParams = validateSchema(
      professionalFundIdParamSchema,
      resolvedParams
    );

    // Find professional fund by ID
    const fund = await ProfessionalFund.findById(validatedParams.id);

    if (!fund) {
      return NextResponse.json(
        {
          success: false,
          message: "Fondo professionale non trovato",
        },
        { status: 404 }
      );
    }

    // Return formatted response
    const formattedFund = formatProfessionalFundResponse(fund as unknown as RawProfessionalFund);

    return NextResponse.json(
      {
        success: true,
        data: formattedFund,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get professional fund error:", error);

    // Handle validation errors
    if (isValidationError(error)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID fondo professionale non valido",
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
 * PUT /api/professional-funds/[id]
 * Update a specific professional fund by ID
 * Requires authentication - typically admin only
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    // Validate professional fund ID parameter
    const resolvedParams = await params;
    const validatedParams = validateSchema(
      professionalFundIdParamSchema,
      resolvedParams
    );

    // Parse and validate request body
    const body = await request.json();
    const validatedData: ProfessionalFundUpdateRequest = validateSchema(
      professionalFundUpdateSchema,
      body
    );

    // Check if updating code and if it conflicts with existing fund
    if (validatedData.code) {
      const existingFund = await ProfessionalFund.findOne({ code: 
        validatedData.code });
      if (existingFund && existingFund._id.toString() !== validatedParams.id) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Un altro fondo professionale con questo codice esiste già",
          },
          { status: 400 }
        );
      }
    }

    // Prepare update data - only include provided fields
    const updateData: Partial<ProfessionalFundUpdateRequest> = {};
    if (validatedData.name !== undefined) {
      updateData.name = validatedData.name;
    }
    if (validatedData.code !== undefined) {
      updateData.code = validatedData.code;
    }
    if (validatedData.description !== undefined) {
      updateData.description = validatedData.description;
    }
    if (validatedData.parameters !== undefined) {
      updateData.parameters = validatedData.parameters;
    }
    if (validatedData.allowManualEdit !== undefined) {
      updateData.allowManualEdit = validatedData.allowManualEdit;
    }
    if (validatedData.isActive !== undefined) {
      updateData.isActive = validatedData.isActive;
    }

    // Update professional fund
    const fund = await ProfessionalFund.findByIdAndUpdate(
      validatedParams.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!fund) {
      return NextResponse.json(
        {
          success: false,
          message: "Fondo professionale non trovato",
        },
        { status: 404 }
      );
    }

    // Return formatted response
    const formattedFund = formatProfessionalFundResponse(fund as unknown as RawProfessionalFund);

    return NextResponse.json(
      {
        success: true,
        message: "Fondo professionale aggiornato con successo",
        data: formattedFund,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update professional fund error:", error);

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
          message: "Un altro fondo professionale con questo codice esiste già",
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
 * DELETE /api/professional-funds/[id]
 * Delete a specific professional fund by ID
 * Requires authentication - typically admin only
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

    // Validate professional fund ID parameter
    const resolvedParams = await params;
    const validatedParams = validateSchema(
      professionalFundIdParamSchema,
      resolvedParams
    );

    // Delete professional fund
    const fund = await ProfessionalFund.findByIdAndDelete(validatedParams.id);

    if (!fund) {
      return NextResponse.json(
        {
          success: false,
          message: "Fondo professionale non trovato",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Fondo professionale eliminato con successo",
        data: null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete professional fund error:", error);

    // Handle validation errors
    if (isValidationError(error)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID fondo professionale non valido",
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
