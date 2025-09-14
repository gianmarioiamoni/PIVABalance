import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database/mongodb";
import { User } from "@/models";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { ApiResponse, UserResponse } from "@/types";

/**
 * GET /api/auth/me
 * Get current authenticated user information
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<UserResponse>>> {
  try {
    // Connect to database
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

    // Find user in database
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

    // Return user information
    return NextResponse.json(
      {
        success: true,
        data: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || "user",
          isActive: user.isActive !== false,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get current user error:", error);

    // Handle token errors
    if (error instanceof Error) {
      if (error.message.includes("Token expired")) {
        return NextResponse.json(
          {
            success: false,
            message: "Token scaduto",
          },
          { status: 401 }
        );
      }

      if (error.message.includes("Invalid token")) {
        return NextResponse.json(
          {
            success: false,
            message: "Token non valido",
          },
          { status: 401 }
        );
      }
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
