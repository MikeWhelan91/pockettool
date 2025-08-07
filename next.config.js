/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Keep the small fallbacks that prevent accidental "fs/path" bundling
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    return config;
  },
};

module.exports = nextConfig;
