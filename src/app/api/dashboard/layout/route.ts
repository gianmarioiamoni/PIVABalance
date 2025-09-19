/**
 * Dashboard Layout API Routes
 *
 * SRP: Handles ONLY dashboard layout CRUD operations
 * RESTful API for dashboard layout management
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database/mongodb";
import { DashboardLayout } from "@/models/DashboardLayout";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { validateSchema } from "@/lib/validations/schemas";
import { z } from "zod";

/**
 * Dashboard Layout Validation Schema
 * SRP: Handles only layout data validation
 */
const dashboardLayoutSchema = z.object({
  name: z
    .string()
    .min(1, "Layout name is required")
    .max(100, "Layout name too long"),
  isDefault: z.boolean().optional().default(false),
  widgets: z
    .array(
      z.object({
        id: z.string(),
        type: z.string(),
        title: z.string().max(100),
        size: z.enum(["small", "medium", "large", "full"]),
        position: z.object({
          x: z.number().min(0),
          y: z.number().min(0),
          w: z.number().min(1),
          h: z.number().min(1),
        }),
        isVisible: z.boolean().default(true),
        refreshInterval: z.number().min(30).max(3600).optional(),
        customSettings: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .max(20, "Cannot have more than 20 widgets"),
  layoutSettings: z.object({
    columns: z.number().min(1).max(24).default(12),
    rowHeight: z.number().min(50).max(500).default(150),
    margin: z.array(z.number()).length(2).default([16, 16]),
    containerPadding: z.array(z.number()).length(2).default([16, 16]),
    breakpoints: z.record(z.string(), z.number()).optional(),
  }),
});

/**
 * GET /api/dashboard/layout
 * Get user's dashboard layouts
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const layoutId = searchParams.get("id");
    const defaultOnly = searchParams.get("default") === "true";

    let layouts: unknown[] = [];

    if (layoutId) {
      // Handle special case for "default" layoutId
      if (layoutId === "default") {
        // Get default layout for the user
        const defaultLayout = await DashboardLayout.findOne({
          userId: userData.userId,
          isDefault: true,
        }).lean();

        if (!defaultLayout) {
          // No default layout exists, return empty array to trigger default creation
          layouts = [];
        } else {
          layouts = [defaultLayout];
        }
      } else {
        // Get specific layout by MongoDB ObjectId
        const layout = await DashboardLayout.findOne({
          _id: layoutId,
          userId: userData.userId,
        }).lean();

        if (!layout) {
          return NextResponse.json(
            {
              success: false,
              message: "Layout non trovato",
            },
            { status: 404 }
          );
        }

        layouts = [layout];
      }
    } else if (defaultOnly) {
      // Get default layout only
      const defaultLayout = await DashboardLayout.findOne({
        userId: userData.userId,
        isDefault: true,
      }).lean();

      if (!defaultLayout) {
        // Return system default layout
        return NextResponse.json({
          success: true,
          data: null, // Frontend will use system default
          message: "Nessun layout personalizzato trovato",
        });
      }

      layouts = [defaultLayout];
    } else {
      // Get all user layouts
      layouts = await DashboardLayout.find({
        userId: userData.userId,
      })
        .sort({ isDefault: -1, updatedAt: -1 })
        .lean();
    }

    return NextResponse.json({
      success: true,
      data:
        layouts.length === 0
          ? null
          : layouts.length === 1
          ? layouts[0]
          : layouts,
    });
  } catch (error) {
    console.error("Dashboard layout GET error:", error);
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
 * POST /api/dashboard/layout
 * Create new dashboard layout
 */
export async function POST(request: NextRequest) {
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

    // Parse and validate request body
    const body = await request.json();
    const validatedData = validateSchema(dashboardLayoutSchema, body);

    // If this is set as default, unset other default layouts
    if (validatedData.isDefault) {
      await DashboardLayout.updateMany(
        { userId: userData.userId, isDefault: true },
        { isDefault: false }
      );
    }

    // Create new layout
    const layout = new DashboardLayout({
      userId: userData.userId,
      ...validatedData,
    });

    await layout.save();

    return NextResponse.json(
      {
        success: true,
        message: "Layout creato con successo",
        data: layout.toJSON(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Dashboard layout POST error:", error);

    // Handle validation errors
    if (error instanceof Error && error.message.includes("validation failed")) {
      return NextResponse.json(
        {
          success: false,
          message: "Dati del layout non validi",
          errors: [error.message],
        },
        { status: 400 }
      );
    }

    // Handle duplicate name error
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json(
        {
          success: false,
          message: "Esiste già un layout con questo nome",
        },
        { status: 409 }
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

/**
 * PUT /api/dashboard/layout
 * Update existing dashboard layout
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

    // Parse and validate request body
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID layout richiesto",
        },
        { status: 400 }
      );
    }

    const validatedData = validateSchema(dashboardLayoutSchema, updateData);

    // Find and verify ownership
    const existingLayout = await DashboardLayout.findOne({
      _id: id,
      userId: userData.userId,
    });

    if (!existingLayout) {
      return NextResponse.json(
        {
          success: false,
          message: "Layout non trovato",
        },
        { status: 404 }
      );
    }

    // If this is set as default, unset other default layouts
    if (validatedData.isDefault && !existingLayout.isDefault) {
      await DashboardLayout.updateMany(
        { userId: userData.userId, isDefault: true },
        { isDefault: false }
      );
    }

    // Update layout
    Object.assign(existingLayout, validatedData);
    await existingLayout.save();

    return NextResponse.json({
      success: true,
      message: "Layout aggiornato con successo",
      data: existingLayout.toJSON(),
    });
  } catch (error) {
    console.error("Dashboard layout PUT error:", error);

    // Handle validation errors
    if (error instanceof Error && error.message.includes("validation failed")) {
      return NextResponse.json(
        {
          success: false,
          message: "Dati del layout non validi",
          errors: [error.message],
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

/**
 * DELETE /api/dashboard/layout
 * Delete dashboard layout
 */
export async function DELETE(request: NextRequest) {
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

    // Get layout ID from query params
    const { searchParams } = new URL(request.url);
    const layoutId = searchParams.get("id");

    if (!layoutId) {
      return NextResponse.json(
        {
          success: false,
          message: "ID layout richiesto",
        },
        { status: 400 }
      );
    }

    // Find and verify ownership
    const layout = await DashboardLayout.findOne({
      _id: layoutId,
      userId: userData.userId,
    });

    if (!layout) {
      return NextResponse.json(
        {
          success: false,
          message: "Layout non trovato",
        },
        { status: 404 }
      );
    }

    // Prevent deletion of default layout
    if (layout.isDefault) {
      return NextResponse.json(
        {
          success: false,
          message: "Impossibile eliminare il layout predefinito",
        },
        { status: 400 }
      );
    }

    // Delete layout
    await DashboardLayout.findByIdAndDelete(layoutId);

    return NextResponse.json({
      success: true,
      message: "Layout eliminato con successo",
    });
  } catch (error) {
    console.error("Dashboard layout DELETE error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Errore interno del server",
      },
      { status: 500 }
    );
  }
}
