/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
    disable: true,  // Disable linting entirely for builds
  },
};

export default nextConfig;

  