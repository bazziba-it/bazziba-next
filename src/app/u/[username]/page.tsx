import type { Video } from "@/types";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

// Mock user data for demonstration
const mockUsers: Record<string, {
  id: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  videoCount: number;
  followerCount: number;
  followingCount: number;
  videos: Video[];
}> = {
  musa_urbana: {
    id: "user-7",
    username: "musa_urbana",
    name: "Musa Urbana",
    image: "https://i.pravatar.com/64?img=7",
    bio: "Street artist e artista urbano. Trasformo le città in gallerie aperte.",
    videoCount: 18,
    followerCount: 3247,
    followingCount: 42,
    videos: [
      {
        id: "vid-7",
        title: "Musa Urbana - Frammenti di Luce",
        slug: "musa-urbana-frammenti-di-luce",
        description: "Installazione artistica interattiva in un parco pubblico",
        thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
        duration: 520,
        viewCount: "890",
        status: "PUBLISHED",
        visibility: "PUBLIC",
        authorId: "user-7",
        createdAt: "2025-09-15T12:00:00Z",
        updatedAt: "2025-09-15T12:00:00Z",
        author: { id: "user-7", username: "musa_urbana", name: "Musa Urbana", image: "https://i.pravatar.com/64?img=7" },
        category: { id: "cat-4", name: "Artisti Di Strata", slug: "artisti-di-strada", color: "#10B981" },
        tags: [],
      },
    ],
  },
  leika_b: {
    id: "user-3",
    username: "leika_b",
    name: "Leika Barone",
    image: "https://i.pravatar.com/64?img=3",
    bio: "Artista visiva e creatrice di contenuti sperimentali.",
    videoCount: 35,
    followerCount: 8931,
    followingCount: 87,
    videos: [
      {
        id: "vid-3",
        title: "Leika Barone - Performance Notturna",
        slug: "leika-barone-performance-notturna",
        description: "Performance artistica sotto le luci della città",
        thumbnail: "https://images.unsplash.com/photo-1459749411175-0446500d2254?w=400&h=300&fit=crop",
        duration: 945,
        viewCount: 12400,
        status: "PUBLISHED",
        visibility: "PUBLIC",
        authorId: "user-3",
        createdAt: "2025-10-01T10:00:00Z",
        updatedAt: "2025-10-01T10:00:00Z",
        author: { id: "user-3", username: "leika_b", name: "Leika Barone", image: "https://i.pravatar.com/64?img=3" },
        category: { id: "cat-1", name: "Performance", slug: "performance", color: "#8B5CF6" },
        tags: [],
      },
    ],
  },
};

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = Object.entries(mockUsers).find(([, u]) => u.username === username);

  if (!user) notFound();

  const [id, data] = user as [string, (typeof mockUsers)[string]];

  return (
    <div className="min-h-screen bg-[#050a14] text-white">
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
              <Link href="/" className="text-sm text-white/60 hover:text-white transition-colors">Home</Link>
              <Link href="/feed/trending" className="text-sm text-white/60 hover:text-white transition-colors">Trending</Link>
              <Link href="/contest" className="text-sm text-white/60 hover:text-white transition-colors">Contest</Link>
              <Link href="/search" className="text-sm text-white/60 hover:text-white transition-colors">Search</Link>
            </nav>
          </div>
          <Link href="/upload" className="px-4 py-2 bg-[#00f2ff] text-black font-bold rounded-full text-sm hover:bg-[#00d4e6] transition-colors flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Carica Video
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Profile header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <img
            src={data.image}
            alt={data.name}
            className="w-24 h-24 rounded-full border-2 border-[#00f2ff]/50 object-cover"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{data.name}</h1>
            <p className="text-white/50 text-sm">@{data.username}</p>
            <p className="mt-3 text-white/70 leading-relaxed">{data.bio}</p>
          </div>
          <button className="mt-2 md:mt-0 px-6 py-2.5 bg-[#00f2ff] text-black font-bold rounded-full hover:bg-[#00d4e6] transition-colors text-sm flex items-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25" />
            </svg>
            Iscriviti
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
            <p className="text-2xl font-bold text-[#00f2ff]">{data.videoCount}</p>
            <p className="text-sm text-white/40 mt-1">Video</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
            <p className="text-2xl font-bold text-[#00f2ff]">{data.followerCount.toLocaleString()}</p>
            <p className="text-sm text-white/40 mt-1"> follower</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
            <p className="text-2xl font-bold text-[#00f2ff]">{data.followingCount}</p>
            <p className="text-sm text-white/40 mt-1">is following</p>
          </div>
        </div>

        {/* Videos */}
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff]" />
          Video ({data.videos.length})
        </h2>

        {data.videos.length === 0 ? (
          <p className="text-center py-12 text-white/40">Nessun video pubblicato</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {data.videos.map((v) => (
              <Link
                key={v.id}
                href={`/watch/${v.id}`}
                className="group block bg-[#0a0e1a] border border-white/5 rounded-xl overflow-hidden hover:border-[#00f2ff]/20 transition-all hover:shadow-lg hover:shadow-black/30"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={v.thumbnail || "https://picsum.photos/seed/fallback/400/225"}
                    alt={v.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded font-mono">
                    {Math.floor((v.duration ?? 0) / 60)}:${((v.duration ?? 0) % 60).toString().padStart(2, "0")}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-[#00f2ff]/90 flex items-center justify-center">
                      <svg className="w-6 h-6 text-black ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm line-clamp-2 text-white group-hover:text-[#00f2ff] transition-colors">
                    {v.title}
                  </h3>
                  {typeof v.viewCount === "string" ? v.viewCount : String(v.viewCount ?? 0)} visualizzazioni
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
