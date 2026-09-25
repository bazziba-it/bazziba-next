/**
 * Bazziba Next.js - API Response Helpers
 */

import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";

export function apiSuccess<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    { success: true, data },
    { status }
  );
}

export function apiError(
  message: string,
  status = 500
): NextResponse<ApiResponse> {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}

// Async handler wrapper that catches errors
export function asyncHandler(
  handler: (...args: any[]) => Promise<NextResponse>
) {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error: any) {
      console.error("API Error:", error);
      return apiError(
        error.message || "Internal Server Error",
        error.status || 500
      );
    }
  };
}

// Rate limiting middleware for API routes
export function rateLimit(
  req: Request,
  limit: number = 100,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; reset: number } {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const key = `ratelimit:${ip}`;
  
  // Use Redis in production, in-memory in dev
  const store = (global as any).__rateLimitStore || ((global as any).__rateLimitStore = new Map());
  const now = Date.now();
  const entry = store.get(key);
  const reset = now + windowMs;

  if (!entry || entry.reset < now) {
    store.set(key, { count: 1, reset });
    return { allowed: true, remaining: limit - 1, reset };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, reset: entry.reset };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count, reset: entry.reset };
}
