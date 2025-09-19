import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Stripe from "stripe";
import { connectDB } from "@/lib/database/mongodb";
import { Donation } from "@/models/Donation";
import { ApiResponse, DonationResponse } from "@/types";

/**
 * Confirm Donation Schema
 */
const confirmDonationSchema = z.object({
  paymentIntentId: z.string().min(1, "Payment Intent ID is required"),
});

/**
 * Initialize Stripe
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia",
});

/**
 * POST /api/donations/confirm
 * Confirms a donation after successful Stripe payment
 * Updates donation status and processes receipt
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<DonationResponse>>> {
  try {
    await connectDB();

    // Parse and validate request body
    const body = await request.json();
    const { paymentIntentId } = confirmDonationSchema.parse(body);

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        { success: false, message: "Payment not completed" },
        { status: 400 }
      );
    }

    // Find donation in database
    const donation = await Donation.findOne({
      stripePaymentIntentId: paymentIntentId,
    });

    if (!donation) {
      return NextResponse.json(
        { success: false, message: "Donation not found" },
        { status: 404 }
      );
    }

    // Update donation status
    donation.status = "succeeded";
    donation.processedAt = new Date();

    // Extract payment method from Stripe
    const latestCharge = paymentIntent.latest_charge;
    if (latestCharge && typeof latestCharge === "object") {
      const chargeDetails = latestCharge as {
        payment_method_details?: { type?: string };
        billing_details?: { address?: { country?: string } };
      };
      if (chargeDetails.payment_method_details?.type) {
        donation.paymentMethod = chargeDetails.payment_method_details.type;
      }

      // Extract country from Stripe (for anonymized analytics)
      if (chargeDetails.billing_details?.address?.country) {
        donation.country = chargeDetails.billing_details.address.country;
      }
    }

    await donation.save();

    // Prepare response (GDPR compliant - removes sensitive data)
    const response: DonationResponse = {
      id: String(donation._id),
      amount: donation.amount,
      currency: donation.currency,
      status: donation.status,
      donorName: donation.isAnonymous ? undefined : donation.donorName,
      isAnonymous: donation.isAnonymous,
      donationType: donation.donationType,
      message: donation.message,
      paymentMethod: donation.paymentMethod,
      createdAt: donation.createdAt.toISOString(),
      processedAt: donation.processedAt?.toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: response,
        message: "Donation confirmed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Confirm donation error:", error);

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
          message: "Payment verification error",
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
