/** @format */

"use client";

import { Badge, Separator } from "@/components/ui";
import { CommentsSection } from "@/components/video/comments-section";
import VideoPlayer from "@/components/video/video-player";
import { formatDate } from "@/lib/utils";
import { fetchBazzibaVideos, type BazzibaVideo } from "@/data/wp";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Clock,
  Copy,
  Check,
  Download,
  Flag,
  Settings,
  Maximize,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect, use } from "react";

// Sample MP4 URL used when no real video URL is available from WP
const SAMPLE_MP4 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

// In-memory cache for fetched WP videos (avoids re-fetching on navigation)
const videoCache = new Map<string, BazzibaVideo | null>();

/**
 * Fetch a single WP video by its numeric ID.
 * Uses fetchBazzibaVideos to get all videos, then finds by ID.
 * Caches the result.
 */
async function fetchWpVideoById(id: string): Promise<BazzibaVideo | null> {
  // Check cache first
  if (videoCache.has(id)) return videoCache.get(id) ?? null;

  try {
    const allVideos = await fetchBazzibaVideos();
    const found = allVideos.find((v) => v.id === id);
    videoCache.set(id, found ?? null);
    return found ?? null;
  } catch {
    videoCache.set(id, null);
    return null;
  }
}

/** Generate a fallback video object when WP fetch fails */
function fallbackVideo(id: string): BazzibaVideo {
  return {
    id,
    slug: `video-${id}`,
    title: "Video Non Disponibile",
    thumbnail: "https://picsum.photos/seed/fallback-" + id + "/800/450",
    authorName: "Artista",
    authorAvatar: "https://i.pravatar.cc/64?img=12",
    category: "Viral Videos",
    categorySlug: "viral-videos",
    viewCount: "0",
    likes: "0",
    duration: 180,
    videoUrl: undefined,
  };
}

// Suggested videos shown in sidebar — takes first few WP videos
let suggestedCache: BazzibaVideo[] | null = null;
async function getSuggestedVideos(): Promise<BazzibaVideo[]> {
  if (suggestedCache) return suggestedCache;
  try {
    const all = await fetchBazzibaVideos();
    suggestedCache = all.slice(0, 5);
    return suggestedCache;
  } catch {
    return [];
  }
}

/** Derive a readable description from the video title and context */
function deriveDescription(video: BazzibaVideo): string {
  const cat = video.category;
  const author = video.authorName;
  return `Un video di ${author} nella categoria ${cat}. Scopri il contenuto originale della community Bazziba.`;
}

