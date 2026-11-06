import WpStaticPage from "@/components/layout/wp-static-page";
import { fetchVideoCategories } from "@/data/wp";
import Link from "next/link";

export const revalidate = 3600;

export default async function AboutPage() {
  // Real category showcase with real counts from the video_category taxonomy
  const categories = await fetchVideoCategories().catch(() => []);
  const icons: Record<string, string> = {
    cantanti: "🎤", musicisti: "🎸", "arti-varie": "🎨", "artisti-di-strada": "🎭",
    poeti: "📜", dj: "🎧", ballerini: "💃", cinema: "🎬", pittori: "🖼️",
  };

  return (
    <>
      <WpStaticPage slug="cose-bazziba" fallbackTitle="Chi Siamo" />
      {categories.length > 0 && (
        <div className="container mx-auto px-4 max-w-4xl pb-12">
          <div className="border-t border-white/5 pt-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Le nostre categorie</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/c/${cat.slug}`}
                  className="flex items-center gap-3 p-4 rounded-xl bg-card border border-white/5 hover:border-[#00f2ff]/30 transition-colors"
                >
                  <span className="text-2xl">{icons[cat.slug] ?? "🎬"}</span>
                  <div>
                    <h3 className="font-medium text-foreground">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground">{cat.count} video</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
