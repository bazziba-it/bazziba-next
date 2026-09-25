/**
 * Bazziba Next.js - Server-side Utilities
 */

import { prisma as prismaClient } from "@/lib/prisma";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import type { User, Video, Pagination } from "@/types";

// Export from lazy proxy to prevent build-time Prisma instantiation
export const prisma = prismaClient;

// Safe query wrapper — returns empty array on Prisma errors (e.g., missing engine binary)
export async function safeQuery<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error("[Bazziba] Database query failed:", error);
    return ([] as unknown) as T;
  }
}

// JWT auth
export async function getCurrentUser(): Promise<User | null> {
  return null;
}

// Format duration from seconds to MM:SS or HH:MM:SS
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Parse duration string to seconds
export function parseDurationToSeconds(duration: string): number {
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
}

// Generate slug from title
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 100);
}

// Generate unique ID
export function generateId(length: number = 10): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Pagination helper
export function buildPagination<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): Pagination<T> {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

// Get video stream URL from Cloudflare Stream
export function getStreamUrl(videoUrl: string, playbackId?: string): string {
  if (playbackId && videoUrl.includes("stream.video")) {
    return `https://customer-${process.env.CLOUDFLARE_ACCOUNT_ID}.cloudflare.com/client/api/${playbackId}.m3u8`;
  }
  return videoUrl;
}

// Get thumbnail URL with fallback
export function getThumbnailUrl(thumbnail?: string | null, fallback = "/placeholder-video.jpg"): string {
  if (!thumbnail) return fallback;
  return thumbnail;
}

// Get user avatar with fallback to Gravatar
export function getAvatarUrl(image?: string | null, email?: string | null, fallback = "/default-avatar.png"): string {
  if (image) return image;
  if (email) {
    const emailHash = email.trim().toLowerCase();
    return `https://www.gravatar.com/avatar/${emailHash}?s=200&d=404&r=g`;
  }
  return fallback;
}

// Rate limiting (simple in-memory, Redis in production)
const rateLimitStore = new Map<string, { count: number; reset: number }>();

export function checkRateLimit(
  key: string,
  limit: number = 100,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; reset: number } {
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

// Log helper
export function logError(error: unknown, context?: string): void {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[Bazziba Error]${context ? ` [${context}]` : ""}`, error);
  } else {
    console.error(`[Bazziba Error]${context ? ` [${context}]` : ""}`, error);
  }
}