/** Derive tags from title + category */
function deriveTags(video: BazzibaVideo): string[] {
  return [
    `#${video.category.replace(/\s+/g, "")}`,
    "#Bazziba",
    video.authorName.split(" ")[0].toLowerCase().replace(/[^a-z]/g, "") ? `#${video.authorName.split(" ")[0].toLowerCase().replace(/[^a-z]/g, "")}` : "#artista",
  ].filter(Boolean);
}

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function cn(...args: any[]) {
  return args.filter(Boolean).join(" ");
}

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const videoId = typeof id === "string" ? id : String(id ?? "");

  const [video, setVideo] = useState<BazzibaVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [copied, setCopied] = useState(false);
  const [quality, setQuality] = useState("hd1080");
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [suggested, setSuggested] = useState<BazzibaVideo[]>([]);

  // Fetch video data when ID is available
  useEffect(() => {
    if (!videoId) return;
    setLoading(true);
    fetchWpVideoById(videoId).then((v) => {
      setVideo(v ?? fallbackVideo(videoId));
      setLoading(false);
    });
    // Also fetch suggested in background
    getSuggestedVideos().then(setSuggested);
  }, [videoId]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050a14]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-[#00f2ff]" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="container mx-auto py-12">
        <h1 className="text-2xl font-bold">Video Non Trovato</h1>
        <p className="text-muted-foreground mt-2">
          Il video che stai cercando non esiste o è stato rimosso.
        </p>
        <a href="/" className="text-brand-cyan font-medium inline-flex items-center gap-1 mt-4">
          Torna alla Home
        </a>
      </div>
    );
  }

  // Adapt BazzibaVideo to the fields the watch page UI expects
  const title = video.title;
  const thumbnail = video.thumbnail;
  const durationSec = video.duration;
  const viewCountNum = parseInt(video.viewCount.replace(/\D/g, "")) || 0;
  const viewCountView = video.viewCount;
  const authorName = video.authorName;
  const authorAvatar = video.authorAvatar;
  const authorUsername = authorName.toLowerCase().replace(/\s+/g, "_");
  const categoryName = video.category;
  const description = deriveDescription(video);
  const tags = deriveTags(video);
  const likedCount = 42 + (isLiked ? 1 : 0); // fallback like count

  const duration = durationSec
    ? `${Math.floor(durationSec / 60)}:${String(Math.floor(durationSec % 60)).padStart(2, "0")}`
    : null;

  const totalTime = 180; // fallback for chapter calc
  const progressPercent = isPlaying ? 42 : 42;

  return (
    <div className="py-4 md:py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Main Video Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video Player */}
            <VideoPlayer
              url={video.videoUrl || SAMPLE_MP4}
              poster={thumbnail}
              title={title}
              autoPlay={isPlaying}
              className="rounded-xl"
            />

            {/* Action Buttons Row */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isLiked
                    ? "bg-red-500/10 text-red-500 border border-red-500/20"
                    : "bg-card/50 text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
              >
                <ThumbsUp className="h-4 w-4" />
                {likedCount}
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-card/50 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200">
                <ThumbsDown className="h-4 w-4" />
              </button>

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

              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-card/50 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200">
                <Download className="h-4 w-4" />
                Scarica
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-card/50 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200">
                <Flag className="h-4 w-4" />
                Segnala
              </button>

              <div className="ml-auto flex items-center gap-1">
                <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors">
                  <Settings className="h-4 w-4" />
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors">
                  <Maximize className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Title & Meta */}
            <div className="space-y-3">
              <h1 className="text-xl font-bold md:text-2xl">{title}</h1>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs font-medium">
                  {categoryName}
                </Badge>
                {duration && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {duration}
                  </span>
                )}
                <span className="text-sm text-muted-foreground">
                  {viewCountView} visualizzazioni
                </span>
                <span className="text-sm text-muted-foreground">
                  Pubblicato {formatDate(new Date().toISOString())}
                </span>
              </div>

              {/* Quality Selector */}
              <div className="flex items-center gap-2">
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="text-xs bg-background border border-input rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-yellow text-muted-foreground"
                >
                  <option value="hd1080">1080p HD</option>
                  <option value="hd720">720p HD</option>
                  <option value="sd480">480p SD</option>
                  <option value="sd360">360p SD</option>
                </select>
              </div>

              {/* Chapters */}
              <div className="glass-card text-card-foreground p-3 border rounded-lg">
                <p className="font-medium text-sm mb-2">Capitoli del video</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { time: 0, title: "Introduzione" },
                    { time: 30, title: "Presentazione" },
                    { time: 75, title: "Esecuzione" },
                    { time: durationSec || 180, title: "Conclusione" },
                  ].map((ch, i) => (
                    <button
                      key={i}
                      className="text-xs text-muted-foreground hover:text-brand-yellow hover:bg-brand-yellow/10 px-2 py-1 rounded transition-colors"
                    >
                      {formatTime(ch.time)} - {ch.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="pt-2">
                <p className={cn("text-muted-foreground leading-relaxed transition-all", !showFullDesc && "line-clamp-3")}>
                  {description}
                </p>
                {description.length > 200 && (
                  <button
                    onClick={() => setShowFullDesc(!showFullDesc)}
                    className="text-sm text-brand-yellow hover:underline mt-1"
                  >
                    {showFullDesc ? "Mostra meno" : "Mostra di più"}
                  </button>
                )}
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-accent/50 px-2 py-1 rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Channel Section */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-4">
                <img
                  src={authorAvatar || "https://i.pravatar.com/64?img=1"}
                  alt={authorName || "Author"}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-brand-yellow/30"
                />
                <div>
                  <p className="font-semibold">{authorName}</p>
                  <p className="text-sm text-muted-foreground">@{authorUsername}</p>
                  <p className="text-xs text-muted-foreground">1.2K iscritti</p>
                </div>
              </div>
              <button
                onClick={() => setIsSubscribed(!isSubscribed)}
                className={cn(
                  "bg-brand-yellow hover:bg-brand-gold-hover text-black font-semibold px-5 py-2 rounded-full transition-all duration-200",
                  isSubscribed && "bg-accent text-foreground hover:bg-accent/80",
                )}
              >
                {isSubscribed ? "Iscritto" : "Iscriviti"}
              </button>
            </div>

            {/* Comments Section */}
            <CommentsSection videoId={video.id} commentCount={24} />
          </div>

          {/* Sidebar - Recommended Videos */}
          <div className="space-y-3 lg:sticky lg:top-24">
            <h3 className="font-semibold mb-3 text-lg flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              Video Suggeriti
            </h3>
            <div className="space-y-3">
              {suggested.map((v) => (
                <a
                  key={v.id}
                  href={`/watch/${v.id}`}
                  className="flex gap-3 group"
                >
                  <div className="relative flex-shrink-0 w-40 aspect-video bg-muted rounded-lg overflow-hidden transition-shadow group-hover:shadow-md">
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      className="h-full w-full object-cover group-hover:brightness-110 transition-brightness"
                      loading="lazy"
                    />
                    {v.duration && (
                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded font-mono">
                        {Math.floor(v.duration / 60)}:{String(Math.floor(v.duration % 60)).padStart(2, "0")}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2 group-hover:text-brand-yellow transition-colors">
                      {v.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {v.authorName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {v.viewCount} visualizzazioni
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
