import { fetchBazzibaVideos, fetchVideosByTagSlug, type BazzibaVideo } from "@/data/wp";
import { VideoGrid } from "@/components/video/video-card";
import Link from "next/link";

export const revalidate = 300;

const FEED_LABELS: Record<string, string> = {
  latest: "Ultime Pubblicazioni",
  trending: "In Evidenza",
  subscribed: "Canali Seguiti",
};

async function getVideos(type: string): Promise<BazzibaVideo[]> {
  // "trending" = the site's real editorial pick: video_tag "in-evidenza"
  if (type === "trending") return fetchVideosByTagSlug("in-evidenza", 30).catch(() => []);
  if (type === "subscribed") return []; // requires auth — honest empty state below
  return fetchBazzibaVideos(30).catch(() => []);
}

export default async function FeedTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type = "latest" } = await params;
  const feedType = type in FEED_LABELS ? type : "latest";
  const videos = await getVideos(feedType);

  return (
    <div className="min-h-screen bg-[#050a14] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff]" />
          {FEED_LABELS[feedType]}
        </h1>

        {feedType === "subscribed" ? (
          <p className="text-center py-20 text-white/40">
            Il feed dei canali seguiti richiede un account —{" "}
            <a href="https://bazziba.it/registrazione/" target="_blank" rel="noopener noreferrer" className="text-[#00f2ff] hover:underline">
              registrati su bazziba.it
            </a>
            .
          </p>
        ) : (
          <VideoGrid
            videos={videos}
            showAuthor
            emptyMessage="Nessun video disponibile in questo feed."
          />
        )}

        <div className="mt-8 pt-6 border-t border-white/5">
          <Link href="/" className="text-[#00f2ff] hover:underline text-sm">← Torna alla Home</Link>
        </div>
      </div>
    </div>
  );
}
