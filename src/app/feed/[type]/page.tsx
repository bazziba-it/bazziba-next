import { fetchBazzibaVideos, type BazzibaVideo } from "@/data/wp";
import { VideoCard } from "@/components/video/video-card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function getVideos(type: string): Promise<BazzibaVideo[]> {
  const all = await fetchBazzibaVideos(30);
  if (type === "trending") {
    return [...all].sort((a, b) => {
      const av = parseInt(a.viewCount.replace(/\D/g, "") || "0");
      const bv = parseInt(b.viewCount.replace(/\D/g, "") || "0");
      return bv - av;
    });
  }
  return all;
}

export default async function FeedPage({ params }: { params: Promise<{ type: string }> }) {
  const { type = "latest" } = await params;
  const feedType = ["latest", "trending", "subscribed"].includes(type) ? type : "latest";
  const videos = await getVideos(feedType);

  const feedLabels = {
    latest: "Ultime Pubblicazioni",
    trending: "Video Popolari",
    subscribed: "Canali Seguiti",
  };

  return (
    <div className="min-h-screen bg-[#050a14] text-white">
      {/* Local header removed: the root layout's GlassNav is the single docked
          surface per page (ADR-0001 §6.4/§8) — this page had two stacked headers. */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff]" />
          {feedLabels[feedType as keyof typeof feedLabels] || "Ultime Pubblicazioni"}
        </h1>

        {videos.length === 0 ? (
          <p className="text-center py-20 text-white/40">Nessun video disponibile</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((v, i) => (
              <VideoCard key={v.id} video={v} staggerIndex={i} />
            ))}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-white/5">
          <Link href="/" className="text-[#00f2ff] hover:underline text-sm">← Torna alla Home</Link>
        </div>
      </div>
    </div>
  );
}
