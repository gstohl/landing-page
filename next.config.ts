import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ensure ESLint runs during build (same as production)
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Ensure TypeScript type checking during build (same as production)
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
