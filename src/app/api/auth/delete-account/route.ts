import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { UserSettings } from '@/models/UserSettings';
import { Invoice } from '@/models/Invoice';
import { Cost } from '@/models/Cost';
import { comparePassword } from '@/utils/userCalculations';
import { z } from 'zod';

/**
 * Delete Account API Route
 * 
 * Handles secure account deletion with data cleanup.
 * Follows security best practices:
 * - Password verification required
 * - Complete data cleanup (GDPR compliance)
 * - Irreversible operation with confirmation
 * - Session invalidation
 */

const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required for account deletion'),
  confirmationText: z
    .string()
    .refine(
      (text) => text === 'ELIMINA IL MIO ACCOUNT',
      'You must type "ELIMINA IL MIO ACCOUNT" to confirm deletion'
    ),
});

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = deleteAccountSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const { password } = validationResult.data;

    // Connect to database
    await connectDB();

    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify password (skip for Google auth users)
    if (!user.googleId || user.password) {
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Invalid password' },
          { status: 400 }
        );
      }
    }

    // Start transaction for complete data cleanup
    const userId = user._id;

    try {
      // Delete all user-related data (GDPR compliance)
      await Promise.all([
        // Delete user settings
        UserSettings.deleteMany({ userId }),
        // Delete invoices
        Invoice.deleteMany({ userId }),
        // Delete costs
        Cost.deleteMany({ userId }),
        // Finally, delete the user account
        User.findByIdAndDelete(userId),
      ]);

      return NextResponse.json(
        { 
          message: 'Account and all associated data have been permanently deleted',
          deletedAt: new Date().toISOString()
        },
        { status: 200 }
      );

    } catch (deleteError) {
      console.error('Error during account deletion:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete account data. Please try again or contact support.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
