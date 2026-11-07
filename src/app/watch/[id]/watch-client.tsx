/** @format */

"use client";

import Image from "next/image";

import { Badge, Separator, GlassCard, GlassSurface } from "@/components/ui";
import { CommentsSection } from "@/components/video/comments-section";
import VideoPlayer from "@/components/video/video-player";
import { RealAvatar, ThumbPlaceholder } from "@/components/ui/media";
import type { BazzibaVideo, WpComment } from "@/data/wp";
import { motion } from "framer-motion";
import { MOTION } from "@/components/ui/glass";
import {
  ThumbsUp,
  Share2,
  Clock,
  Copy,
  Check,
  MessageSquare,
  Download,
  User,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { formatDurationSec } from "@/lib/format";

function formatDateIT(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return "";
  }
}

/** Reads the REAL duration from the loaded MP4 metadata — no fabricated durations. */
function RealDuration({ mp4 }: { mp4: string }) {
  const [dur, setDur] = useState<string | null>(null);
  return (
    <>
      <video
        src={mp4}
        preload="metadata"
        className="hidden"
        onLoadedMetadata={(e) => {
          const s = Math.floor(e.currentTarget.duration);
          if (Number.isFinite(s) && s > 0) {
            setDur(`${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`);
          }
        }}
      />
      {dur && (
        <span className="text-sm text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {dur}
        </span>
      )}
    </>
  );
}

interface WatchClientProps {
  video: BazzibaVideo;
  mp4: string | null;
  poster: string | null;
  comments: WpComment[];
  related: BazzibaVideo[];
  moreFromAuthor: BazzibaVideo[];
  authorVideoCount: number;
  sourceUrl: string;
}

