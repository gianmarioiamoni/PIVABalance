/**
 * Next.js Middleware
 * SRP: Request/Response middleware processing ONLY
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * CORS configuration
 */
const CORS_CONFIG = {
  allowedOrigins: process.env.NODE_ENV === 'production' 
    ? [process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-API-Key',
    'X-CSRF-Token',
  ],
  exposedHeaders: [
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
  ],
  credentials: true,
  maxAge: 86400, // 24 hours
};

/**
 * Apply CORS headers to response
 */
function applyCorsHeaders(response: NextResponse, origin: string | null): NextResponse {
  // Check if origin is allowed
  const isAllowedOrigin = origin && CORS_CONFIG.allowedOrigins.includes(origin);
  
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  
  response.headers.set('Access-Control-Allow-Methods', CORS_CONFIG.allowedMethods.join(', '));
  response.headers.set('Access-Control-Allow-Headers', CORS_CONFIG.allowedHeaders.join(', '));
  response.headers.set('Access-Control-Expose-Headers', CORS_CONFIG.exposedHeaders.join(', '));
  response.headers.set('Access-Control-Max-Age', CORS_CONFIG.maxAge.toString());
  
  if (CORS_CONFIG.credentials) {
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }
  
  return response;
}

/**
 * Main middleware function
 */
export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  const pathname = request.nextUrl.pathname;

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });
    return applyCorsHeaders(response, origin);
  }

  // Apply security headers for API routes
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    // Apply CORS
    applyCorsHeaders(response, origin);
    
    // Additional API security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Prevent caching of sensitive API responses
    if (pathname.includes('/auth/') || pathname.includes('/user/')) {
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
    }
    
    return response;
  }

  // For non-API routes, just continue
  return NextResponse.next();
}

/**
 * Middleware configuration
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
