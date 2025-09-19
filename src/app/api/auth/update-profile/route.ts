import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/database/mongodb";
import { User } from "@/models/User";
import { z } from "zod";

/**
 * Update Profile API Route
 *
 * Handles user profile updates (name, company info).
 * Follows security and validation best practices:
 * - Session authentication required
 * - Input validation and sanitization
 * - Prevents email modification (security)
 */

const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name cannot exceed 100 characters")
    .regex(
      /^[a-zA-ZÀ-ÿ\s'-]+$/,
      "Name can only contain letters, spaces, apostrophes, and hyphens"
    )
    .trim(),
});

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const userData = await getUserFromRequest(request);
    if (!userData) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateProfileSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name } = validationResult.data;

    // Connect to database
    await connectDB();

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      userData.userId,
      { name: name },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return updated user data (without sensitive information)
    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: {
          id: updatedUser._id,
          email: updatedUser.email,
          name: updatedUser.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
