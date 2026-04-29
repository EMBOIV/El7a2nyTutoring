/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security: remove X-Powered-By header
  poweredByHeader: false,

  // Enable gzip/brotli compression
  compress: true,

  images: {
    // Modern image formats for performance
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
    ],
  },
};

export default nextConfig;
