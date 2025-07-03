/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for PWA
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'dist',
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization for static export
  images: {
    unoptimized: true
  },
}

export default nextConfig