export default function WatchClient({ video, mp4, poster, comments, related, moreFromAuthor, authorVideoCount, sourceUrl }: WatchClientProps) {
  const [copied, setCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const description = video.description || `Un video di ${video.authorName} su Bazziba.`;

  return (
    <div className="py-4 md:py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Main Video Column */}
          <div className="lg:col-span-2 space-y-4">
            <GlassSurface tier="card" data-glass-scroll className="rounded-xl overflow-hidden">
              {mp4 ? (
                <VideoPlayer
                  url={mp4}
                  poster={poster ?? undefined}
                  title={video.title}
                  autoPlay
                  className="rounded-xl"
                />
              ) : (
                <div className="aspect-video">
                  <ThumbPlaceholder title={video.title} className="h-full w-full" />
                </div>
              )}
            </GlassSurface>

            {/* Action row — like is local UI state (real counts aren't exposed by the API) */}
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setIsLiked(!isLiked)}
                whileTap={{ scale: 0.92 }}
                transition={MOTION.press}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isLiked
                    ? "bg-red-500/10 text-red-500 border border-red-500/20"
                    : "bg-card/50 text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {/* heart pop micro-interaction (ADR-0003) */}
                <motion.span
                  key={String(isLiked)}
                  initial={{ scale: isLiked ? 0.5 : 1 }}
                  animate={{ scale: 1 }}
                  transition={MOTION.press}
                  className="flex"
                >
                  <ThumbsUp className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                </motion.span>
                Mi piace
              </motion.button>

              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-card/50 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    Copiato!
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    Condividi
                  </>
                )}
              </button>

              {/* Real download: the actual MP4 from bazziba.it */}
              {mp4 && (
                <a
                  href={mp4}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-card/50 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
                >
                  <Download className="h-4 w-4" />
                  Scarica
                </a>
              )}
            </div>

            {/* Title & real meta */}
            <div className="space-y-3">
              <h1 className="text-xl font-bold md:text-2xl">{video.title}</h1>

              <div className="flex items-center gap-2 flex-wrap">
                {video.categorySlug && (
                  <Link href={`/c/${video.categorySlug}`}>
                    <Badge variant="outline" className="text-xs font-medium hover:border-[#00f2ff]/50">
                      {video.category}
                    </Badge>
                  </Link>
                )}
                {/* Real duration: API media_details first, MP4 metadata fallback */}
                {video.durationSec ? (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDurationSec(video.durationSec)}
                  </span>
                ) : (
                  mp4 && <RealDuration mp4={mp4} />
                )}
                {/* Real resolution from the MP4 media_details */}
                {video.resolution && (
                  <Badge variant="outline" className="text-xs font-mono">
                    {video.resolution}
                  </Badge>
                )}
                {video.date && (
                  <span className="text-sm text-muted-foreground">
                    Pubblicato il {formatDateIT(video.date)}
                  </span>
                )}
              </div>

              {/* Real description from the WP excerpt */}
              <div className="pt-2">
                <p className={`text-muted-foreground leading-relaxed transition-all ${!showFullDesc ? "line-clamp-3" : ""}`}>
                  {description}
                </p>
                {description.length > 200 && (
                  <button
                    onClick={() => setShowFullDesc(!showFullDesc)}
                    className="text-sm text-[#00f2ff] hover:underline mt-1"
                  >
                    {showFullDesc ? "Mostra meno" : "Mostra di più"}
                  </button>
                )}
              </div>
            </div>

            <Separator />

            {/* Channel — real author, links to the real profile page */}
            <div className="flex items-center justify-between pt-2">
              <Link href={`/u/${video.authorSlug || video.authorId}`} className="flex items-center gap-4 group">
                <RealAvatar
                  src={video.authorAvatar}
                  name={video.authorName}
                  className="h-12 w-12 rounded-full ring-2 ring-[#00f2ff]/30 text-sm"
                />
                <div>
                  <p className="font-semibold group-hover:text-[#00f2ff] transition-colors">{video.authorName}</p>
                  <p className="text-sm text-muted-foreground">
                    {authorVideoCount > 0 ? `${authorVideoCount} video pubblicati` : "Artista su Bazziba"}
                  </p>
                </div>
              </Link>
            </div>

            {/* Real comments */}
            <CommentsSection videoId={video.id} initialComments={comments} sourceUrl={sourceUrl} />
          </div>

          {/* Sidebar — real related videos from the same category + author */}
          <div className="space-y-6 lg:sticky lg:top-24">
            {moreFromAuthor.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 text-lg flex items-center gap-2">
                  <User className="h-4 w-4 text-[#00f2ff]" />
                  Altro da {video.authorName}
                </h3>
                <div className="space-y-3">
                  {moreFromAuthor.map((v) => (
                    <Link key={v.id} href={`/watch/${v.id}`} className="flex gap-3 group">
                      <div className="relative flex-shrink-0 w-32 aspect-video bg-muted rounded-lg overflow-hidden">
                        {v.thumbnail ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover group-hover:brightness-110 transition-brightness" loading="lazy" />
                        ) : (
                          <ThumbPlaceholder title={v.title} className="h-full w-full" />
                        )}
                        {v.durationSec && (
                          <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[10px] font-mono px-1 rounded">
                            {formatDurationSec(v.durationSec)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-[#00f2ff] transition-colors">{v.title}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-3 text-lg flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#00f2ff]" />
                Video Suggeriti
              </h3>
            {related.length === 0 ? (
              <p className="text-sm text-white/30">Nessun video correlato in questa categoria.</p>
            ) : (
              <div className="space-y-3">
                {related.map((v) => (
                  <Link key={v.id} href={`/watch/${v.id}`} className="flex gap-3 group">
                    <div className="relative flex-shrink-0 w-40 aspect-video bg-muted rounded-lg overflow-hidden transition-shadow group-hover:shadow-md">
                      {v.thumbnail ? (
                        <Image
                          src={v.thumbnail}
                          alt={v.title}
                          fill
                          sizes="160px"
                          className="object-cover group-hover:brightness-110 transition-brightness"
                          unoptimized
                        />
                      ) : (
                        <ThumbPlaceholder title={v.title} className="h-full w-full" />
                      )}
                      {v.durationSec && (
                        <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[10px] font-mono px-1 rounded">
                          {formatDurationSec(v.durationSec)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 group-hover:text-[#00f2ff] transition-colors">
                        {v.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{v.authorName}</p>
                      <p className="text-xs text-muted-foreground">{v.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
