import { NextResponse } from "next/server";
import { prisma } from "@/lib/server";
import { apiSuccess, apiError, asyncHandler, rateLimit } from "@/lib/api";
import { slugify } from "@/lib/server";

export const POST = asyncHandler(async (req: Request) => {
  // Rate limit - stricter for auth endpoints
  const rateCheck = rateLimit(req, 5, 60000);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, error: "Rate limit exceeded" },
      { status: 429 }
    );
  }

  const body = await req.json();
  const { email, username, name } = body;

  // Validate
  if (!email || !username) {
    return apiError("Email and username are required");
  }

  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    return apiError("Username must be 3-20 characters, alphanumeric + underscore only");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return apiError("Invalid email address");
  }

  // Check if user exists
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existing) {
    return apiError("User with this email or username already exists");
  }

  // Create user (simplified — in production, use NextAuth with password hashing)
  const user = await prisma.user.create({
    data: {
      email,
      username,
      name,
      role: "USER",
    },
  });

  return apiSuccess({ user }, 201);
});
