/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
    trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
    typescript: {
      ignoreBuildErrors: true
    },
};

module.exports = nextConfig;
