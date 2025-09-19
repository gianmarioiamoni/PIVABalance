import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/authorization";
import { User } from "@/models/User";
import { connectDB } from "@/lib/database/mongodb";

/**
 * Admin User Management API Routes
 *
 * Handles individual user operations:
 * - PUT: Update user (role, status)
 * - DELETE: Delete user
 *
 * Security:
 * - Requires admin authentication
 * - Prevents super admin modification by other admins
 * - Validates all input data
 */

// Update user schema
const updateUserSchema = z.object({
  role: z.enum(["user", "admin", "super_admin"]).optional(),
  isActive: z.boolean().optional(),
  name: z
    .string()
    .min(1, "Nome richiesto")
    .max(100, "Nome troppo lungo")
    .optional(),
});

// PUT /api/admin/users/[userId] - Update user
export async function PUT(
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

    // Parse request body
    const body = await request.json();
    const validation = updateUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Dati non validi",
          errors: validation.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const updateData = validation.data;

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
    // 1. Prevent super admin modification (except by other super admins)
    if (
      targetUser.role === "super_admin" &&
      currentUser.role !== "super_admin"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Non puoi modificare un super amministratore",
        },
        { status: 403 }
      );
    }

    // 2. Prevent non-super-admin from creating super admins
    if (
      updateData.role === "super_admin" &&
      currentUser.role !== "super_admin"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Solo un super amministratore può assegnare questo ruolo",
        },
        { status: 403 }
      );
    }

    // 3. Prevent users from modifying themselves (avoid lockout)
    if (targetUser._id.toString() === currentUser.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Non puoi modificare il tuo stesso account",
        },
        { status: 403 }
      );
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...updateData,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Utente non trovato dopo l'aggiornamento",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Utente aggiornato con successo",
        data: {
          id: updatedUser._id.toString(),
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          isActive: updatedUser.isActive,
          lastLogin: updatedUser.lastLogin,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Errore interno del server",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[userId] - Delete user
export async function DELETE(
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
    // 1. Prevent super admin deletion (except by other super admins)
    if (
      targetUser.role === "super_admin" &&
      currentUser.role !== "super_admin"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Non puoi eliminare un super amministratore",
        },
        { status: 403 }
      );
    }

    // 2. Prevent self-deletion
    if (targetUser._id.toString() === currentUser.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Non puoi eliminare il tuo stesso account",
        },
        { status: 403 }
      );
    }

    // 3. Check if this is the last admin (prevent system lockout)
    const adminCount = await User.countDocuments({
      role: { $in: ["admin", "super_admin"] },
      isActive: true,
      _id: { $ne: userId },
    });

    if (
      adminCount === 0 &&
      (targetUser.role === "admin" || targetUser.role === "super_admin")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Non puoi eliminare l'ultimo amministratore del sistema",
        },
        { status: 403 }
      );
    }

    // Delete user and associated data
    // TODO: In a real app, you might want to:
    // - Soft delete instead of hard delete
    // - Archive user data
    // - Handle foreign key constraints

    await User.findByIdAndDelete(userId);

    return NextResponse.json(
      {
        success: true,
        message: "Utente eliminato con successo",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Errore interno del server",
      },
      { status: 500 }
    );
  }
}
