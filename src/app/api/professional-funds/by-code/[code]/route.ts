import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database/mongodb";
import { ProfessionalFund } from "@/models";
import {
  ApiResponse,
  ProfessionalFundResponse,
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
 * GET /api/professional-funds/by-code/[code]
 * Get a specific professional fund by code
 * Public endpoint - no authentication required
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
): Promise<NextResponse<ApiResponse<ProfessionalFundResponse>>> {
  try {
    await connectDB();

    // Get the code parameter
    const resolvedParams = await params;
    const fundCode = resolvedParams.code;

    // Validate that code is provided
    if (!fundCode || typeof fundCode !== 'string') {
      return NextResponse.json(
        {
          success: false,
          message: "Codice fondo professionale non valido",
        },
        { status: 400 }
      );
    }

    // Find professional fund by code
    const fund = await ProfessionalFund.findOne({ 
      code: fundCode.toUpperCase(),
      isActive: true 
    });

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
    console.error("Get professional fund by code error:", error);

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
