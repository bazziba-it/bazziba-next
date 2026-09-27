/** @format */

"use client";

import { Badge, Separator } from "@/components/ui";
import { CommentsSection } from "@/components/video/comments-section";
import { formatDate } from "@/lib/utils";
import type { Video } from "@/types";
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
import { useState } from "react";

// Mock video data
function getMockVideo(id: string): Video | null {
  const mockVideos: Record<string, Video> = {
    vid1: {
      id: "vid1",
      title: "Il Canto dell'Anima - Performance Live",
      slug: "il-canto-dellanima-performance-live",
      description:
        "Un'interpretazione emozionale di una canzone originale. Questo video cattura l'energia grezza di una performance live in un piccolo club di Milano. L'arte del canto come forma di espressione personale e condivisione emotiva.",
      thumbnail: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&h=450&fit=crop",
      duration: 342,
      viewCount: 1248,
      likeCount: 89,
      status: "PUBLISHED",
      visibility: "PUBLIC",
      authorId: "user-1",
      createdAt: "2025-09-10T10:00:00Z",
      updatedAt: "2025-09-10T10:00:00Z",
      author: { id: "user-1", username: "elena_arte", name: "Elena Rossi", image: "https://i.pravatar.com/64?img=1" },
      category: { id: "cat-1", name: "Cantanti", slug: "cantanti", color: "#FFD700" },
      tags: ["#cover", "#live", "#piano", "#milano"],
    },
    vid2: {
      id: "vid2",
      title: "Pittura Astrale - Il Viaggio di un Artista",
      slug: "pittura-astrale-il-viaggio-di-un-artista",
      description:
        "Una panoramica del processo creativo dietro le opere astrali di Marco Bianchi. Dal bozzetto all'opera finale, scopri il metodo e l'ispirazione che muovono queste meravigliose creazioni.",
      thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=450&fit=crop",
      duration: 892,
      viewCount: 892,
      likeCount: 56,
      status: "PUBLISHED",
      visibility: "PUBLIC",
      authorId: "user-3",
      createdAt: "2025-09-08T14:30:00Z",
      updatedAt: "2025-09-08T14:30:00Z",
      author: { id: "user-3", username: "marco_pittore", name: "Marco Bianchi", image: "https://i.pravatar.com/64?img=3" },
      category: { id: "cat-9", name: "Pittori", slug: "pittori", color: "#FF6B6B" },
      tags: ["#astratto", "#pittura", "#arte", "#creativo"],
    },
    vid3: {
      id: "vid3",
      title: "Danza Contemporanea - Spazio e Movimento",
      slug: "danza-contemporanea-spazio-e-movimento",
      description:
        "Un'esplorazione della danza moderna in uno spazio urbano. Sofia Marchetti e il suo collettivo esplorano la relazione tra corpo e architettura.",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop",
      duration: 456,
      viewCount: 2156,
      likeCount: 234,
      status: "PUBLISHED",
      visibility: "PUBLIC",
      authorId: "user-2",
      createdAt: "2025-09-05T16:45:00Z",
      updatedAt: "2025-09-05T16:45:00Z",
      author: { id: "user-2", username: "sofia_danza", name: "Sofia Marchetti", image: "https://i.pravatar.com/64?img=2" },
      category: { id: "cat-7", name: "Ballerini", slug: "ballerini", color: "#9333EA" },
      tags: ["#danza", "#performance", "#arte", "#modern"],
    },
  };
  return mockVideos[id] || null;
}

const mockSuggestedVideos: Video[] = [
  {
    id: "vid4",
    title: "Poesia Sonora - La Città che Dorme",
    slug: "poesia-sonora-la-citta-che-dorme",
    description: "Una poesia recitata con una partitura musicale originale.",
    thumbnail: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&h=300&fit=crop",
    duration: 234,
    viewCount: 567,
    likeCount: 34,
    status: "PUBLISHED",
    visibility: "PUBLIC",
    authorId: "user-4",
    createdAt: "2025-09-03T09:15:00Z",
    updatedAt: "2025-09-03T09:15:00Z",
    author: { id: "user-4", username: "luca_poeta", name: "Luca Verdi", image: "https://i.pravatar.com/64?img=4" },
    category: { id: "cat-5", name: "Poeti", slug: "poeti", color: "#0EA5E9" },
    tags: [],
  },
  {
    id: "vid5",
    title: "Mix DJ - Vibrations of the Night",
    slug: "mix-dj-vibrations-of-the-night",
    description: "Un viaggio musicale attraverso le ombre della notte.",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
    duration: 678,
    viewCount: 3421,
    likeCount: 412,
    status: "PUBLISHED",
    visibility: "PUBLIC",
    authorId: "user-6",
    createdAt: "2025-09-01T20:00:00Z",
    updatedAt: "2025-09-01T20:00:00Z",
    author: { id: "user-6", username: "dj_alex", name: "Alex Sound", image: "https://i.pravatar.com/64?img=6" },
    category: { id: "cat-6", name: "DJ", slug: "dj", color: "#8B5CF6" },
    tags: [],
  },
  {
    id: "vid7",
    title: "Musa Urbana - Frammenti di Luce",
    slug: "musa-urbana-frammenti-di-luce",
    description: "Installazione artistica interattiva in un parco pubblico.",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
    duration: 520,
    viewCount: 890,
    likeCount: 67,
    status: "PUBLISHED",
    visibility: "PUBLIC",
    authorId: "user-7",
    createdAt: "2025-09-15T12:00:00Z",
    updatedAt: "2025-09-15T12:00:00Z",
    author: { id: "user-7", username: "musa_urbana", name: "Musa Urbana", image: "https://i.pravatar.com/64?img=7" },
    category: { id: "cat-4", name: "Artisti Di Strada", slug: "artisti-di-strada", color: "#10B981" },
    tags: [],
  },
];

