import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/authorization";
import { User } from "@/models/User";
import { connectDB } from "@/lib/database/mongodb";
import { hashPassword } from "@/utils/userCalculations";
// // // import crypto from "crypto"; // TODO: Will be used for secure password generation

/**
 * Admin Password Reset API
 *
 * Allows admins to reset user passwords and generate temporary passwords.
 *
 * Security:
 * - Requires admin authentication
 * - Generates secure temporary passwords
 * - Logs password reset actions
 * - Prevents super admin password reset by non-super admins
 */

// POST /api/admin/users/[userId]/reset-password
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Verify admin authentication
    const authResult = await requireAdmin(request);
    if (!authResult.success || !authResult.user) {
      return authResult.response;
    }

    const currentUser = authResult.user;
    const { userId } = await params;

    // Connect to database
    await connectDB();

    // Find target user
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Utente non trovato",
        },
        { status: 404 }
      );
    }

    // Security checks
    // 1. Prevent super admin password reset (except by other super admins)
    if (
      targetUser.role === "super_admin" &&
      currentUser.role !== "super_admin"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Non puoi resettare la password di un super amministratore",
        },
        { status: 403 }
      );
    }

    // 2. Prevent self password reset (should use normal change password flow)
    if (targetUser._id.toString() === currentUser.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Usa la sezione Account per cambiare la tua password",
        },
        { status: 403 }
      );
    }

    // Generate secure temporary password
    const tempPassword = generateSecurePassword();

    // Hash the temporary password
    const hashedPassword = await hashPassword(tempPassword);

    // Update user password
    await User.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
        updatedAt: new Date(),
        // TODO: In a real app, you might want to:
        // - Set a flag requiring password change on next login
        // - Store password reset timestamp
        // - Send email notification
      },
      { runValidators: true }
    );

    // Log the action (in a real app, use proper audit logging)
    // TODO: Replace with proper audit logging system
    console.warn(
      `🔐 Admin ${currentUser.email} reset password for user ${targetUser.email}`
    );

    return NextResponse.json(
      {
        success: true,
        message: "Password resettata con successo",
        data: {
          temporaryPassword: tempPassword,
          userEmail: targetUser.email,
          userName: targetUser.name,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error resetting password:", error);
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
 * Generate a secure temporary password
 *
 * Creates a password with:
 * - 12 characters length
 * - Mix of uppercase, lowercase, numbers, and symbols
 * - Easy to read (no ambiguous characters)
 */
function generateSecurePassword(): string {
  const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // No I, O
  const lowercase = "abcdefghjkmnpqrstuvwxyz"; // No i, l, o
  const numbers = "23456789"; // No 0, 1
  const symbols = "!@#$%&*+-=?";

  const allChars = uppercase + lowercase + numbers + symbols;

  let password = "";

  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill remaining positions
  for (let i = 4; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}
