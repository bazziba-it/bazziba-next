import type { NextConfig } from "next";
import { create } from "@vercel/postgres";
import { env } from "process";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compression: true,
  reactStrictMode: true,
  
  experimental: {
    // React Compiler support
    reactCompiler: true,
    // PPR (Partial Prerendering) for hybrid rendering
    ppr: "auto",
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.b-cdn.net",
      },
      {
        protocol: "https",
        hostname: "**.cloudflare.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.twimg.com",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.gravatar.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.bazziba.it",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 375, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera(), microphone(), geolocation()",
          },
        ],
      },
      {
        source: "/videos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Redirects from old WordPress URLs
  async redirects() {
    return [
      // Redirect old WordPress video URLs to new slug-based URLs
      {
        source: "/video/:id/:slug*",
        destination: "/watch/:id",
        permanent: true,
      },
      // Redirect category URLs
      {
        source: "/categorie/:category",
        destination: "/c/:category",
        permanent: true,
      },
      // Redirect author URLs
      {
        source: "/author/:author",
        destination: "/user/:author",
        permanent: true,
      },
      // Redirect old contact page
      {
        source: "/contattaci",
        destination: "/contact",
        permanent: true,
      },
      // Redirect wp-admin
      {
        source: "/wp-admin/:path*",
        destination: "/",
        permanent: false,
      },
    ];
  },

  // Experimental turbo resolve alias
  webpack(config, { isServer }) {
    // Optimize bundle
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          // Separate video player vendor chunk
          videoPlayer: {
            test: /[\\/]node_modules[\\/](hls\.js|video\.js|@mux)[\\/]/,
            name: "video-player",
            chunks: "all",
            minSize: 0,
          },
        },
      },
    };

    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
