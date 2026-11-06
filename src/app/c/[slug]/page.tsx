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
      {/* Local header removed: the root layout GlassNav is the single docked
          surface per page (ADR-0001 §6.4/§8) — this page had two stacked headers. */}

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
