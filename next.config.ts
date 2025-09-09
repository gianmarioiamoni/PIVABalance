import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Minimal configuration to avoid webpack cache issues
  experimental: {
    optimizePackageImports: ["lucide-react", "@heroicons/react"],
  },
};

export default nextConfig;
