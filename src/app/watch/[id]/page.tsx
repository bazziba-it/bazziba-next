import { prisma, safeQuery } from "@/lib/server";
import { VideoPlayer } from "@/components/video/video-player";
import { VideoGrid } from "@/components/video/video-card";
import { Button, Badge, Separator } from "@/components/ui";
import { formatViews, formatDate, timeAgo } from "@/lib/utils";
import type { Video, Comment } from "@/types";
import Link from "next/link";
import { MessageCircle, ThumbsUp, ThumbsDown, Share2 } from "lucide-react";

async function getVideo(id: string) {
  return safeQuery(async () => {
    return (await prisma.video.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
            bio: true,
            videoCount: true,
            followerCount: true,
          },
        },
        category: true,
        tags: { include: { tag: true } },
        contestEntry: {
          include: {
            contest: true,
          },
        },
      },
    })) as (Video & {
      author: {
        id: string;
        username: string;
        name?: string;
        image?: string;
        bio?: string;
        videoCount: number;
        followerCount: number;
      };
    }) | null;
  });
}

async function getSuggestedVideos(categoryId?: string, currentId?: string) {
  return safeQuery(async () => {
    return (await prisma.video.findMany({
      where: {
        status: "PUBLISHED",
        visibility: "PUBLIC",
        id: { not: currentId },
        ...(categoryId ? { categoryId } : {}),
      },
      include: {
        author: { select: { id: true, username: true, name: true, image: true } },
      },
      orderBy: { viewCount: "desc" },
      take: 8,
    })) as Video[];
  });
}

async function getComments(videoId: string) {
  return safeQuery(async () => {
    return await prisma.comment.findMany({
      where: {
        videoId,
        status: "APPROVED",
        parentId: null,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        replies: {
          where: { status: "APPROVED" },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
              },
            },
            _count: {
              select: { likes: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        _count: {
          select: { likes: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  });
}

async function getContestInfo(videoId: string) {
  return safeQuery(async () => {
    const contestEntry = await prisma.contestEntry.findFirst({
      where: { videoId },
      include: {
        contest: {
          include: {
            _count: {
              select: { entries: true, votes: true },
            },
          },
        },
      },
    });

    if (!contestEntry || !contestEntry.contest) return null;

    return {
      contest: contestEntry.contest,
      entry: contestEntry,
    };
  });
}

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const video = await getVideo(id);

  if (!video) {
    return (
      <div className="container mx-auto py-12">
        <h1 className="text-2xl font-bold">Video Not Found</h1>
        <p className="text-muted-foreground mt-2">The video you're looking for doesn't exist or has been removed.</p>
        <a href="/" className="text-brand-yellow font-medium">
          Go back to home
        </a>
      </div>
    );
  }

  // Increment view count (fire and forget - don't await)
  safeQuery(async () => {
    await prisma.video.update({
      where: { id: video.id },
      data: { viewCount: { increment: 1 } },
    });
  }).catch(() => {});

  const [suggestedVideos, comments, contestInfo] = await Promise.all([
    getSuggestedVideos(video.categoryId, video.id),
    getComments(video.id),
    getContestInfo(video.id),
  ]);

  // Format duration for display
  const duration = video.duration
    ? `${Math.floor(video.duration / 60)}:${String(Math.floor(video.duration % 60)).padStart(2, "0")}`
    : null;

  return (
    <div className="py-4 md:py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Main Video Column */}
          <div className="lg:col-span-2 space-y-4">
            <VideoPlayer video={video} />

            {/* Video Description */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{video.category?.name || "General"}</Badge>
                {duration && <span className="text-sm text-muted-foreground">{duration}</span>}
                <span className="text-sm text-muted-foreground">
                  {formatViews(video.viewCount)} views
                </span>
                <span className="text-sm text-muted-foreground">
                  Published {formatDate(video.publishedAt || video.createdAt)}
                </span>
              </div>

              {video.description && (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {video.description}
                </p>
              )}

              {/* Like/Share Actions */}
              <div className="flex items-center gap-4 pt-2">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  {formatViews(video.likeCount)}
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <ThumbsDown className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>

              <Separator />
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Commenti ({comments.length})
              </h3>
              <p className="text-sm text-muted-foreground">
                Comments system will be implemented with Supabase Realtime.
              </p>
            </div>
          </div>

          {/* Sidebar - Suggested Videos */}
          <div className="space-y-3">
            <h3 className="font-semibold mb-3">Video Suggeriti</h3>
            <div className="space-y-3">
              {suggestedVideos.map((video) => (
                <a
                  key={video.id}
                  href={`/watch/${video.id}`}
                  className="flex gap-3 group"
                >
                  <div className="relative flex-shrink-0 w-40 aspect-video">
                    <img
                      src={video.thumbnail || "/placeholder-video.jpg"}
                      alt={video.title}
                      className="h-full w-full rounded object-cover group-hover:brightness-110 transition-brightness"
                      loading="lazy"
                    />
                    {video.duration && (
                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                        {Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, "0")}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2 group-hover:text-brand-yellow transition-colors">
                      {video.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {video.author?.name || video.author?.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatViews(video.viewCount)} views
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
