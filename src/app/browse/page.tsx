/** @format */
import { fetchBazzibaVideos, fetchVideosByCategory, fetchVideoCategories, fetchSiteStats } from "@/data/wp";
import WpHomepageContent from "@/components/homepage/wp-homepage-content";
import { revalidate } from "next/cache";
import { type Rail } from "@/components/homepage/category-rails";

export const revalidate = 300;

export default async function BrowsePage() {
  const [videos, categories, stats] = await Promise.all([
    fetchBazzibaVideos(10).catch(() => []),
    fetchVideoCategories().catch(() => []),
    fetchSiteStats().catch(() => ({ videos: 0, artists: 0, comments: 0 })),
  ]);

  // Logic derived from src/app/page.tsx to build rails structure
  const topCategories = categories.slice(0, 4);
  const railVideosPromises = topCategories.map((cat) => fetchVideosByCategory(cat.id, 12).catch(() => []));
  const railVideos = await Promise.all(railVideosPromises);
  
  const shown = new Set<string>(videos.map((v) => v.id));
  const rails: Rail[] = [
    { name: "Ultimi arrivi", slug: "tutti", count: stats.videos || videos.length, videos },
    ...topCategories.map((cat, i) => {
      const fresh = railVideos[i].filter((v) => !shown.has(v.id)).slice(0, 8);
      fresh.forEach((v) => shown.add(v.id));
      return { name: cat.name, slug: cat.slug, count: cat.count, videos: fresh };
    }),
  ].filter((r) => r.videos.length > 0);

  return (
    <WpHomepageContent
      // Minimal required props for structure, derived from home page
      heroVideos={[]}
      contestCards={[]}
      featuredArtists={[]}
      categories={categories}
      stats={stats}
      pulse={[]}
      rails={rails}
    />
  );
}