import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { connectDB } from "@/lib/database/mongodb";
import { Donation } from "@/models/Donation";
import { sendDonationReceipt } from "@/lib/email/donation-receipt";

/**
 * Initialize Stripe with webhook endpoint secret
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

/**
 * POST /api/donations/webhook
 * Stripe webhook handler for payment confirmations
 *
 * Handles:
 * - payment_intent.succeeded
 * - payment_intent.payment_failed
 * - payment_intent.canceled
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      console.error("No Stripe signature found");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    await connectDB();

    // Handle different event types
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.canceled":
        await handlePaymentCanceled(event.data.object as Stripe.PaymentIntent);
        break;

      default:
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  try {
    const donation = await Donation.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (!donation) {
      console.error(
        `Donation not found for payment intent: ${paymentIntent.id}`
      );
      return;
    }

    // Update donation status
    donation.status = "succeeded";
    donation.processedAt = new Date();

    // Extract payment method info from latest charge
    const latestCharge = paymentIntent.latest_charge;
    if (latestCharge && typeof latestCharge === "object") {
      donation.paymentMethod =
        (latestCharge as { payment_method_details?: { type?: string } })
          .payment_method_details?.type || "card";
    }

    await donation.save();

    // Log donation confirmation for monitoring
    console.warn(
      `✅ Donation confirmed: ${donation._id} - €${(
        paymentIntent.amount / 100
      ).toFixed(2)}`
    );

    // Send thank you email if donor provided email and consented
    if (
      donation.donorEmail &&
      donation.consentToContact &&
      !donation.isAnonymous
    ) {
      try {
        await sendDonationReceipt({
          donorName: donation.donorName,
          donorEmail: donation.donorEmail,
          amount: donation.amount,
          currency: donation.currency,
          donationId: String(donation._id),
          message: donation.message,
          isAnonymous: donation.isAnonymous,
        });
        // Debug: Thank you email sent
      } catch (emailError) {
        console.error("Error sending thank you email:", emailError);
      }
    }
  } catch (error) {
    console.error("Error handling payment success:", error);
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  try {
    const donation = await Donation.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (!donation) {
      console.error(
        `Donation not found for payment intent: ${paymentIntent.id}`
      );
      return;
    }

    donation.status = "failed";
    donation.processedAt = new Date();
    await donation.save();

    // Log donation failure for monitoring
    console.warn(
      `❌ Donation failed: ${donation._id} - €${(
        paymentIntent.amount / 100
      ).toFixed(2)}`
    );
  } catch (error) {
    console.error("Error handling payment failure:", error);
  }
}

/**
 * Handle canceled payment
 */
async function handlePaymentCanceled(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  try {
    const donation = await Donation.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (!donation) {
      console.error(
        `Donation not found for payment intent: ${paymentIntent.id}`
      );
      return;
    }

    donation.status = "canceled";
    donation.processedAt = new Date();
    await donation.save();

    // Log donation cancellation for monitoring
    console.warn(
      `🚫 Donation canceled: ${donation._id} - €${(
        paymentIntent.amount / 100
      ).toFixed(2)}`
    );
  } catch (error) {
    console.error("Error handling payment cancellation:", error);
  }
}

/**
 * GET method not allowed
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
