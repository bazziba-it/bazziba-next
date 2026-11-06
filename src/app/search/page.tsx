import SearchClient from "./search-client";
import { searchVideos, searchUsers, fetchVideoCategories } from "@/data/wp";

export const revalidate = 60;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  if (!query) {
    return <SearchClient query="" videos={[]} users={[]} categories={[]} />;
  }

  const [videos, users, allCategories] = await Promise.all([
    searchVideos(query, 24).catch(() => []),
    searchUsers(query, 10).catch(() => []),
    fetchVideoCategories().catch(() => []),
  ]);

  const qLower = query.toLowerCase();
  const categories = allCategories.filter(
    (c) => c.name.toLowerCase().includes(qLower) || c.slug.includes(qLower)
  );

  return <SearchClient query={query} videos={videos} users={users} categories={categories} />;
}
