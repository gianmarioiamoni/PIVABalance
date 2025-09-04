/**
 * Health Check API Route
 * SRP: Application health monitoring ONLY
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/database/mongodb";

export interface HealthCheckResponse {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    database: HealthCheckResult;
    memory: HealthCheckResult;
    environment: HealthCheckResult;
  };
  performance: {
    responseTime: number;
    memoryUsage: NodeJS.MemoryUsage;
  };
}

interface HealthCheckResult {
  status: "pass" | "warn" | "fail";
  message: string;
  responseTime?: number;
}

/**
 * Health Check Service
 * SRP: System health validation ONLY
 */
class HealthCheckService {
  /**
   * Check database connectivity
   */
  static async checkDatabase(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      await connectDB();
      const responseTime = Date.now() - startTime;

      if (responseTime > 1000) {
        return {
          status: "warn",
          message: "Database connection slow",
          responseTime,
        };
      }

      return {
        status: "pass",
        message: "Database connection healthy",
        responseTime,
      };
    } catch (error) {
      return {
        status: "fail",
        message: `Database connection failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        responseTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Check memory usage
   */
  static checkMemory(): HealthCheckResult {
    const memUsage = process.memoryUsage();
    const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
    const heapTotalMB = memUsage.heapTotal / 1024 / 1024;
    const memoryUsagePercent = (heapUsedMB / heapTotalMB) * 100;

    if (memoryUsagePercent > 90) {
      return {
        status: "fail",
        message: `Critical memory usage: ${memoryUsagePercent.toFixed(1)}%`,
      };
    }

    if (memoryUsagePercent > 75) {
      return {
        status: "warn",
        message: `High memory usage: ${memoryUsagePercent.toFixed(1)}%`,
      };
    }

    return {
      status: "pass",
      message: `Memory usage healthy: ${memoryUsagePercent.toFixed(1)}%`,
    };
  }

  /**
   * Check environment configuration
   */
  static checkEnvironment(): HealthCheckResult {
    const requiredVars = ["NODE_ENV", "MONGODB_URI", "JWT_SECRET"];

    const missingVars = requiredVars.filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
      return {
        status: "fail",
        message: `Missing environment variables: ${missingVars.join(", ")}`,
      };
    }

    // Check JWT secret strength
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret && jwtSecret.length < 32) {
      return {
        status: "warn",
        message: "JWT secret should be at least 32 characters",
      };
    }

    return {
      status: "pass",
      message: "Environment configuration healthy",
    };
  }

  /**
   * Determine overall health status
   */
  static determineOverallStatus(
    checks: HealthCheckResponse["checks"]
  ): HealthCheckResponse["status"] {
    const results = Object.values(checks);

    if (results.some((check) => check.status === "fail")) {
      return "unhealthy";
    }

    if (results.some((check) => check.status === "warn")) {
      return "degraded";
    }

    return "healthy";
  }
}

/**
 * GET /api/health
 * Health check endpoint for monitoring and load balancer
 */
export async function GET(
  _request: NextRequest
): Promise<NextResponse<HealthCheckResponse>> {
  const startTime = Date.now();

  try {
    // Perform health checks
    const [databaseCheck, memoryCheck, environmentCheck] =
      await Promise.allSettled([
        HealthCheckService.checkDatabase(),
        Promise.resolve(HealthCheckService.checkMemory()),
        Promise.resolve(HealthCheckService.checkEnvironment()),
      ]);

    const checks = {
      database:
        databaseCheck.status === "fulfilled"
          ? databaseCheck.value
          : { status: "fail" as const, message: "Database check failed" },
      memory:
        memoryCheck.status === "fulfilled"
          ? memoryCheck.value
          : { status: "fail" as const, message: "Memory check failed" },
      environment:
        environmentCheck.status === "fulfilled"
          ? environmentCheck.value
          : { status: "fail" as const, message: "Environment check failed" },
    };

    const overallStatus = HealthCheckService.determineOverallStatus(checks);
    const responseTime = Date.now() - startTime;

    const response: HealthCheckResponse = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "0.1.0",
      uptime: process.uptime(),
      checks,
      performance: {
        responseTime,
        memoryUsage: process.memoryUsage(),
      },
    };

    // Set appropriate HTTP status based on health
    const httpStatus =
      overallStatus === "healthy"
        ? 200
        : overallStatus === "degraded"
        ? 200
        : 503;

    return NextResponse.json(response, { status: httpStatus });
  } catch (error) {
    console.error("Health check error:", error);

    const errorResponse: HealthCheckResponse = {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "0.1.0",
      uptime: process.uptime(),
      checks: {
        database: { status: "fail", message: "Health check failed" },
        memory: { status: "fail", message: "Health check failed" },
        environment: { status: "fail", message: "Health check failed" },
      },
      performance: {
        responseTime: Date.now() - startTime,
        memoryUsage: process.memoryUsage(),
      },
    };

    return NextResponse.json(errorResponse, { status: 503 });
  }
}
