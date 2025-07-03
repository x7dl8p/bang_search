/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for PWA
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  
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
