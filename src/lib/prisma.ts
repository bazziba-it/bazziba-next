/**
 * Bazziba Next.js - Prisma Client
 * Lazy initialization to prevent build-time errors.
 */

import { PrismaClient } from "@prisma/client";

declare global {
  var __prisma: PrismaClient | undefined;
}

let cached: PrismaClient | null = null;

export function getPrisma(): PrismaClient {
  if (cached) return cached;
  if (typeof global !== "undefined" && global.__prisma) {
    cached = global.__prisma;
    return cached;
  }
  try {
    cached = new PrismaClient({
      log: ["error", "warn"],
    });
    if (typeof global !== "undefined") {
      global.__prisma = cached;
    }
    return cached;
  } catch (error) {
    console.error("[Bazziba] Prisma client initialization failed:", error);
    throw error;
  }
}

// Export a lazy proxy so Prisma is only instantiated when actually accessed
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    try {
      const client = getPrisma();
      const value = (client as any)[prop];
      return typeof value === "function" ? value.bind(client) : value;
    } catch (e) {
      console.error("[Bazziba] Prisma proxy error:", e);
      return undefined;
    }
  },
  getPrototypeOf() {
    return {};
  },
});
