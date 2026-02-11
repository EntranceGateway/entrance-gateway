import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  
  // Optimize for lower memory usage
  experimental: {
    optimizePackageImports: ['react', 'react-dom', 'clsx', 'gsap'],
  },
  
  // Use SWC minification (faster, less memory)
  swcMinify: true,
};

export default nextConfig;
