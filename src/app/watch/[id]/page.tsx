import { VideoPlayer } from "@/components/video/video-player";
import { VideoGrid } from "@/components/video/video-card";
import { Badge, Separator } from "@/components/ui";
import { formatViews, formatDate } from "@/lib/utils";
import type { Video } from "@/types";
import { MessageCircle, ThumbsUp, ThumbsDown, Share2, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

// Mock video data for demonstration
function getMockVideo(id: string): Video | null {
  const mockVideos: Record<string, Video> = {
    "vid-1": {
      id: "vid-1",
      title: "Il Canto dell'Anima - Performance Live",
      slug: "il-canto-dellanima-performance-live",
      description: "Un'interpretazione emozionante di una canzone originale. Questo video cattura l'energia grezza di una performance live in un piccolo club di Milano. L'arte del canto come forma di espressione personale e condivisione emotiva.",
      thumbnail: "https://images.unsplash.com/photo-1516204474435-7c6b6b7c8e9a?w=400&h=300&fit=crop",
      duration: 342,
      viewCount: 1248,
      status: "PUBLISHED",
      visibility: "PUBLIC",
      authorId: "user-1",
      createdAt: "2025-09-10T10:00:00Z",
      updatedAt: "2025-09-10T10:00:00Z",
      author: {
        id: "user-1",
        username: "elena_arte",
        name: "Elena Rossi",
        image: "https://i.pravatar.com/64?img=1",
      },
      category: { id: "cat-1", name: "Cantanti", slug: "cantanti", color: "#FFD700" },
      tags: [],
    },
    "vid-2": {
      id: "vid-2",
      title: "Pittura Astrale - Il Viaggio di un Artista",
      slug: "pittura-astrale-il-viaggio-di-un-artista",
      description: "Una panoramica del processo creativo dietro le opere astrali di Marco Bianchi. Dal bozzetto all'opera finale, scopri il metodo e l'ispirazione che muovono queste meravigliose creazioni.",
      thumbnail: "https://images.unsplash.com/photo-1578301979-642908803e52?w=400&h=300&fit=crop",
      duration: 892,
      viewCount: 892,
      status: "PUBLISHED",
      visibility: "PUBLIC",
      authorId: "user-3",
      createdAt: "2025-09-08T14:30:00Z",
      updatedAt: "2025-09-08T14:30:00Z",
      author: {
        id: "user-3",
        username: "marco_pittore",
        name: "Marco Bianchi",
        image: "https://i.pravatar.com/64?img=3",
      },
      category: { id: "cat-9", name: "Pittori", slug: "pittori", color: "#FF6B6B" },
      tags: [],
    },
    "vid-3": {
      id: "vid-3",
      title: "Danza Contemporanea - Spazio e Movimento",
      slug: "danza-contemporanea-spazio-e-movimento",
      description: "Un'esplorazione della danza moderna in uno spazio urbano. Sofia Marchetti e il suo collettivo esplorano la relazione tra corpo e architettura.",
      thumbnail: "https://images.unsplash.com/photo-15188376950205-8d818a1a3175?w=400&h=300&fit=crop",
      duration: 456,
      viewCount: 2156,
      status: "PUBLISHED",
      visibility: "PUBLIC",
      authorId: "user-2",
      createdAt: "2025-09-05T16:45:00Z",
      updatedAt: "2025-09-05T16:45:00Z",
      author: {
        id: "user-2",
        username: "sofia_danza",
        name: "Sofia Marchetti",
        image: "https://i.pravatar.com/64?img=2",
      },
      category: { id: "cat-7", name: "Ballerini", slug: "ballerini", color: "#9333EA" },
      tags: [],
    },
  };
  return mockVideos[id] || null;
}

const mockSuggestedVideos: Video[] = [
  {
    id: "vid-4",
    title: "Poesia Sonora - La Citta che Dorme",
    slug: "poesia-sonora-la-citta-che-dorme",
    description: "Una poesia recitata con una partitura musicale originale.",
    thumbnail: "https://images.unsplash.com/photo-1521737606499-dead08582903?w=400&h=300&fit=crop",
    duration: 234,
    viewCount: 567,
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
    id: "vid-5",
    title: "Mix DJ - Vibrations of the Night",
    slug: "mix-dj-vibrations-of-the-night",
    description: "Un viaggio musicale attraverso le ombre della notte.",
    thumbnail: "https://images.unsplash.com/photo-1514826877100-6c79bae3de4c?w=400&h=300&fit=crop",
    duration: 678,
    viewCount: 3421,
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
    id: "vid-7",
    title: "Musa Urbana - Frammenti di Luce",
    slug: "musa-urbana-frammenti-di-luce",
    description: "Installazione artistica interattiva in un parco pubblico.",
    thumbnail: "https://images.unsplash.com/photo-1578301979-642908803e52?w=400&h=300&fit=crop",
    duration: 520,
    viewCount: 890,
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

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = require("react").use(params);
  const video = getMockVideo(id || "vid-1");

  if (!video) {
    return (
      <div className="container mx-auto py-12">
        <h1 className="text-2xl font-bold">Video Non Trovato</h1>
        <p className="text-muted-foreground mt-2">
          Il video che stai cercando non esiste o è stato rimosso.
        </p>
        <a href="/" className="text-brand-yellow font-medium inline-flex items-center gap-1 mt-4">
          Torna alla Home
        </a>
      </div>
    );
  }

  const duration = video.duration
    ? `${Math.floor(video.duration / 60)}:${String(Math.floor(video.duration % 60)).padStart(2, "0")}`
    : null;

  return (
    <div className="py-4 md:py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Main Video Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${video.id === "vid-1" ? "dQw4w9WgXcQ" : video.id === "vid-2" ? "dQw4w9WgXcQ" : "dQw4w9WgXcQ"}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              ></iframe>
            </div>

            {/* Video Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">
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
                  Pubblicato il {formatDate(video.createdAt)}
                </span>
              </div>

              <h1 className="text-2xl font-bold">{video.title}</h1>

              <p className="text-muted-foreground leading-relaxed">
                {video.description}
              </p>

              {/* Like/Share Actions */}
              <div className="flex items-center gap-4 pt-2">
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ThumbsUp className="h-4 w-4" />
                  {video.viewCount}
                </button>
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ThumbsDown className="h-4 w-4" />
                </button>
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Share2 className="h-4 w-4" />
                  Condividi
                </button>
              </div>

              <Separator />

              {/* Author section */}
              <div className="flex items-center gap-4 pt-2">
                <img
                  src={video.author?.image || "https://i.pravatar.com/64?img=1"}
                  alt={video.author?.name || video.author?.username || "Author"}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-border"
                />
                <div>
                  <p className="font-semibold">{video.author?.name || video.author?.username}</p>
                  <p className="text-sm text-muted-foreground">@{video.author?.username}</p>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Commenti
              </h3>
              <p className="text-sm text-muted-foreground">
                Il sistema commenti sarà implementato con Supabase Realtime.
              </p>
            </div>
          </div>

          {/* Sidebar - Suggested Videos */}
          <div className="space-y-3">
            <h3 className="font-semibold mb-3">Video Suggeriti</h3>
            <div className="space-y-3">
              {mockSuggestedVideos.map((v) => (
                <a
                  key={v.id}
                  href={`/watch/${v.id}`}
                  className="flex gap-3 group"
                >
                  <div className="relative flex-shrink-0 w-40 aspect-video">
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      className="h-full w-full rounded object-cover group-hover:brightness-110 transition-brightness"
                      loading="lazy"
                    />
                    {v.duration && (
                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                        {Math.floor(v.duration / 60)}:{String(Math.floor(v.duration % 60)).padStart(2, "0")}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2 group-hover:text-brand-yellow transition-colors">
                      {v.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">
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
