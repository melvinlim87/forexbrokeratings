/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    domains: ['images.pexels.com', 'via.placeholder.com'],
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: true
};

module.exports = nextConfig;