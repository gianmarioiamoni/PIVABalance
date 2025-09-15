import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database/mongodb';
import { Donation } from '@/models/Donation';
import { ApiResponse, DonationStats } from '@/types';

/**
 * GET /api/donations/stats
 * Returns anonymized donation statistics for transparency
 * Public endpoint - no authentication required
 */
export async function GET(_request: NextRequest): Promise<NextResponse<ApiResponse<DonationStats>>> {
  try {
    await connectDB();

    // Get basic donation statistics
    const stats = await Donation.getDonationStats();

    // Get current month progress
    const now = new Date();
    const currentMonth = await Donation.getMonthlyDonations(now.getFullYear(), now.getMonth() + 1);

    // Monthly goal (configurable - could be moved to environment variables)
    const MONTHLY_GOAL = 50000; // €500.00 in cents

    // Calculate monthly progress percentage
    const monthlyProgress = MONTHLY_GOAL > 0 
      ? Math.min(100, (currentMonth.total / MONTHLY_GOAL) * 100)
      : 0;

    const response: DonationStats = {
      totalAmount: stats.totalAmount,
      totalCount: stats.totalCount,
      averageAmount: Math.round(stats.averageAmount || 0),
      lastDonation: stats.lastDonation?.toISOString() || null,
      monthlyGoal: MONTHLY_GOAL,
      monthlyProgress: Math.round(monthlyProgress * 100) / 100, // Round to 2 decimal places
    };

    // Add cache headers for performance
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600'); // 5 minutes cache

    return NextResponse.json(
      { 
        success: true, 
        data: response, 
        message: 'Donation statistics retrieved successfully' 
      },
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Get donation stats error:', error);

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/donations/stats?detailed=true
 * Returns detailed statistics for admin users (future feature)
 */
export async function GET_DETAILED(request: NextRequest): Promise<NextResponse<ApiResponse<unknown>>> {
  try {
    // This would require admin authentication
    // For now, return the same basic stats
    return GET(request);
    
  } catch (error) {
    console.error('Get detailed donation stats error:', error);

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
