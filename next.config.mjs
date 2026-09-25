// Next.js 15/16 Configuration
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.bazziba.it" },
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

  output: "standalone",

  typescript: {
    ignoreBuildErrors: true,
  },

  // Use experimental settings for webpack compatibility
  experimental: {
    // Disable PPR which can cause prerender issues on non-standard platforms
    // Use static export to avoid runtime URL parsing during prerender
  },
};

export default nextConfig;
