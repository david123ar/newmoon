/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Increase static page generation timeout to 300 seconds
  staticPageGenerationTimeout: 3000,

  // Add image domain configuration for external image loading
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.noitatnemucod.net',
        pathname: '/**',  // Allow all paths under this hostname
      },
      {
        protocol: 'https',
        hostname: 'img.zorores.com',
        pathname: '/**',
      },
    ],
  },

  // Add HTTP headers configuration
  async headers() {
    return [
      {
        source: '/:path*', // Apply to all paths
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow', // Allow indexing for all pages
          },
        ],
      },
    ];
  },
};

export default nextConfig;
