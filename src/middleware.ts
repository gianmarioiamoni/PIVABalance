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
    : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-API-Key',
    'X-CSRF-Token',
    'Cache-Control',
    'Pragma',
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
 * Main middleware function (only for API routes)
 */
export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  const pathname = request.nextUrl.pathname;

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });
    return applyCorsHeaders(response, origin);
  }

  // This middleware only runs for API routes due to matcher config
  const response = NextResponse.next();
  
  // Apply CORS only in production or for cross-origin requests
  if (process.env.NODE_ENV === 'production' || (origin && !origin.includes('localhost'))) {
    applyCorsHeaders(response, origin);
  }
  
  // Additional API security headers (only in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  }
  
  // Prevent caching of sensitive API responses
  if (pathname.includes('/auth/') || pathname.includes('/user/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }
  
  return response;
}

/**
 * Middleware configuration
 */
export const config = {
  matcher: [
    /*
     * Match only API routes for security middleware
     * Exclude public endpoints and static files
     */
    '/api/((?!manifest|health).*)',
  ],
};
