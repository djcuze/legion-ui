/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path((?!_next|login$).*)',
        missing: [
          {
            type: 'cookie',
            key: 'authorization'
          },
        ],
        permanent: false,
        destination: '/login',
      }
    ]
  }
};

export default nextConfig;
