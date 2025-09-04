import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database/mongodb";
import { User } from "@/models";
import { generateToken } from "@/lib/auth/jwt";
import {
  validateSchema,
  signUpSchema,
  isValidationError,
} from "@/lib/validations/schemas";
import { findUserByEmail } from "@/utils/userQueries";
import { SignUpCredentials, ApiResponse, AuthResponse } from "@/types";

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<AuthResponse>>> {
  try {
    // Connect to database
    await connectDB();

    // Parse and validate request body
    const body = await request.json();
    const validatedData: SignUpCredentials = validateSchema(signUpSchema, body);

    // Check if user already exists
    const existingUser = await findUserByEmail(validatedData.email);
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email già registrata",
        },
        { status: 400 }
      );
    }

    // Create new user
    const user = new User({
      email: validatedData.email,
      password: validatedData.password,
      name: validatedData.name,
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Registrazione completata con successo",
        data: {
          token,
          user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    // Handle validation errors
    if (isValidationError(error)) {
      const errorMessages = error.errors.issues.map((err) => err.message);
      return NextResponse.json(
        {
          success: false,
          message: "Dati di registrazione non validi",
          errors: errorMessages,
        },
        { status: 400 }
      );
    }

    // Handle MongoDB duplicate key error
    if (error instanceof Error && error.message.includes("E11000")) {
      return NextResponse.json(
        {
          success: false,
          message: "Email già registrata",
        },
        { status: 400 }
      );
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
