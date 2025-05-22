/** @type {import('next').NextConfig} */

// 注意：此项目需要Node.js v20.9.0或更高版本
// Note: This project requires Node.js v20.9.0 or higher
// 在Cloudflare Pages中，请设置环境变量：NODE_VERSION=20.9.0

const nextConfig = {
  eslint: {
    // 在生产构建时忽略ESLint错误
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 在生产构建时忽略TypeScript错误
    ignoreBuildErrors: true,
  },
  // 可以保留images优化配置
  images: {
    domains: ['images.clerk.dev'], // 如果使用Clerk头像
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // 禁用webpack缓存以避免生成大型pack文件
  webpack: (config, { dev, isServer }) => {
    // 仅在生产构建时应用这些优化
    if (!dev) {
      config.cache = false;
      
      // 优化包大小
      if (!isServer) {
        config.optimization.splitChunks = {
          chunks: 'all',
          maxInitialRequests: 25,
          minSize: 20000,
          maxSize: 20 * 1024 * 1024, // 20MB限制
        };
      }
    }
    return config;
  },
  // 现在可以启用headers配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 