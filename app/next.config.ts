import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for Vercel deployment
  experimental: {
    // Enable optimizations for production builds
    optimizePackageImports: ['@clerk/nextjs'],
  },
  // Ensure images work properly on Vercel
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },
  // Use standalone output for better compatibility
  output: 'standalone',
  // Disable ESLint during build for now
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
