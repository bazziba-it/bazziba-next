/** @format */

import WpHomepageContent from "@/components/homepage/wp-homepage-content";
import {
  fetchBazzibaVideos,
  fetchVideosByTagSlug,
  fetchContests,
  fetchVideoCategories,
} from "@/data/wp";

export const revalidate = 300;

export default async function Page() {
  const [videos, featured, contests, categories] = await Promise.all([
    fetchBazzibaVideos(30).catch(() => []),
    fetchVideosByTagSlug("in-evidenza", 5).catch(() => []),
    fetchContests(2).catch(() => []),
    fetchVideoCategories().catch(() => []),
  ]);

  const heroVideo = featured[0] ?? videos[0] ?? null;
  const sliderVideos = featured.length >= 3 ? featured : videos.slice(0, 5);

  const contestCards = contests.map((c) => ({
    title: typeof c.title === "string" ? c.title : c.title.rendered,
    subtitle: "Contest Bazziba",
  }));

  // Real featured artists: first unique authors with names from the latest videos
  const seen = new Set<string>();
  const featuredArtists = videos
    .filter((v) => {
      if (seen.has(v.authorName)) return false;
      seen.add(v.authorName);
      return true;
    })
    .slice(0, 3)
    .map((v) => ({ name: v.authorName, role: v.category, avatar: v.authorAvatar }));

  return (
    <WpHomepageContent
      videos={videos}
      sliderVideos={sliderVideos}
      heroVideo={heroVideo}
      contestCards={contestCards}
      featuredArtists={featuredArtists}
      categories={categories}
    />
  );
}
