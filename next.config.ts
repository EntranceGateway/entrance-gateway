import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  
  // Optimize for lower memory usage
  experimental: {
    optimizePackageImports: ['react', 'react-dom', 'clsx', 'gsap'],
  },
};

export default nextConfig;
