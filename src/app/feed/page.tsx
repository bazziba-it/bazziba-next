/** @format */

"use client";

import { useState, useEffect, useCallback } from "react";
import { VideoGrid, CategoryGrid } from "@/components/video/video-card";
import type { Video, Category } from "@/types";
import { Filter, Loader2 } from "lucide-react";
import { fetchBazzibaVideos, type BazzibaVideo } from "@/data/wp";

// Convert BazzibaVideo (from WP) to Video type expected by VideoGrid component
function wpToVideo(v: BazzibaVideo): Video {
  return {
    id: v.id,
    title: v.title,
    slug: v.slug,
    description: "",
    thumbnail: v.thumbnail,
    videoUrl: v.videoUrl || "",
    duration: v.duration,
    viewCount: v.viewCount,
    status: "PUBLISHED",
    visibility: "PUBLIC",
    authorId: v.authorName.toLowerCase().replace(/\s/g, "_"),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      id: v.authorName.toLowerCase().replace(/\s/g, "_"),
      username: v.authorName.toLowerCase().replace(/\s/g, "_"),
      name: v.authorName,
      image: v.authorAvatar,
    },
    category: {
      id: v.categorySlug,
      name: v.category,
      slug: v.categorySlug,
      color: "#00f2ff",
    },
    tags: [],
  };
}

type FilterMode = "latest" | "trending";

export default function FeedPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterMode>("latest");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  const loadVideos = useCallback(async () => {
    setLoading(true);
    try {
      const allVideos = await fetchBazzibaVideos(50);
      const converted = allVideos.map(wpToVideo);
      setVideos(converted.slice(0, page * PAGE_SIZE));
    } catch (err) {
      console.error("Failed to load videos:", err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    setPage(1);
    loadVideos();
  }, [filter, loadVideos]);

  return (
    <div className="min-h-screen bg-[#050a14] text-white">
      {/* Local header removed: the root layout's GlassNav is the single docked
          surface per page (ADR-0001 §6.4/§8) — this page had two stacked headers. */}

      {/* Filter tabs */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setFilter("latest")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                filter === "latest"
                  ? "border-[#00f2ff] text-white"
                  : "border-transparent text-white/50 hover:text-white"
              }`}
            >
              Recenti
            </button>
            <button
              onClick={() => setFilter("trending")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                filter === "trending"
                  ? "border-[#00f2ff] text-white"
                  : "border-transparent text-white/50 hover:text-white"
              }`}
            >
              Popolari
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-6">
          {/* Categories sidebar */}
          <CategoryGrid
            categories={categories}
            activeCategory="all"
            onSelect={() => {}}
            className="hidden md:block"
          />

          {/* Video grid */}
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-[#00f2ff]" />
                <span className="ml-3 text-white/50 text-sm">Caricamento video...</span>
              </div>
            ) : videos.length === 0 ? (
              <p className="text-center py-20 text-white/50">Nessun video trovato</p>
            ) : (
              <VideoGrid videos={videos} onLoadMore={loadVideos} hasMore={videos.length < 50} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
