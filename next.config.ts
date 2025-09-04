import type { NextConfig } from "next";

// Bundle analyzer for performance auditing
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // Use standalone output for production deployments if specified
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
  trailingSlash: true,

  // Security headers for production hardening
  async headers() {
    if (process.env.NODE_ENV !== "production") {
      return [];
    }

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:",
          },
        ],
      },
    ];
  },

  webpack: (config, { isServer }) => {
    // Ensure proper handling of client-only modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Performance optimizations
    if (!isServer) {
      // Bundle splitting optimizations
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization?.splitChunks,
          chunks: "all",
          cacheGroups: {
            ...config.optimization?.splitChunks?.cacheGroups,
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all",
              maxSize: 244000, // 244KB max chunk size
            },
            charts: {
              test: /[\\/]src[\\/]components[\\/]charts[\\/]/,
              name: "charts",
              chunks: "all",
              priority: 10,
            },
            analytics: {
              test: /[\\/]src[\\/]components[\\/]analytics[\\/]/,
              name: "analytics",
              chunks: "all",
              priority: 10,
            },
          },
        },
      };
    }

    return config;
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Experimental features for performance
  experimental: {
    optimizePackageImports: ["lucide-react", "@heroicons/react"],
  },
};

export default withBundleAnalyzer(nextConfig);
