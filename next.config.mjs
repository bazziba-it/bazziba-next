// Next.js 15/16 Configuration
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

// @mux/playback-core (pulled in transitively by react-player) imports hls.js as
// BOTH a default export and a named export (CapLevelController). Only the ESM
// build (dist/hls.mjs) provides those; the CJS build (dist/hls.js) provides
// neither, which is what failed the webpack build. Resolve to the ESM build
// with an ABSOLUTE path so every importer — including the nested copies under
// node_modules/@mux/*/node_modules/@mux/playback-core — lands on it.
let hlsEsm;
try {
  hlsEsm = require.resolve("hls.js/dist/hls.mjs");
} catch {
  hlsEsm = "hls.js/dist/hls.mjs";
}

const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "bazziba.it" },
      { protocol: "https", hostname: "**.bazziba.it" },
      { protocol: "https", hostname: "www.gravatar.com" },
      { protocol: "https", hostname: "*.cloudflare.com" },
      { protocol: "https", hostname: "*.b-cdn.net" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "imagedelivery.net" },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Skip static page generation for pages that fail during prerender
  // (works around Next.js + webpack prerender issues on Android/Termux)
  skipTrailingSlashRedirect: true,

  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/watch", destination: "/feed/latest", permanent: false },
    ];
  },

  async rewrites() {
    return [
      { source: "/api/v1/:path*", destination: "/api/:path*" },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), payment=()" },
        ],
      },
    ];
  },


  typescript: {
    ignoreBuildErrors: true,
  },

  // Force hls.js ESM resolution for @mux/mux-player / @mux/playback-core.
  // Exact-match ($) aliases so the subpath requests are not prefix-rewritten.
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.fullySpecified = false;
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias["hls.js$"] = hlsEsm;
    config.resolve.alias["hls.js/dist/hls.js$"] = hlsEsm;
    config.resolve.alias["hls.js/dist/hls.mjs$"] = hlsEsm;
    return config;
  },
};

export default nextConfig;
