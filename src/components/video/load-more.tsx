"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Plus } from "lucide-react";
import { VideoCard } from "@/components/video/video-card";
import { MOTION } from "@/components/ui/glass";
import type { BazzibaVideo } from "@/data/wp";

interface LoadMoreProps {
  /** Server-rendered first page. */
  initialVideos: BazzibaVideo[];
  scope: "latest" | "category" | "search";
  categoryId?: number;
  query?: string;
  perPage?: number;
  showAuthor?: boolean;
}

/**
 * "Carica altri" infinite-ish grid: appends real WP pages via /api/wp-feed.
 * The button hides when WP returns a short (last) page.
 */
export function LoadMoreVideos({ initialVideos, scope, categoryId, query, perPage = 24, showAuthor }: LoadMoreProps) {
  const [videos, setVideos] = useState<BazzibaVideo[]>(initialVideos);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialVideos.length >= perPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const seen = useRef(new Set(initialVideos.map((v) => v.id)));

  // Reset when the server payload changes (navigation between categories/searches)
  useEffect(() => {
    setVideos(initialVideos);
    setPage(1);
    setHasMore(initialVideos.length >= perPage);
    seen.current = new Set(initialVideos.map((v) => v.id));
  }, [initialVideos, perPage]);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const nextPage = page + 1;
      const params = new URLSearchParams({ scope, page: String(nextPage), perPage: String(perPage) });
      if (scope === "category" && categoryId) params.set("categoryId", String(categoryId));
      if (scope === "search" && query) params.set("q", query);
      const res = await fetch(`/api/wp-feed?${params}`, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { videos: BazzibaVideo[]; hasMore: boolean };
      const fresh = data.videos.filter((v) => !seen.current.has(v.id));
      fresh.forEach((v) => seen.current.add(v.id));
      setVideos((prev) => [...prev, ...fresh]);
      setPage(nextPage);
      setHasMore(data.hasMore && fresh.length > 0);
    } catch {
      setError("Caricamento non riuscito — riprova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video, i) => (
          <VideoCard key={video.id} video={video} showAuthor={showAuthor} staggerIndex={i % 8} />
        ))}
      </div>

      {error && <p className="text-center py-4 text-sm text-red-400">{error}</p>}

      {hasMore && (
        <div className="text-center py-8">
          <motion.button
            onClick={loadMore}
            disabled={loading}
            whileTap={{ scale: 0.96 }}
            transition={MOTION.press}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00f2ff]/10 text-[#00f2ff] font-medium rounded-full hover:bg-[#00f2ff]/20 transition-colors text-sm disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Carica altri video
          </motion.button>
        </div>
      )}
    </div>
  );
}
