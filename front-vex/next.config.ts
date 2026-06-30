import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vex.terpalb25.web.id',
        pathname: '/storage/**',
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/storage/:path*',
        destination: 'https://vex.terpalb25.web.id/storage/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'https://vex.terpalb25.web.id/api/:path*',
      },
    ];
  },
};

export default nextConfig;