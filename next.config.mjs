/** @type {import('next').NextConfig} */
const nextConfig = {
  // React 19 & Next.js 15 optimizations
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
    
    // Tree shaking for better bundle size
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
            },
            // Separate vendor chunks
            nodeModules: {
              name: 'node_modules',
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
            },
          },
        },
      }
    }
    
    // Reduce server bundle size
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        '@node-rs/*',
      ]
    }
    
    return config
  },
  
  // Advanced performance features
  experimental: {
    // Next.js 15: Optimize package imports
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    
    // Reduce hydration
    optimizeCss: true,
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
