import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone output to avoid SSR issues
  output: "standalone",
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
