/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: { 
    domains: ['images.pexels.com', 'via.placeholder.com'],
    unoptimized: true 
  },
};

module.exports = nextConfig;