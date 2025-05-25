/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { 
    domains: ['images.pexels.com', 'via.placeholder.com'],
    unoptimized: true 
  },
  webpack: (config, { isServer }) => {
    // Disable webpack cache to prevent EIO errors
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;