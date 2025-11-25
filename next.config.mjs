/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['res.cloudinary.com', 'tpembd.com'],
  },
  async headers() {
    return [
      {
        source: '/hotels',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://tpembd.com;
              style-src 'self' 'unsafe-inline' https://tpembd.com;
              img-src 'self' data: https: http:;
              connect-src 'self' https://tpembd.com;
              frame-src 'self' https://tpembd.com;
              media-src 'self' https:;
              font-src 'self' data:;
            `.replace(/\s+/g, ' ').trim()
          }
        ]
      }
    ];
  }
}

export default nextConfig;