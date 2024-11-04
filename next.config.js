/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thumbs.dreamstime.com',
        port: '',
        pathname: '/z/**',
      },
      {
        protocol: 'https',
        hostname: 'thumbsnap.com',
        port: '',
        pathname: '/i/**'
      }
    ],
  },
  env: {
    DEVMODE: process.env.DEVMODE,
  },
}

module.exports = nextConfig
