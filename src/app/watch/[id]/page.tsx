/** @format */

import { notFound } from "next/navigation";
import {
  fetchVideoByIdOrSlug,
  fetchVideoMedia,
  fetchComments,
  fetchVideosByCategory,
} from "@/data/wp";
import WatchClient from "./watch-client";

export const revalidate = 300;

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const video = await fetchVideoByIdOrSlug(id);
  if (!video) notFound();

  const [media, comments, relatedAll] = await Promise.all([
    fetchVideoMedia(video.id).catch(() => ({ mp4: null, poster: null })),
    fetchComments(video.id).catch(() => []),
    video.categoryId ? fetchVideosByCategory(video.categoryId, 7).catch(() => []) : Promise.resolve([]),
  ]);

  const related = relatedAll.filter((v) => v.id !== video.id).slice(0, 5);
  const mp4 = media.mp4 ?? null;
  const poster = media.poster ?? video.thumbnail;

  return (
    <WatchClient
      video={video}
      mp4={mp4}
      poster={poster}
      comments={comments}
      related={related}
      sourceUrl={`https://bazziba.it/video/${video.slug}/`}
    />
  );
}
