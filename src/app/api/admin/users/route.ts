import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/authorization";
import { connectDB } from "@/lib/database/mongodb";
import { User } from "@/models/User";
import { ApiResponse, UserResponse } from "@/types";

/**
 * Admin Users Management API
 *
 * GET /api/admin/users - List all users (admin only)
 * Provides user management functionality for administrators.
 *
 * Security:
 * - Requires admin role or higher
 * - Excludes sensitive information (passwords)
 * - Includes pagination for large user lists
 */

export async function GET(
  request: NextRequest
): Promise<
  NextResponse<ApiResponse<{ users: UserResponse[]; total: number }>>
> {
  try {
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if ("error" in authResult) {
      return NextResponse.json(
        {
          success: false,
          message:
            typeof authResult.error === "string"
              ? authResult.error
              : "Authentication failed",
        },
        { status: 401 }
      );
    }

    // Authentication successful

    // Parse query parameters for pagination and filtering
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const search = url.searchParams.get("search") || "";
    const role = url.searchParams.get("role") || "";
    const active = url.searchParams.get("active");

    // Build query filters
    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role && ["user", "admin", "super_admin"].includes(role)) {
      query.role = role;
    }

    if (active !== null && active !== undefined) {
      query.isActive = active === "true";
    }

    // Connect to database
    await connectDB();

    // Get total count for pagination
    const total = await User.countDocuments(query);

    // Get users with pagination
    const users = await User.find(query)
      .select("-password -__v") // Exclude sensitive fields
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Format user data for response
    const formattedUsers: UserResponse[] = users.map((user) => ({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role || "user",
      isActive: user.isActive !== false,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    }));

    return NextResponse.json(
      {
        success: true,
        data: {
          users: formattedUsers,
          total,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
