/**
 * Bazziba Next.js - NextAuth API Route
 * Handles authentication endpoints for NextAuth.js
 */
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const NextAuth = (await import("next-auth")).default;
    const Google = (await import("next-auth/providers/google")).default;
    const GitHub = (await import("next-auth/providers/github")).default;
    const Email = (await import("next-auth/providers/email")).default;

    const config = {
      ...authConfig,
      providers: [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID || "",
          clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        GitHub({
          clientId: process.env.GITHUB_ID || "",
          clientSecret: process.env.GITHUB_SECRET || "",
        }),
        Email({
          server: process.env.EMAIL_SERVER || "smtp://localhost:587",
          from: process.env.EMAIL_FROM || "noreply@bazziba.it",
        }),
      ],
    };

    const handlers = NextAuth(config);
    return handlers.GET(req);
  } catch (error) {
    console.error("[Bazziba] Auth GET error:", error);
    return NextResponse.json({ error: "Auth not configured" }, { status: 501 });
  }
}

export async function POST(req: Request) {
  try {
    const NextAuth = (await import("next-auth")).default;
    const Google = (await import("next-auth/providers/google")).default;
    const GitHub = (await import("next-auth/providers/github")).default;
    const Email = (await import("next-auth/providers/email")).default;

    const config = {
      ...authConfig,
      providers: [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID || "",
          clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        GitHub({
          clientId: process.env.GITHUB_ID || "",
          clientSecret: process.env.GITHUB_SECRET || "",
        }),
        Email({
          server: process.env.EMAIL_SERVER || "smtp://localhost:587",
          from: process.env.EMAIL_FROM || "noreply@bazziba.it",
        }),
      ],
    };

    const handlers = NextAuth(config);
    return handlers.POST(req);
  } catch (error) {
    console.error("[Bazziba] Auth POST error:", error);
    return NextResponse.json({ error: "Auth not configured" }, { status: 501 });
  }
}
