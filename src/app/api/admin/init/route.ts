import { NextRequest, NextResponse } from "next/server";
import { setupSuperAdmin } from "@/lib/init/setupSuperAdmin";
import { ApiResponse } from "@/types";

/**
 * Admin Initialization API
 *
 * POST /api/admin/init - Initialize system (super admin setup)
 *
 * This endpoint allows manual system initialization.
 * Should be protected and only used during initial setup.
 *
 * Security:
 * - Only works if no super admin exists
 * - Requires specific environment variables
 * - Should be disabled in production after initial setup
 */

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ message: string }>>> {
  try {
    // Check if initialization is allowed
    const initAllowed =
      process.env.ALLOW_INIT_API === "true" ||
      process.env.NODE_ENV === "development";

    if (!initAllowed) {
      return NextResponse.json(
        {
          success: false,
          message: "Initialization API is disabled",
        },
        { status: 403 }
      );
    }

    // Check if required environment variables are set
    if (!process.env.SUPER_ADMIN_EMAIL || !process.env.SUPER_ADMIN_PASSWORD) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Super admin credentials not configured in environment variables",
        },
        { status: 400 }
      );
    }

    // Run initialization
    await setupSuperAdmin();

    return NextResponse.json(
      {
        success: true,
        data: {
          message: "System initialization completed successfully",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Initialization error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "System initialization failed",
      },
      { status: 500 }
    );
  }
}
