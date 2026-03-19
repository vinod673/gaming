/** @type {import('next').NextConfig} */
const nextConfig = {
  // React & Next.js optimizations
  reactStrictMode: true,
  
  // Optimized bundling
  poweredByHeader: false,
  compress: true,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  
  // Performance optimizations
  webpack: (config, { dev, isServer }) => {
    // Fix for browser-only libraries in server build
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        'critters',
      ]
    }
    return config
  },
  
  // Headers for better caching
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
