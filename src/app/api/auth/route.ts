import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth route - handles sign in/out
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  
  // Redirect to sign-in page
  return NextResponse.redirect(new URL(`/auth/signin?callbackUrl=${callbackUrl}`, req.url));
}

export async function POST(req: NextRequest) {
  // POST is handled by next-auth handlers
  return NextResponse.json({ success: true });
}
