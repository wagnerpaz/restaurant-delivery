/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = withBundleAnalyzer({
  reactStrictMode: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "s3.sa-east-1.amazonaws.com",
      "d16a0xpwbzkgv8.cloudfront.net",
    ],
  },
  Image: {
    minimumCacheTTL: 60 * 10,
  },
});

module.exports = nextConfig;
