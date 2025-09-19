import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Stripe from "stripe";
import { connectDB } from "@/lib/database/mongodb";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { Donation } from "@/models/Donation";
import { ApiResponse, DonationRequest, StripePaymentIntent } from "@/types";

/**
 * Donation Request Schema
 * Zod validation for donation creation with GDPR compliance
 */
const donationRequestSchema = z.object({
  amount: z
    .number()
    .int("Amount must be an integer")
    .min(100, "Minimum donation is €1.00")
    .max(10000000, "Maximum donation is €100,000"),
  donorEmail: z
    .string()
    .email("Invalid email format")
    .optional()
    .or(z.literal("")),
  donorName: z
    .string()
    .min(1, "Name cannot be empty")
    .max(100, "Name too long")
    .optional()
    .or(z.literal("")),
  isAnonymous: z.boolean(),
  message: z.string().max(500, "Message too long").optional().or(z.literal("")),
  consentToContact: z.boolean(),
  source: z.enum(["web", "mobile"]),
});

/**
 * Initialize Stripe
 * Uses server-side secret key for secure payment processing
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia",
});

/**
 * POST /api/donations/create-payment-intent
 * Creates a Stripe Payment Intent for donation processing
 *
 * GDPR Compliant:
 * - Minimal data collection
 * - Explicit consent handling
 * - Anonymous donation support
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<StripePaymentIntent>>> {
  try {
    await connectDB();

    // Parse and validate request body
    const body = await request.json();
    const validatedData = donationRequestSchema.parse(body) as DonationRequest;

    // Get user data if authenticated (optional for donations)
    const userData = await getUserFromRequest(request);
    const userId = userData?.userId;

    // GDPR Compliance: Handle anonymous donations
    if (validatedData.isAnonymous) {
      validatedData.donorEmail = undefined;
      validatedData.donorName = undefined;
      validatedData.consentToContact = false;
    }

    // Validate email if provided and not anonymous
    if (!validatedData.isAnonymous && validatedData.donorEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(validatedData.donorEmail)) {
        return NextResponse.json(
          { success: false, message: "Invalid email format" },
          { status: 400 }
        );
      }
    }

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: validatedData.amount,
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        type: "donation",
        anonymous: validatedData.isAnonymous.toString(),
        source: validatedData.source,
        ...(validatedData.message && { message: validatedData.message }),
        ...(userId && { userId }),
      },
      description: `PIVABalance Donation${
        validatedData.message ? ` - ${validatedData.message}` : ""
      }`,
      receipt_email: validatedData.isAnonymous
        ? undefined
        : validatedData.donorEmail,
    });

    // Create donation record in database
    const donationData = {
      stripePaymentIntentId: paymentIntent.id,
      amount: validatedData.amount,
      currency: "eur",
      status: "pending" as const,
      donorEmail: validatedData.isAnonymous
        ? undefined
        : validatedData.donorEmail,
      donorName: validatedData.isAnonymous
        ? undefined
        : validatedData.donorName,
      isAnonymous: validatedData.isAnonymous,
      userId,
      donationType: "one-time" as const,
      message: validatedData.message,
      consentToContact: validatedData.consentToContact,
      paymentMethod: "card", // Will be updated after payment
      source: validatedData.source,
    };

    const donation = new Donation(donationData);
    await donation.save();

    // Return Stripe client secret for frontend
    const response: StripePaymentIntent = {
      id: paymentIntent.id,
      client_secret: paymentIntent.client_secret || "",
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    };

    return NextResponse.json(
      {
        success: true,
        data: response,
        message: "Payment intent created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create payment intent error:", error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: error.issues.map(
            (e) => `${String(e.path.join("."))}: ${e.message}`
          ),
        },
        { status: 400 }
      );
    }

    // Handle Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment processing error",
          error: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/donations/create-payment-intent
 * Returns configuration for Stripe Elements
 */
export async function GET(): Promise<
  NextResponse<ApiResponse<{ publishableKey: string }>>
> {
  try {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      return NextResponse.json(
        { success: false, message: "Stripe configuration missing" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: { publishableKey },
        message: "Stripe configuration retrieved",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Stripe config error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
