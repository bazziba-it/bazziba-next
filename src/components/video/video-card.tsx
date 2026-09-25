"use client";

import Link from "next/link";
import { Play, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui";
import { formatViews, formatDate } from "@/lib/utils";
import { getThumbnailUrl, getAvatarUrl } from "@/lib/server";
import type { Video } from "@/types";

interface VideoCardProps {
  video: Video & {
    author?: {
      id: string;
      username: string;
      name?: string;
      image?: string;
    };
  };
  showAuthor?: boolean;
  size?: "sm" | "md" | "lg" | "compact";
  className?: string;
}

export function VideoCard({ video, showAuthor = true, size = "md", className }: VideoCardProps) {
  const sizeConfig = {
    sm: "max-w-[200px]",
    md: "max-w-[280px]",
    lg: "max-w-[320px]",
    compact: "max-w-[160px]",
  };

  const isCompact = size === "compact";

  return (
    <Link
      href={`/watch/${video.id}`}
      className={`group block ${sizeConfig[size]} ${className || ""}`}
      prefetch={false}
    >
      <div className="space-y-2">
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
          <img
            src={getThumbnailUrl(video.thumbnail)}
            alt={video.title}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 768px) 100vw"
          />
          {video.duration && (
            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
              {formatDurationFromSeconds(video.duration)}
            </div>
          )}
          <Play className="absolute inset-0 m-auto h-10 w-10 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="flex gap-3">
          {showAuthor && (
            <>
              <div className="flex-shrink-0">
                <img
                  src={getAvatarUrl(video.author?.image, video.author?.username)}
                  alt={video.author?.username || "Author"}
                  className="h-7 w-7 rounded-full object-cover"
                  loading="lazy"
                  width={28}
                  height={28}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className={`font-medium leading-tight line-clamp-2 ${isCompact ? "text-sm" : "text-base"}`}>
                  {video.title}
                </h3>
                {!isCompact && (
                  <>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {video.author?.name || video.author?.username || "Unknown"}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span>{formatViews(video.viewCount)} visualizzazioni</span>
                      <span>·</span>
                      <span>{formatDate(video.createdAt)}</span>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

function formatDurationFromSeconds(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface VideoGridProps {
  videos: Video[];
  title?: string;
  emptyMessage?: string;
  compact?: boolean;
}

export function VideoGrid({ videos, title, emptyMessage = "No videos found", compact = false }: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      <div className="grid gap-4 sm:gap-6 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            size={compact ? "compact" : "md"}
            className="hover:shadow-lg transition-shadow"
          />
        ))}
      </div>
    </div>
  );
}

interface CategoryGridProps {
  categories: Array<{ id: string; name: string; slug: string; videoCount?: number; color?: string | null }>;
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/c/${category.slug}`}
          className="group block"
          prefetch={false}
        >
          <div className="rounded-xl border bg-card p-4 text-center transition-all duration-200 group-hover:scale-105 group-hover:shadow-md">
            <div
              className="mx-auto mb-2 h-10 w-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: category.color || "hsl(var(--primary))" }}
            >
              <span className="text-lg font-bold text-white">
                {category.name.charAt(0)}
              </span>
            </div>
            <h3 className="text-sm font-medium">{category.name}</h3>
            {category.videoCount && (
              <p className="text-xs text-muted-foreground mt-1">
                {formatViews(category.videoCount)} video
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
