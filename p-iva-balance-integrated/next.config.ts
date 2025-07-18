import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone output for production deployments if specified
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
  trailingSlash: true,
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

    return config;
  },
};

export default nextConfig;
