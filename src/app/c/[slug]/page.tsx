import { fetchBazzibaVideos, type BazzibaVideo } from "@/data/wp";
import { VideoCard } from "@/components/video/video-card";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getCategory(slug: string): Promise<{ name: string; description?: string; videoCount: number } | null> {
  const wpCategories: Record<string, string> = {
    tutti: "Tutti i video",
    musica: "Musica",
    video: "Video",
    vota: "VOTA",
    informazione: "Informazione",
    tv: "TV",
    giochi: "Giochi",
    live: "Live",
  };
  if (!wpCategories[slug]) return null;
  return { name: wpCategories[slug], videoCount: 0 };
}

async function getCategoryVideos(slug: string): Promise<BazzibaVideo[]> {
  if (slug === "tutti") return fetchBazzibaVideos();
  const all = await fetchBazzibaVideos();
  return all.filter((v) => v.categorySlug === slug);
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const videos = await getCategoryVideos(slug);

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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">{category.name}</h1>
        {category.description && <p className="text-white/50 mb-6">{category.description}</p>}

        {videos.length === 0 ? (
          <p className="text-center py-20 text-white/40">Nessun video nella categoria {category.name}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((v) => (
              <VideoCard key={v.id} video={v} />
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
