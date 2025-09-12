/**
 * Security Audit API Route
 * SRP: Server-side security audit execution ONLY
 */

import { NextRequest, NextResponse } from 'next/server';
import { SecurityAuditService } from '@/services/securityAuditService';

/**
 * GET /api/security/audit
 * Perform security audit with server-side environment access
 */
export async function GET(_request: NextRequest) {
  try {
    // Perform security audit (this runs server-side with full env access)
    const auditReport = await SecurityAuditService.performSecurityAudit();

    return NextResponse.json({
      success: true,
      data: auditReport,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Security audit error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Security audit failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/security/audit
 * Trigger manual security audit
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { forceRefresh = false } = body;

    // Perform fresh security audit
    const auditReport = await SecurityAuditService.performSecurityAudit();

    // Log audit for monitoring
    console.warn(`Security audit completed: Score ${auditReport.score}/100, ${auditReport.vulnerabilities.length} vulnerabilities found`);

    return NextResponse.json({
      success: true,
      data: auditReport,
      timestamp: new Date().toISOString(),
      forced: forceRefresh,
    });
  } catch (error) {
    console.error('Manual security audit error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Manual security audit failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
