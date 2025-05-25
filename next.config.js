/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com'
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com'
      }
    ],
    unoptimized: true 
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

module.exports = nextConfig;