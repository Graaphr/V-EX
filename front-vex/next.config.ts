import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['72.61.210.158'],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '72.61.210.158',
        port: '8000',
        pathname: '/storage/**',
      },
    ],
    dangerouslyAllowLocalIP: true,
  },
  async rewrites() {
    return [
      {
        source: '/storage/:path*',
        destination: 'http://72.61.210.158:8000/storage/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'http://72.61.210.158:8000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
