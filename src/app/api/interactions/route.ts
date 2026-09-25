import { NextResponse } from "next/server";
import { prisma } from "@/lib/server";
import { apiSuccess, apiError, asyncHandler, rateLimit } from "@/lib/api";
import { slugify } from "@/lib/server";

export const POST = asyncHandler(async (req: Request) => {
  const rateCheck = rateLimit(req, 60, 60000);
  if (!rateCheck.allowed) {
    return NextResponse.json({ success: false, error: "Rate limit exceeded" }, { status: 429 });
  }

  const body = await req.json();
  const { videoId, action, commentId } = body;

  const userId = "temp-user-id";

  switch (action) {
    case "like":
      await prisma.like.create({
        data: { userId, videoId },
        skipDuplicates: true,
      });
      await prisma.video.update({
        where: { id: videoId },
        data: { likeCount: { increment: 1 } },
      });
      break;

    case "unlike":
      await prisma.like.deleteMany({ where: { userId, videoId } });
      await prisma.video.update({
        where: { id: videoId },
        data: { likeCount: { decrement: 1 } },
      });
      break;

    case "comment":
      const { content, parentId } = body;
      if (!content) return apiError("Content is required");

      await prisma.comment.create({
        data: {
          content,
          authorId: userId,
          videoId,
          parentId: parentId || null,
        },
      });
      await prisma.video.update({
        where: { id: videoId },
        data: { commentCount: { increment: 1 } },
      });
      break;

    case "subscribe":
      const { channelId } = body;
      await prisma.subscription.create({
        data: { subscriberId: userId, channelId },
        skipDuplicates: true,
      });
      await prisma.user.update({
        where: { id: channelId },
        data: { subscriberCount: { increment: 1 } },
      });
      break;

    case "follow-tag":
      const { tagId } = body;
      await prisma.tagSubscription.create({
        data: { userId, tagId },
        skipDuplicates: true,
      });
      break;
  }

  return apiSuccess({ success: true });
});

export const GET = asyncHandler(async (req: Request) => {
  const url = new URL(req.url);
  const videoId = url.searchParams.get("videoId");
  const userId = "temp-user-id";

  const data: any = {};

  if (videoId) {
    const [liked, comments] = await Promise.all([
      prisma.like.findUnique({
        where: { userId_videoId: { userId, videoId } },
      }),
      prisma.comment.findMany({
        where: { videoId, parentId: null },
        include: {
          author: { select: { id: true, username: true, name: true, image: true } },
          _count: { select: { replies: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    data.liked = !!liked;
    data.comments = comments;
  }

  return apiSuccess(data);
});
