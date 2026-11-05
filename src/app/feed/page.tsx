/** @format */

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#050a14]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <svg width="40" height="16" viewBox="0 0 100 64" fill="none">
                <path d="M20 48V16a8 8 0 0 1 8-8h44a8 8 0 0 1 8 8v32a8 8 0 0 1-8 8H28a8 8 0 0 1-8-8Z" fill="#00f2ff" />
                <rect x="24" y="22" width="8" height="20" rx="2" fill="#00f2ff" />
                <rect x="36" y="28" width="6" height="14" rx="2" fill="#00f2ff" />
                <rect x="46" y="24" width="8" height="18" rx="2" fill="#00f2ff" />
                <rect x="58" y="30" width="6" height="12" rx="2" fill="#00f2ff" />
                <rect x="68" y="20" width="8" height="22" rx="2" fill="#00f2ff" />
              </svg>
              <span className="text-lg font-bold text-white">BAZZIBA!</span>
            </Link>
            <nav className="hidden md:flex gap-6 ml-8">
              <Link href="/" className="text-sm text-white/60 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/feed/trending" className="text-sm text-white/60 hover:text-white transition-colors">
                Trending
              </Link>
              <Link href="/contest" className="text-sm text-white/60 hover:text-white transition-colors">
                Contest
              </Link>
              <Link href="/search" className="text-sm text-white/60 hover:text-white transition-colors">
                Search
              </Link>
            </nav>
          </div>
          <Link
            href="/upload"
            className="px-4 py-2 bg-[#00f2ff] text-black font-bold rounded-full text-sm hover:bg-[#00d4e6] transition-colors flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Carica Video
          </Link>
        </div>
      </header>

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