const chapters = [
  { time: 0, title: "Introduzione" },
  { time: 30, title: "Presentazione del pezzo" },
  { time: 75, title: "Esecuzione" },
  { time: 180, title: "Conclusione e ringraziamenti" },
];

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
  const { id } = require("react").use(params);
  const video = getMockVideo((id as string) || "vid1");
  const [isPlaying, setIsPlaying] = useState(true);
  const [copied, setCopied] = useState(false);
  const [quality, setQuality] = useState("hd1080");
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!video) {
    return (
      <div className="container mx-auto py-12">
        <h1 className="text-2xl font-bold">Video Non Trovato</h1>
        <p className="text-muted-foreground mt-2">Il video che stai cercando non esiste o è stato rimosso.</p>
        <a href="/" className="text-brand-yellow font-medium inline-flex items-center gap-1 mt-4">
          Torna alla Home
        </a>
      </div>
    );
  }

  const duration = video.duration
    ? `${Math.floor(video.duration / 60)}:${String(Math.floor(video.duration % 60)).padStart(2, "0")}`
    : null;

  const totalTime = chapters.reduce((max, ch) => Math.max(max, ch.time), 0);
  const progressPercent = isPlaying ? ((chapters[2].time / totalTime) * 100) : 42;

  return (
    <div className="py-4 md:py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Main Video Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video Player */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden group">
              <iframe
                src={`https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1&enablejsapi=1&autoplay=1`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />

              {/* Chapter progress overlay */}
              <div className="absolute bottom-14 left-0 right-0 flex items-center gap-1 px-2">
                {chapters.map((ch, i) => (
                  <div key={i} className="flex-1 h-0.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-yellow rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                ))}
              </div>

              {/* Big play/pause indicator */}
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
                  isPlaying ? "opacity-0" : "opacity-100",
                )}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  {isPlaying ? (
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[14px] border-l-white border-b-[10px] border-b-transparent border-r-0 ml-1" />
                  ) : (
                    <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[18px] border-l-white border-b-[12px] border-b-transparent border-r-0 ml-1" />
                  )}
                </div>
              </div>
            </div>

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
                {video.likeCount + (isLiked ? 1 : 0)}
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
              <h1 className="text-xl font-bold md:text-2xl">{video.title}</h1>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs font-medium">
                  {video.category?.name || "Generale"}
                </Badge>
                {duration && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {duration}
                  </span>
                )}
                <span className="text-sm text-muted-foreground">
                  {Math.round(video.viewCount / 1000)}K visualizzazioni
                </span>
                <span className="text-sm text-muted-foreground">
                  Pubblicato {formatDate(video.createdAt)}
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
                  {chapters.map((ch, i) => (
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
                  {video.description}
                </p>
                {video.description && video.description.length > 200 && (
                  <button
                    onClick={() => setShowFullDesc(!showFullDesc)}
                    className="text-sm text-brand-yellow hover:underline mt-1"
                  >
                    {showFullDesc ? "Mostra meno" : "Mostra di più"}
                  </button>
                )}
              </div>

              {/* Tags */}
              {video.tags && video.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {video.tags.map((tag) => (
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
                  src={video.author?.image || "https://i.pravatar.com/64?img=1"}
                  alt={video.author?.name || video.author?.username || "Author"}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-brand-yellow/30"
                />
                <div>
                  <p className="font-semibold">{video.author?.name || video.author?.username}</p>
                  <p className="text-sm text-muted-foreground">@{video.author?.username}</p>
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
              {mockSuggestedVideos.map((v) => (
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
                      {v.author?.name || v.author?.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(v.viewCount / 1000)}K views
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
