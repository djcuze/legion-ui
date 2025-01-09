/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'r9sx7ho9yq0ovqbs.public.blob.vercel-storage.com',
        port: '',
      },
    ],
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/:path((?!_next|login$|register$).*)',
  //       missing: [
  //         {
  //           type: 'cookie',
  //           key: 'authorization'
  //         },
  //       ],
  //       permanent: false,
  //       destination: '/login',
  //     }
  //   ]
  // }
};

export default nextConfig;
