import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database/mongodb";
import { User } from "@/models";
import { generateToken } from "@/lib/auth/jwt";
import {
  validateSchema,
  signInSchema,
  isValidationError,
} from "@/lib/validations/schemas";
import { SignInCredentials, ApiResponse, AuthResponse } from "@/types";
import { compareUserPassword } from "@/utils/userCalculations";

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<AuthResponse>>> {
  try {
    // Connect to database
    await connectDB();

    // Parse and validate request body
    const body = await request.json();
    const validatedData: SignInCredentials = validateSchema(signInSchema, body);

    // Find user by email
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Email o password non validi",
        },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await compareUserPassword(
      validatedData.password,
      user.password
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Email o password non validi",
        },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Login effettuato con successo",
        data: {
          token,
          user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);

    // Handle validation errors
    if (isValidationError(error)) {
      const errorMessages = error.errors.issues.map((err) => err.message);
      return NextResponse.json(
        {
          success: false,
          message: "Dati di login non validi",
          errors: errorMessages,
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
