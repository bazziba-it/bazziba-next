/**
 * Bazziba - Middleware for auth, rate limiting, and security headers
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that don't require authentication
const publicPaths = [
  "/auth",
  "/api/auth",
  "/api/health",
  "/api/og",
  "/_next",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
];

// API routes with rate limits
const apiRateLimit = {
  auth: { limit: 10, window: 60000 },
  upload: { limit: 20, window: 60000 },
  default: { limit: 120, window: 60000 },
};

// Rate limit store (in-memory, Redis in production)
const rateLimitStore = new Map<string, { count: number; reset: number }>();

function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  const reset = now + windowMs;

  if (!entry || entry.reset < now) {
    rateLimitStore.set(key, { count: 1, reset });
    return { allowed: true, remaining: limit - 1, reset };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, reset: entry.reset };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count, reset: entry.reset };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Rate limiting for API routes
  if (pathname.startsWith("/api/")) {
    let config = apiRateLimit.default;
    if (pathname.includes("/auth/")) config = apiRateLimit.auth;
    else if (pathname.includes("/upload")) config = apiRateLimit.upload;

    const ip =
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const key = `api:${pathname}:${ip}`;

    const { allowed, remaining, reset } = checkRateLimit(
      key,
      config.limit,
      config.window
    );

    if (!allowed) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded" },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
            "X-RateLimit-Limit": config.limit.toString(),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", config.limit.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    return response;
  }

  // Security headers
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*). *)"],
};
