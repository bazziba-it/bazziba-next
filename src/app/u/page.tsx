import { fetchAllWpUsers, fetchArtistStats } from "@/data/wp";
import { ArtistsDirectory, type ArtistEntry } from "@/components/user/artists-directory";
import { Users } from "lucide-react";

export const revalidate = 600;

export const metadata = {
  title: "Artisti",
  description: "Tutti gli artisti della community Bazziba — cantanti, musicisti, poeti, ballerini e altri.",
};

export default async function ArtistsPage() {
  const [users, stats] = await Promise.all([
    fetchAllWpUsers().catch(() => []),
    fetchArtistStats().catch(() => new Map<number, { count: number; dominantCategory: string; dominantCategorySlug: string }>()),
  ]);

  const entries: ArtistEntry[] = users.map((u) => {
    const s = stats.get(u.id);
    return {
      user: u,
      count: s?.count ?? 0,
      dominantCategory: s?.dominantCategory ?? "",
      dominantCategorySlug: s?.dominantCategorySlug ?? "",
    };
  });

  const activeCount = entries.filter((e) => e.count > 0).length;

  return (
    <div className="min-h-screen bg-[#050a14] text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#00f2ff] font-semibold mb-3">
            <Users className="h-4 w-4" />
            La community
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Gli artisti di Bazziba</h1>
          <p className="text-white/50 mt-3 max-w-xl mx-auto">
            {entries.length} membri pubblicano la loro arte — {activeCount} attivi negli ultimi video.
            Trova il tuo artista preferito e guarda i suoi lavori.
          </p>
        </div>

        <ArtistsDirectory artists={entries} />
      </div>
    </div>
  );
}
