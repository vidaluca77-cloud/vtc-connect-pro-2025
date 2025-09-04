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
};

export default nextConfig;
