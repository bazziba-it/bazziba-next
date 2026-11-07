/** @format */

import { notFound } from "next/navigation";
import {
  fetchVideoByIdOrSlug,
  fetchVideoMedia,
  fetchComments,
  fetchVideosByCategory,
  fetchVideosByAuthor,
  fetchAuthorVideoCount,
  fetchVideoViews,
  fetchVideosByCollection,
} from "@/data/wp";
import WatchClient from "./watch-client";
import type { Metadata } from "next";

export const revalidate = 300;

/** Per-video SEO from real WP data (title, description, OG thumbnail). */
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const video = await fetchVideoByIdOrSlug(id).catch(() => null);
  if (!video) return { title: "Video non trovato" };
  const description = video.description || `Guarda "${video.title}" di ${video.authorName} su BAZZIBA!`;
  return {
    title: video.title,
    description,
    openGraph: {
      title: video.title,
      description,
      type: "video.other",
      images: video.thumbnail ? [{ url: video.thumbnail }] : undefined,
    },
    twitter: { card: "summary_large_image", title: video.title, description },
  };
}

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const video = await fetchVideoByIdOrSlug(id);
  if (!video) notFound();

  const [media, comments, relatedAll, authorVideos, authorVideoCount, views, collectionVideos] = await Promise.all([
    fetchVideoMedia(video.id).catch(() => ({ mp4: null, poster: null, durationSec: null, resolution: null })),
    fetchComments(video.id).catch(() => []),
    video.categoryId ? fetchVideosByCategory(video.categoryId, 7).catch(() => []) : Promise.resolve([]),
    fetchVideosByAuthor(video.authorId, 6).catch(() => []),
    fetchAuthorVideoCount(video.authorId).catch(() => 0),
    fetchVideoViews(video.slug).catch(() => null),
    video.collectionId ? fetchVideosByCollection(video.collectionId, 20).catch(() => []) : Promise.resolve([]),
  ]);

  const related = relatedAll.filter((v) => v.id !== video.id).slice(0, 5);
  const moreFromAuthor = authorVideos.filter((v) => v.id !== video.id).slice(0, 5);

  // Up-next: the following video in the collection, else first related
  const collectionOrdered = collectionVideos.filter((v) => v.id !== video.id);
  const upNext = collectionOrdered[0] ?? related[0] ?? null;
  const mp4 = media.mp4 ?? null;
  const poster = media.poster ?? video.thumbnail;
  const merged = { ...video, durationSec: media.durationSec ?? video.durationSec, resolution: media.resolution ?? video.resolution };

  // VideoObject structured data (Google video rich results) — real fields only
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: merged.title,
    description: merged.description || undefined,
    thumbnailUrl: merged.thumbnail ?? undefined,
    uploadDate: merged.date,
    duration: merged.durationSec ? `PT${Math.floor(merged.durationSec / 60)}M${merged.durationSec % 60}S` : undefined,
    contentUrl: mp4 ?? undefined,
    author: { "@type": "Person", name: merged.authorName },
    isPartOf: { "@type": "WebSite", name: "BAZZIBA!", url: "https://bazziba.it" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <WatchClient
        video={merged}
        mp4={mp4}
        poster={poster}
        comments={comments}
        related={related}
        moreFromAuthor={moreFromAuthor}
        authorVideoCount={authorVideoCount}
        views={views}
        collectionName={video.collectionId ? video.collectionName : ""}
        collectionVideos={collectionOrdered.slice(0, 8)}
        upNext={upNext ? { href: `/watch/${upNext.id}`, title: upNext.title, thumbnail: upNext.thumbnail } : null}
        sourceUrl={`https://bazziba.it/video/${video.slug}/`}
      />
    </>
  );
}
