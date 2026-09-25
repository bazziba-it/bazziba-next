import { NextResponse } from "next/server";
import { prisma } from "@/lib/server";
import { apiSuccess, apiError, asyncHandler, rateLimit } from "@/lib/api";

export const GET = asyncHandler(async (req: Request) => {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId") || "temp-user-id";

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: {
          videos: true,
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!user) {
    return apiError("User not found");
  }

  return apiSuccess({
    points: user.points,
    level: getLevel(user.points),
    rank: 0, // Calculate rank
    totalVideos: user._count.videos,
    totalSubscribers: user._count.followers,
    totalFollowing: user._count.following,
    progress: {
      nextLevel: getNextLevelThreshold(user.points),
      currentLevelThreshold: getLevelThreshold(user.points),
    },
  });
});

export const POST = asyncHandler(async (req: Request) => {
  const rateCheck = rateLimit(req, 30, 60000);
  if (!rateCheck.allowed) {
    return NextResponse.json({ success: false, error: "Rate limit exceeded" }, { status: 429 });
  }

  const body = await req.json();
  const { action, amount, description } = body;
  const userId = "temp-user-id";

  const transaction = await prisma.pointsTransaction.create({
    data: {
      userId,
      amount,
      type: action,
      description: description || `${action} points`,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { points: { increment: amount } },
  });

  const updatedUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { points: true },
  });

  return apiSuccess({
    balance: updatedUser?.points,
    transaction,
    newLevel: getLevel(updatedUser?.points || 0),
  });
});

function getLevel(points: number): number {
  if (points < 100) return 1;
  if (points < 500) return 2;
  if (points < 2000) return 3;
  if (points < 10000) return 4;
  if (points < 50000) return 5;
  if (points < 200000) return 6;
  return 7;
}

function getLevelThreshold(points: number): number {
  const levels = [0, 100, 500, 2000, 10000, 50000, 200000];
  for (let i = levels.length - 1; i >= 0; i--) {
    if (points >= levels[i]) return levels[i];
  }
  return 0;
}

function getNextLevelThreshold(points: number): number {
  const levels = [0, 100, 500, 2000, 10000, 50000, 200000];
  const currentLevel = getLevel(points);
  if (currentLevel >= levels.length) return levels[levels.length - 1];
  return levels[currentLevel];
}
