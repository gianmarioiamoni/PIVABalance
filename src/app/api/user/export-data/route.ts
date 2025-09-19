import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/database/mongodb";
import { User } from "@/models/User";
import { UserSettings } from "@/models/UserSettings";
import { Invoice } from "@/models/Invoice";
import { Cost } from "@/models/Cost";

/**
 * User Data Export API Route
 *
 * GDPR Art. 20 - Right to Data Portability
 * Provides users with a complete export of their personal data
 * in a structured, commonly used, and machine-readable format (JSON)
 */

interface UserDataExport {
  exportInfo: {
    exportDate: string;
    exportVersion: string;
    dataController: string;
    userRights: string;
  };
  personalData: {
    profile: Record<string, unknown>;
    settings: Record<string, unknown> | null;
  };
  businessData: {
    invoices: Record<string, unknown>[];
    costs: Record<string, unknown>[];
    statistics: {
      totalInvoices: number;
      totalCosts: number;
      totalRevenue: number;
      totalExpenses: number;
      accountAge: number; // days
    };
  };
  systemData: {
    accountCreated: string;
    lastLogin: string;
    role: string;
    isActive: boolean;
    createdBy: string | null;
  };
  privacyData: {
    consentRecords: Record<string, unknown>;
    cookiePreferences: string;
    dataRetentionInfo: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const userData = await getUserFromRequest(request);
    if (!userData) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required to export data",
        },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Get complete user data
    const user = await User.findById(userData.userId);
    if (!user || !user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found or inactive",
        },
        { status: 404 }
      );
    }

    // Fetch all user-related data in parallel
    const [userSettings, invoices, costs] = await Promise.all([
      UserSettings.findOne({ userId: userData.userId }),
      Invoice.find({ userId: userData.userId }).sort({ date: -1 }),
      Cost.find({ userId: userData.userId }).sort({ date: -1 }),
    ]);

    // Calculate statistics
    const totalRevenue = invoices.reduce(
      (sum, invoice) => sum + (invoice.amount || 0),
      0
    );
    const totalExpenses = costs.reduce(
      (sum, cost) => sum + (cost.amount || 0),
      0
    );
    const accountAge = user.createdAt
      ? Math.floor(
          (new Date().getTime() - new Date(user.createdAt).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

    // Prepare export data (remove sensitive information)
    const exportData: UserDataExport = {
      exportInfo: {
        exportDate: new Date().toISOString(),
        exportVersion: "1.0",
        dataController:
          "PIVABalance - Sistema di gestione finanziaria per Partite IVA",
        userRights:
          "Per esercitare i tuoi diritti GDPR, contatta privacy@pivabalance.com",
      },
      personalData: {
        profile: {
          id: user._id,
          email: user.email,
          name: user.name,
          // Exclude password hash for security
          googleId: user.googleId || null,
        },
        settings: userSettings
          ? {
              taxRegime: userSettings.taxRegime,
              substituteRate: userSettings.substituteRate,
              profitabilityRate: userSettings.profitabilityRate,
              pensionSystem: userSettings.pensionSystem,
              professionalFundId: userSettings.professionalFundId,
              inpsRateType: userSettings.inpsRateType,
              // customInpsRate: userSettings.customInpsRate, // Property doesn't exist
              updatedAt: userSettings.updatedAt,
            }
          : null,
      },
      businessData: {
        invoices: invoices.map((invoice) => ({
          id: invoice._id,
          number: invoice.number,
          // client: invoice.client, // Property doesn't exist
          amount: invoice.amount,
          // date: invoice.date, // Property doesn't exist
          // description: invoice.description, // Property doesn't exist
          // paid: invoice.paid, // Property doesn't exist
          // paidDate: invoice.paidDate, // Property doesn't exist
          createdAt: invoice.createdAt,
          updatedAt: invoice.updatedAt,
        })),
        costs: costs.map((cost) => ({
          id: cost._id,
          description: cost.description,
          amount: cost.amount,
          date: cost.date,
          // category: cost.category, // Property doesn't exist
          // deductible: cost.deductible, // Property doesn't exist
          createdAt: cost.createdAt,
          updatedAt: cost.updatedAt,
        })),
        statistics: {
          totalInvoices: invoices.length,
          totalCosts: costs.length,
          totalRevenue,
          totalExpenses,
          accountAge,
        },
      },
      systemData: {
        accountCreated: user.createdAt?.toISOString() || "N/A",
        lastLogin: user.lastLogin?.toISOString() || "Never",
        role: user.role || "user",
        isActive: user.isActive,
        createdBy: user.createdBy || null,
      },
      privacyData: {
        consentRecords: {
          info: "Cookie consent data is stored locally in your browser (localStorage)",
        },
        cookiePreferences:
          "Manage your cookie preferences in Account Settings → Privacy e Cookie",
        dataRetentionInfo:
          "I tuoi dati personali vengono conservati per la durata dell&apos;account. I dati finanziari vengono conservati per 10 anni come richiesto dalla normativa fiscale italiana.",
      },
    };

    // Log the export request for audit purposes
    console.warn(
      `Data export requested by user ${userData.userId} (${
        user.email
      }) at ${new Date().toISOString()}`
    );

    // Set appropriate headers for download
    const response = NextResponse.json({
      success: true,
      message: "Data export completed successfully",
      data: exportData,
    });

    // Add headers to suggest filename for download
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="pivabalance-data-export-${
        userData.userId
      }-${Date.now()}.json"`
    );
    response.headers.set("Content-Type", "application/json");

    return response;
  } catch (error) {
    console.error("Data export error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error during data export",
      },
      { status: 500 }
    );
  }
}
