import { NextResponse } from "next/server";
import { prisma } from "@/lib/server";
import { apiSuccess, apiError, asyncHandler, rateLimit } from "@/lib/api";

export const GET = asyncHandler(async (req: Request) => {
  const now = new Date();
  const activeContest = await prisma.contest.findFirst({
    where: {
      startAt: { lte: now },
      endAt: { gte: now },
    },
    include: {
      entries: {
        include: {
          video: {
            include: {
              author: { select: { id: true, username: true, name: true, image: true } },
            },
          },
        },
        orderBy: { voteCount: "desc" },
        take: 50,
      },
    },
  });

  return apiSuccess({
    activeContest,
    remainingDays: activeContest
      ? Math.ceil((activeContest.endAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : null,
  });
});

export const POST = asyncHandler(async (req: Request) => {
  const rateCheck = rateLimit(req, 5, 60000);
  if (!rateCheck.allowed) {
    return NextResponse.json({ success: false, error: "Rate limit exceeded" }, { status: 429 });
  }

  const body = await req.json();
  const { videoId, contestId } = body;
  const userId = "temp-user-id";

  // Check if contest is active
  const contest = await prisma.contest.findUnique({
    where: { id: contestId },
  });

  if (!contest || new Date() > contest.endAt || new Date() < contest.startAt) {
    return apiError("Contest non attivo");
  }

  // Check how many entries user already has
  const userEntries = await prisma.contestEntry.count({
    where: { contestId, userId },
  });

  if (userEntries >= 3) {
    return apiError("Hai raggiunto il numero massimo di candidature (3)");
  }

  // Check user has at least 1 video
  const userVideoCount = await prisma.video.count({
    where: { authorId: userId, status: "PUBLISHED" },
  });

  if (userVideoCount === 0) {
    return apiError("Devi prima caricare un video per partecipare");
  }

  // Check if entry exists
  const existingEntry = await prisma.contestEntry.findFirst({
    where: { contestId, videoId },
  });

  if (existingEntry) {
    return apiSuccess({ message: "Video già candidato al contest" });
  }

  // Create entry
  await prisma.contestEntry.create({
    data: {
      contestId,
      videoId,
      userId,
      status: "PENDING",
    },
  });

  return apiSuccess({ success: true });
});

export const PUT = asyncHandler(async (req: Request) => {
  const body = await req.json();
  const { entryId, action } = body;
  const userId = "temp-user-id";

  if (action === "vote") {
    // Check if user already voted
    const existingVote = await prisma.contestVote.findFirst({
      where: { userId, entryId },
    });

    if (existingVote) {
      return apiError("Hai già votato questa candidatura");
    }

    await prisma.contestVote.create({
      data: { userId, contestId: body.contestId, entryId },
    });

    await prisma.contestEntry.update({
      where: { id: entryId },
      data: { voteCount: { increment: 1 } },
    });

    return apiSuccess({ success: true });
  }

  return apiError("Invalid action");
});
