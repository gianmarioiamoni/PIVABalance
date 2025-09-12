/**
 * Rate Limiter Utility
 * SRP: Request rate limiting and protection ONLY
 */

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyGenerator?: (identifier: string) => string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or similar
 */
class InMemoryRateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    
    // Cleanup expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Check if request is allowed
   */
  isAllowed(identifier: string): { allowed: boolean; resetTime: number; remaining: number } {
    const key = this.config.keyGenerator ? this.config.keyGenerator(identifier) : identifier;
    const now = Date.now();
    
    let entry = this.store.get(key);
    
    // Create new entry or reset if window expired
    if (!entry || now >= entry.resetTime) {
      entry = {
        count: 1,
        resetTime: now + this.config.windowMs,
      };
      this.store.set(key, entry);
      
      return {
        allowed: true,
        resetTime: entry.resetTime,
        remaining: this.config.maxRequests - 1,
      };
    }
    
    // Increment count
    entry.count++;
    this.store.set(key, entry);
    
    const allowed = entry.count <= this.config.maxRequests;
    const remaining = Math.max(0, this.config.maxRequests - entry.count);
    
    return {
      allowed,
      resetTime: entry.resetTime,
      remaining,
    };
  }

  /**
   * Get current status without incrementing
   */
  getStatus(identifier: string): { count: number; resetTime: number; remaining: number } {
    const key = this.config.keyGenerator ? this.config.keyGenerator(identifier) : identifier;
    const entry = this.store.get(key);
    
    if (!entry || Date.now() >= entry.resetTime) {
      return {
        count: 0,
        resetTime: Date.now() + this.config.windowMs,
        remaining: this.config.maxRequests,
      };
    }
    
    return {
      count: entry.count,
      resetTime: entry.resetTime,
      remaining: Math.max(0, this.config.maxRequests - entry.count),
    };
  }

  /**
   * Reset rate limit for identifier
   */
  reset(identifier: string): void {
    const key = this.config.keyGenerator ? this.config.keyGenerator(identifier) : identifier;
    this.store.delete(key);
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now >= entry.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

// Rate limiter instances
export const authRateLimiter = new InMemoryRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 login attempts per 15 minutes
  keyGenerator: (ip) => `auth:${ip}`,
});

export const apiRateLimiter = new InMemoryRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
  keyGenerator: (ip) => `api:${ip}`,
});

export const generalRateLimiter = new InMemoryRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 200, // 200 requests per minute
  keyGenerator: (ip) => `general:${ip}`,
});

/**
 * Get client IP address from request
 */
export function getClientIP(request: Request): string {
  // Check various headers for real IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp.trim();
  }
  
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }
  
  // Fallback to a default identifier
  return 'unknown';
}

/**
 * Apply rate limiting to API route
 */
export function withRateLimit(
  rateLimiter: InMemoryRateLimiter,
  handler: (request: Request) => Promise<Response>
) {
  return async (request: Request): Promise<Response> => {
    const clientIP = getClientIP(request);
    const { allowed, resetTime, remaining } = rateLimiter.isAllowed(clientIP);
    
    if (!allowed) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
          resetTime: new Date(resetTime).toISOString(),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': rateLimiter['config'].maxRequests.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': resetTime.toString(),
            'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }
    
    // Call the actual handler
    const response = await handler(request);
    
    // Add rate limit headers to successful responses
    response.headers.set('X-RateLimit-Limit', rateLimiter['config'].maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', resetTime.toString());
    
    return response;
  };
}
