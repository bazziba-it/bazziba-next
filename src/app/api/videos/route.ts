import { NextResponse } from "next/server";
import { prisma } from "@/lib/server";
import { apiSuccess, apiError, asyncHandler, rateLimit } from "@/lib/api";
import { slugify, generateId } from "@/lib/server";

export const POST = asyncHandler(async (req: Request) => {
  // Rate limit
  const rateCheck = rateLimit(req, 20, 60000); // 20 posts per minute
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, error: "Rate limit exceeded" },
      { status: 429 }
    );
  }

  const body = await req.json();
  const {
    title,
    description,
    videoUrl,
    playbackId,
    thumbnail,
    category,
    tags,
    visibility = "PUBLIC",
    duration,
  } = body;

  // Validate required fields
  if (!title || !videoUrl || !playbackId) {
    return apiError("Missing required fields: title, videoUrl, playbackId");
  }

  // Get user from session (simplified — use NextAuth in real impl)
  const userId = "temp-user-id"; // Replace with actual auth
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return apiError("User not found", 401);
  }

  // Find or create category
  let categoryRecord = null;
  if (category) {
    categoryRecord = await prisma.category.findUnique({
      where: { slug: category },
    });
    if (!categoryRecord) {
      categoryRecord = await prisma.category.create({
        data: {
          name: category.charAt(0).toUpperCase() + category.slice(1),
          slug: category,
        },
      });
    }
  }

  // Parse tags
  const tagNames = tags ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [];
  const tagRecords = await Promise.all(
    tagNames.map(async (name: string) => {
      const slug = slugify(name);
      const existing = await prisma.tag.findUnique({ where: { slug } });
      if (existing) return existing;
      return prisma.tag.create({
        data: { name, slug },
      });
    })
  );

  // Create video
  const video = await prisma.video.create({
    data: {
      title,
      description,
      slug: slugify(title) + "-" + generateId(6),
      thumbnail: thumbnail || `https://imagedelivery.net/${playbackId}/thumbnail.jpg`,
      videoUrl,
      playbackId,
      videoProvider: "cloudflare",
      duration: duration || 0,
      visibility,
      status: "PROCESSING",
      authorId: user.id,
      categoryId: categoryRecord?.id,
      tags: {
        create: tagRecords.map((tag) => ({ tagId: tag.id })),
      },
    },
    include: {
      category: true,
      author: {
        select: { id: true, username: true, name: true, image: true },
      },
      tags: { include: { tag: true } },
    },
  });

  // Update user video count
  await prisma.user.update({
    where: { id: user.id },
    data: { videoCount: { increment: 1 } },
  });

  return apiSuccess(video, 201);
});

export const GET = asyncHandler(async (req: Request) => {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const cursor = url.searchParams.get("cursor");
  const userId = url.searchParams.get("userId");
  const category = url.searchParams.get("category");
  const search = url.searchParams.get("q");

  const where: any = {
    status: "PUBLISHED",
    visibility: "PUBLIC",
  };

  if (userId) where.authorId = userId;
  if (category) where.category = { slug: category };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const videos = await prisma.video.findMany({
    where,
    include: {
      author: {
        select: { id: true, username: true, name: true, image: true },
      },
      category: true,
      tags: { include: { tag: true } },
      _count: {
        select: { comments: true },
      },
    },
    orderBy: { createdAt: "desc" },
    skip: cursor ? 0 : (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.video.count({ where });

  return apiSuccess({
    videos,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});
