import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.entrancegateway.com',
        pathname: '/api/v1/resources/**',
      },
      {
        protocol: 'https',
        hostname: 'entrance-gateway.fa3d020396e83193c3a9edec52dd9e71.r2.cloudflarestorage.com',
        pathname: '/**',
      },
    ],
  },
  
  // Optimize for lower memory usage
  experimental: {
    optimizePackageImports: ['react', 'react-dom', 'clsx', 'gsap'],
  },
};

export default nextConfig;
