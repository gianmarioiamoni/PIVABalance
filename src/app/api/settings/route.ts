import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database/mongodb";
import { UserSettings } from "@/models/UserSettings";
import { User } from "@/models/User";
import {
  validateSchema,
  isValidationError,
  userSettingsUpdateSchema,
} from "@/lib/validations/schemas";
import { IUserSettings, RawUserSettings } from "@/types";
import { getUserFromRequest } from "@/lib/auth/jwt";

/**
 * Helper function to clean settings data for response
 */
function cleanSettingsData(
  settings:
    | IUserSettings
    | (IUserSettings & { toJSON?(): object; _id?: unknown; __v?: unknown })
): RawUserSettings {
  const settingsData = settings.toJSON?.() || settings;
  const cleanedData = { ...settingsData };

  // Remove MongoDB-specific fields
  delete cleanedData._id;
  delete cleanedData.__v;
  delete cleanedData.userId;
  delete cleanedData.createdAt;
  delete cleanedData.updatedAt;

  // Remove undefined properties for cleaner response
  Object.keys(cleanedData).forEach((key) => {
    if (cleanedData[key] === undefined) {
      delete cleanedData[key];
    }
  });

  return cleanedData as RawUserSettings;
}

/**
 * GET /api/settings - Get user settings
 * Returns default settings if none exist
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get user from JWT token
    const userData = await getUserFromRequest(request);
    if (!userData) {
      return NextResponse.json(
        {
          success: false,
          message: "Non autorizzato",
        },
        { status: 401 }
      );
    }

    // Verify user exists
    const user = await User.findById(userData.userId);
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
    const settings = await UserSettings.findOne({ userId: userData.userId });

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

    // Get user from JWT token
    const userData = await getUserFromRequest(request);
    if (!userData) {
      return NextResponse.json(
        {
          success: false,
          message: "Non autorizzato",
        },
        { status: 401 }
      );
    }

    // Verify user exists
    const user = await User.findById(userData.userId);
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
    let settings = await UserSettings.findOne({ userId: userData.userId });

    if (settings) {
      // Update existing settings
      Object.assign(settings, validatedData);
      await settings.save();
    } else {
      // Create new settings with defaults + provided data
      const defaultSettings = {
        userId: userData.userId,
        taxRegime: "forfettario" as const,
        substituteRate: 5,
        profitabilityRate: 78,
        pensionSystem: "INPS" as const,
      };

      const newSettingsData = { ...defaultSettings, ...validatedData };

      // If regime is ordinario, remove forfettario-specific fields
      if (newSettingsData.taxRegime === "ordinario") {
        delete (newSettingsData as Record<string, unknown>).substituteRate;
        delete (newSettingsData as Record<string, unknown>).profitabilityRate;
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
