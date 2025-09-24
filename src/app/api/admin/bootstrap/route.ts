import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database/mongodb";
import { User } from "@/models/User";
import { ApiResponse } from "@/types";

/**
 * Bootstrap API - Emergency Super Admin Promotion
 * 
 * This is a temporary endpoint to fix super admin role issues.
 * Should be removed after initial setup is complete.
 */

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ message: string }>>> {
  try {
    // Only allow in development or if explicitly enabled
    const allowBootstrap = 
      process.env.NODE_ENV === "development" ||
      process.env.ALLOW_INIT_API === "true" ||
      process.env.ALLOW_BOOTSTRAP === "true";

    if (!allowBootstrap) {
      return NextResponse.json(
        {
          success: false,
          message: "Bootstrap API is disabled in production",
        },
        { status: 403 }
      );
    }

    // Get the super admin email from environment
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    
    if (!superAdminEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "SUPER_ADMIN_EMAIL environment variable not set",
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find the user by email
    const user = await User.findOne({ email: superAdminEmail });
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: `User with email ${superAdminEmail} not found. Please register first.`,
        },
        { status: 404 }
      );
    }

    // Update user role to super_admin
    user.role = "super_admin";
    user.isActive = true;
    await user.save();

    // Log the action
    console.log(`🔧 Bootstrap: Promoted ${superAdminEmail} to super_admin`);

    return NextResponse.json(
      {
        success: true,
        data: {
          message: `Successfully promoted ${superAdminEmail} to super_admin`,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Bootstrap error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Bootstrap operation failed",
      },
      { status: 500 }
    );
  }
}
