/** @format */

import { VideoGrid, CategoryGrid } from "@/components/video/video-card";
import { LoadMoreVideos } from "@/components/video/load-more";
import { fetchBazzibaVideos, fetchVideoCategories } from "@/data/wp";
import Link from "next/link";

export const revalidate = 300;

export default async function FeedPage() {
  const [videos, categories] = await Promise.all([
    fetchBazzibaVideos(24).catch(() => []),
    fetchVideoCategories().catch(() => []),
  ]);

  return (
    <div className="min-h-screen bg-[#050a14] text-white">
      {/* Filter tabs — real feeds */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <span className="px-4 py-3 text-sm font-medium border-b-2 border-[#00f2ff] text-white">
              Recenti
            </span>
            <Link
              href="/feed/trending"
              className="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-white/50 hover:text-white transition-colors"
            >
              In Evidenza
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6">
          <CategoryGrid categories={categories} className="hidden lg:block" />
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff]" />
              Ultime pubblicazioni
            </h2>
            {videos.length === 0 ? (
              <p className="text-center py-12 text-white/40">Nessun video trovato — bazziba.it non risponde.</p>
            ) : (
              <LoadMoreVideos initialVideos={videos} scope="latest" perPage={24} showAuthor />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
