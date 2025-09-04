import { NextResponse } from "next/server";
import { DEFAULT_INPS_PARAMETERS } from "@/services/inpsService";

/**
 * GET /api/inps/parameters/current - Get current INPS parameters
 * Returns default INPS parameters for the current year
 */
export async function GET() {
  try {
    // For now, return default parameters
    // In a real application, this would fetch current year parameters from a database
    const currentYear = new Date().getFullYear();
    const parameters = {
      ...DEFAULT_INPS_PARAMETERS,
      year: currentYear,
    };

    return NextResponse.json({
      success: true,
      data: parameters,
    });
  } catch (error) {
    console.error("INPS parameters error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Errore nel recupero dei parametri INPS",
      },
      { status: 500 }
    );
  }
} 