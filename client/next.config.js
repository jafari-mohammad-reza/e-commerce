/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
    ],
  },
  output: 'standalone',
  experimental: {
    images: {
      unoptimized: true,
    },
  },
};
