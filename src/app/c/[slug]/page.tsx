import { fetchVideoCategories, fetchVideosByCategory } from "@/data/wp";
import { VideoGrid } from "@/components/video/video-card";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 300;

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await fetchVideoCategories().catch(() => []);
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const videos = await fetchVideosByCategory(category.id, 30).catch(() => []);

  return (
    <div className="min-h-screen bg-[#050a14] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff]" />
          {category.name}
          <span className="text-sm font-normal text-white/30">({category.count} video su bazziba.it)</span>
        </h1>

        <div className="mt-6">
          <VideoGrid
            videos={videos}
            showAuthor
            emptyMessage={`Nessun video nella categoria ${category.name}`}
          />
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
          <Link href="/" className="text-[#00f2ff] hover:underline text-sm">← Torna alla Home</Link>
          <Link href="/feed" className="text-white/40 hover:text-white text-sm">Tutte le categorie</Link>
        </div>
      </div>
    </div>
  );
}
