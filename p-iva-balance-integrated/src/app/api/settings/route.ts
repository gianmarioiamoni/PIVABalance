import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database/mongodb";
import { UserSettings } from "@/models/UserSettings";
import { User } from "@/models/User";
import {
  validateSchema,
  isValidationError,
  userSettingsUpdateSchema,
} from "@/lib/validations/schemas";

/**
 * Helper function to clean settings data for response
 */
function cleanSettingsData(settings: any) {
  const settingsData = settings.toJSON();
  delete settingsData._id;
  delete settingsData.__v;
  delete settingsData.userId;
  delete settingsData.createdAt;
  delete settingsData.updatedAt;

  // Remove undefined properties for cleaner response
  Object.keys(settingsData).forEach((key) => {
    if (settingsData[key] === undefined) {
      delete settingsData[key];
    }
  });

  return settingsData;
}

/**
 * GET /api/settings - Get user settings
 * Returns default settings if none exist
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get user ID from headers (simplified auth for now)
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Non autorizzato",
        },
        { status: 401 }
      );
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Utente non trovato",
        },
        { status: 404 }
      );
    }

    // Get user settings or return defaults
    let settings = await UserSettings.findOne({ userId });

    if (!settings) {
      // Return default settings
      const defaultSettings = {
        taxRegime: "forfettario" as const,
        substituteRate: 5,
        profitabilityRate: 78,
        pensionSystem: "INPS" as const,
        professionalFundId: undefined,
        inpsRateType: undefined,
        manualContributionRate: undefined,
        manualMinimumContribution: undefined,
        manualFixedAnnualContributions: undefined,
      };

      return NextResponse.json({
        success: true,
        data: defaultSettings,
      });
    }

    // Convert to plain object and remove internal fields
    const settingsData = cleanSettingsData(settings);

    return NextResponse.json({
      success: true,
      data: settingsData,
    });
  } catch (error) {
    console.error("Settings GET error:", error);
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
 * PUT /api/settings - Update user settings
 */
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    // Get user ID from headers (simplified auth for now)
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Non autorizzato",
        },
        { status: 401 }
      );
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Utente non trovato",
        },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = validateSchema(userSettingsUpdateSchema, body);

    // Find existing settings or create new
    let settings = await UserSettings.findOne({ userId });

    if (settings) {
      // Update existing settings
      Object.assign(settings, validatedData);
      await settings.save();
    } else {
      // Create new settings with defaults + provided data
      const defaultSettings = {
        userId,
        taxRegime: "forfettario" as const,
        substituteRate: 5,
        profitabilityRate: 78,
        pensionSystem: "INPS" as const,
      };

      const newSettingsData = { ...defaultSettings, ...validatedData };

      // If regime is ordinario, remove forfettario-specific fields
      if (newSettingsData.taxRegime === "ordinario") {
        delete newSettingsData.substituteRate;
        delete newSettingsData.profitabilityRate;
      }

      settings = new UserSettings(newSettingsData);
      await settings.save();
    }

    // Convert to plain object and remove internal fields
    const settingsData = cleanSettingsData(settings);

    return NextResponse.json({
      success: true,
      data: settingsData,
      message: "Impostazioni aggiornate con successo",
    });
  } catch (error) {
    console.error("Settings PUT error:", error);

    // Handle validation errors
    if (isValidationError(error)) {
      const errorMessages = error.errors.issues.map((err) => err.message);
      return NextResponse.json(
        {
          success: false,
          message: "Dati non validi",
          errors: errorMessages,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Errore interno del server",
      },
      { status: 500 }
    );
  }
}
