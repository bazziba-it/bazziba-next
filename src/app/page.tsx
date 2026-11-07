/** @format */

import WpHomepageContent from "@/components/homepage/wp-homepage-content";
import {
  fetchBazzibaVideos,
  fetchVideosByTagSlug,
  fetchVideosByCategory,
  fetchContests,
  fetchVideoCategories,
  fetchSiteStats,
  fetchSitePulse,
} from "@/data/wp";

export const revalidate = 300;

export default async function Page() {
  const [videos, featured, contests, categories, stats, pulse] = await Promise.all([
    fetchBazzibaVideos(10).catch(() => []),
    fetchVideosByTagSlug("in-evidenza", 5).catch(() => []),
    fetchContests(2).catch(() => []),
    fetchVideoCategories().catch(() => []),
    fetchSiteStats().catch(() => ({ videos: 0, artists: 0, comments: 0 })),
    fetchSitePulse(3).catch(() => []),
  ]);

  // Rotating hero: in-evidenza picks, filled with latest videos when short
  const heroVideos = featured.length >= 3 ? featured.slice(0, 5) : videos.slice(0, 5);

  const now = Date.now();
  const MONTHS: Record<string, number> = {
    gennaio: 0, febbraio: 1, marzo: 2, aprile: 3, maggio: 4, giugno: 5,
    luglio: 6, agosto: 7, settembre: 8, ottobre: 9, novembre: 10, dicembre: 11,
  };
  const contestCards = contests.map((c) => {
    const title = typeof c.title === "string" ? c.title : c.title.rendered;
    // Edition closed when its month has passed ("Settembre 2025" → 2025-09-30)
    const m = title.toLowerCase().match(/([a-zàèéìòù]+)\s*(\d{4})/);
    const end = m && m[1] in MONTHS ? new Date(parseInt(m[2]), MONTHS[m[1]] + 1, 0).getTime() : null;
    return {
      title,
      subtitle: "Contest Bazziba",
      closed: end != null && end < now,
    };
  });

  // Real featured artists: first unique authors from the latest videos
  const seen = new Set<string>();
  const featuredArtists = videos
    .filter((v) => {
      if (seen.has(v.authorName)) return false;
      seen.add(v.authorName);
      return true;
    })
    .slice(0, 3)
    .map((v) => ({ name: v.authorName, role: v.category, avatar: v.authorAvatar }));

  // Category rails: latest arrivals + top 4 categories by count, deduped
  // across rails so discovery sections don't repeat the same videos
  const topCategories = categories.slice(0, 4);
  const railVideos = await Promise.all(
    topCategories.map((cat) => fetchVideosByCategory(cat.id, 12).catch(() => []))
  );
  const shown = new Set<string>(videos.map((v) => v.id));
  const rails = [
    { name: "Ultimi arrivi", slug: "tutti", count: stats.videos || videos.length, videos },
    ...topCategories.map((cat, i) => {
      const fresh = railVideos[i].filter((v) => !shown.has(v.id)).slice(0, 8);
      fresh.forEach((v) => shown.add(v.id));
      return { name: cat.name, slug: cat.slug, count: cat.count, videos: fresh };
    }),
  ].filter((r) => r.videos.length > 0);

  return (
    <WpHomepageContent
      heroVideos={heroVideos}
      contestCards={contestCards}
      featuredArtists={featuredArtists}
      categories={categories}
      stats={stats}
      pulse={pulse}
      rails={rails}
    />
  );
}
