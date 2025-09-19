import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/database/mongodb";
import { User } from "@/models/User";
import { comparePassword, hashPassword } from "@/utils/userCalculations";
import { z } from "zod";

/**
 * Change Password API Route
 *
 * Handles secure password changes with validation.
 * Follows security best practices:
 * - Requires current password verification
 * - Strong password validation
 * - Session authentication
 * - Rate limiting considerations
 */

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirmation do not match",
    path: ["confirmPassword"],
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
    const validationResult = changePasswordSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = validationResult.data;

    // Connect to database
    await connectDB();

    // Find user
    const user = await User.findById(userData.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has Google auth (no password to change)
    if (user.googleId && !user.password) {
      return NextResponse.json(
        { error: "Cannot change password for Google authenticated accounts" },
        { status: 400 }
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Check if new password is different from current
    const isSamePassword = await comparePassword(newPassword, user.password);
    if (isSamePassword) {
      return NextResponse.json(
        { error: "New password must be different from current password" },
        { status: 400 }
      );
    }

    // Hash new password and update user
    const hashedNewPassword = await hashPassword(newPassword);
    await User.findByIdAndUpdate(user._id, {
      password: hashedNewPassword,
    });

    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
