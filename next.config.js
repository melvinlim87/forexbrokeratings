/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    domains: ['images.pexels.com', 'via.placeholder.com'],
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: true,
  distDir: "build",
};

module.exports = nextConfig;