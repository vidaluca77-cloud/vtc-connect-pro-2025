const nextConfig = {
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
  // Disable ESLint during build for now
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
