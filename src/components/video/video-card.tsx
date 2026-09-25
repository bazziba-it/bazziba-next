"use client";

import Link from "next/link";
import { Play, Clock } from "lucide-react";
import { Badge } from "@/components/ui";
import { getThumbnailUrl, getAvatarUrl } from "@/lib/server";
import type { Video } from "@/types";

function formatDurationFromSeconds(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

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
      <div className="space-y-3">
        {/* Thumbnail */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-muted shadow-md">
          <img
            src={getThumbnailUrl(video.thumbnail)}
            alt={video.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
          />
          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Play className="h-5 w-5 text-foreground drop-shadow-lg" />
            </div>
          </div>
          {/* Duration badge */}
          {video.duration && (
            <div className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded-md font-mono">
              {formatDurationFromSeconds(video.duration)}
            </div>
          )}
          {/* Category badge */}
          {video.category && (
            <div className="absolute top-1.5 left-1.5 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-md">
              {video.category.name}
            </div>
          )}
        </div>

        {/* Video info */}
        <div className="flex gap-3">
          {showAuthor && (
            <>
              <div className="flex-shrink-0">
                <img
                  src={getAvatarUrl(video.author?.image, video.author?.username)}
                  alt={video.author?.username || "Author"}
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-border"
                  loading="lazy"
                  width={32}
                  height={32}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className={`font-medium leading-tight line-clamp-2 ${
                  isCompact ? "text-sm" : "text-base"
                }`}>
                  {video.title}
                </h3>
                {!isCompact && (
                  <>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {video.author?.name || video.author?.username || "Unknown"}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Clock className="h-3 w-3" />
                      <span>{Math.round(video.duration / 60)} min</span>
                      <span className="text-xs">·</span>
                      <Badge variant="secondary" className="text-xs px-1.5 py-0">
                        {video.viewCount} visualizzazioni
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            </>}
          {!showAuthor && (
            <div className="min-w-0 flex-1">
              <h3 className={`font-medium leading-tight line-clamp-2 ${
                isCompact ? "text-sm" : "text-base"
              }`}>
                {video.title}
              </h3>
              {!isCompact && (
                <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                  {video.author?.name || video.author?.username || "Unknown"}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

interface VideoGridProps {
  videos: Video[];
  title?: string;
  emptyMessage?: string;
  compact?: boolean;
  showAuthor?: boolean;
}

export function VideoGrid({ videos, title, emptyMessage = "No videos found", compact = false, showAuthor = true }: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex h-10 w-10 rounded-full bg-muted items-center justify-center mb-3">
          <Play className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      <div className="grid gap-5 sm:gap-6 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            size={compact ? "compact" : "md"}
            showAuthor={showAuthor}
            className="hover:shadow-xl transition-shadow"
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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/c/${category.slug}`}
          className="group block"
          prefetch={false}
        >
          <div className="rounded-xl border bg-card p-4 text-center transition-all duration-300 group-hover:shadow-md group-hover:scale-[1.02]">
            <div
              className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-yellow/10"
              style={{ backgroundColor: category.color ? `${category.color}20` : undefined }}
            >
              <span className="text-lg font-bold text-white">
                {category.name.charAt(0)}
              </span>
            </div>
            <h3 className="text-sm font-medium">{category.name}</h3>
            {category.videoCount && (
              <p className="text-xs text-muted-foreground mt-1">
                {category.videoCount} video
              </p>
            )}
          </div>
        </Link>
      )))}
    </div>
  );
}
