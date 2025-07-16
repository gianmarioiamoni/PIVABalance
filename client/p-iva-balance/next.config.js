/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Enhanced security headers for production
   * Updated for Next.js API Routes (no external backend)
   */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; connect-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  },

  /**
   * Experimental features for better performance
   */
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },

  /**
   * Image optimization configuration
   */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  /**
   * Environment variables configuration
   */
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  /**
   * TypeScript configuration
   */
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors. Only enable in emergencies.
    ignoreBuildErrors: false,
  },

  /**
   * ESLint configuration
   */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },

  /**
   * Bundle analyzer (enable for debugging)
   */
  // ...(process.env.ANALYZE === 'true' && {
  //   webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
  //     if (!isServer) {
  //       config.plugins.push(
  //         new (require('@next/bundle-analyzer'))({
  //           enabled: true,
  //         })
  //       );
  //     }
  //     return config;
  //   },
  // }),
}

module.exports = nextConfig
