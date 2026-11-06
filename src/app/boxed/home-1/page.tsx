import BoxedHome1Client from "./boxed-home-1-client";
import { fetchBazzibaVideos, fetchVideoCategories, fetchLatestPosts } from "@/data/wp";

export const revalidate = 300;

export default async function BoxedHome1Page() {
  const [videos, categories, posts] = await Promise.all([
    fetchBazzibaVideos(50).catch(() => []),
    fetchVideoCategories().catch(() => []),
    fetchLatestPosts(3).catch(() => []),
  ]);

  return <BoxedHome1Client videos={videos} categories={categories} posts={posts} />;
}
