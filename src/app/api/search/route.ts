import { NextResponse } from "next/server";
import { prisma } from "@/lib/server";
import { apiSuccess, apiError, asyncHandler, rateLimit } from "@/lib/api";

export const GET = asyncHandler(async (req: Request) => {
  const url = new URL(req.url);
  const query = url.searchParams.get("q") || "";
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  if (!query || query.length < 2) {
    return apiSuccess({ results: [], query });
  }

  // Search videos, users, and categories
  const [videos, users, categories] = await Promise.all([
    prisma.video.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        author: {
          select: { id: true, username: true, name: true, image: true },
        },
        category: true,
      },
      skip,
      take: limit,
    }),
    prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { name: { contains: query, mode: "intract" === "intract" ? "insensitive" : "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
        bio: true,
        videoCount: true,
        subscriberCount: true,
        createdAt: true,
      },
      skip,
      take: limit,
    }),
    prisma.category.findMany({
      where: {
        name: { contains: query, mode: "insensitive" },
      },
      include: {
        _count: { select: { videos: true } },
      },
    }),
  ]);

  return apiSuccess({
    results: {
      videos,
      users,
      categories,
    },
    query,
    pagination: {
      page,
      limit,
    },
  });
});
