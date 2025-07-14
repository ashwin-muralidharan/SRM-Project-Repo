/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'media.licdn.com',
          port: '',
          pathname: '/**',
        },
      ],
    },
  };
  
  module.exports = nextConfig;