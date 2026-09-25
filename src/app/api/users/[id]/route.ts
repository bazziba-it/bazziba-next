import { NextResponse } from "next/server";
import { prisma } from "@/lib/server";
import { apiSuccess, apiError, asyncHandler } from "@/lib/api";

export const GET = asyncHandler(async (req: Request) => {
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const identifier = segments[segments.length - 1];

  if (!identifier) {
    return apiError("Identifier required");
  }

  // Find user by id or username
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ id: identifier }, { username: identifier }],
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      bio: true,
      image: true,
      videoCount: true,
      subscriberCount: true,
      followingCount: true,
      points: true,
      level: true,
      joinedAt: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          videos: true,
          subscribers: true,
          following: true,
        },
      },
    },
  });

  if (!user) {
    return apiError("User not found", 404);
  }

  return apiSuccess({
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    bio: user.bio,
    image: user.image,
    videoCount: user._count.videos,
    subscriberCount: user._count.subscribers,
    followingCount: user._count.following,
    points: user.points,
    level: user.level,
    joinedAt: user.createdAt.toISOString(),
    isFollowing: false, // Check actual following state
  });
});
