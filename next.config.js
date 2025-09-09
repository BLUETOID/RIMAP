/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Netlify deployment optimizations
  trailingSlash: true,
  
  experimental: {
    optimizeCss: true,
  },
  
  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: true, // Required for static export
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      'gravatar.com',
      'github.com',
      'linkedin.com'
    ]
  },
  
  // Only ignore during builds in development
  ...(process.env.NODE_ENV === 'development' && {
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreDuringBuilds: true,
    },
  }),
  
  // Environment variables that should be available to the client
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Alumni Connect',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  }
}

module.exports = nextConfig
