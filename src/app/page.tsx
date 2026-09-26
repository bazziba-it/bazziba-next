import { VideoGrid, CategoryGrid } from "@/components/video/video-card";
import type { Video, Category } from "@/types";
import { Trophy, Play, Upload } from "lucide-react";

// Mock data for demonstration
const mockVideos: Video[] = [
  {
    id: "vid-1",
    title: "Il Canto dell'Anima - Performance Live",
    slug: "il-canto-dellanima-performance-live",
    description: "Un'interpretazione emozionante di una canzone originale",
    thumbnail: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&h=300&fit=crop",
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
  {
    id: "vid-2",
    title: "Pittura Astrale - Il Viaggio di un Artista",
    slug: "pittura-astrale-il-viaggio-di-un-artista",
    description: "Una panoramica del processo creativo dietro le opere astrali",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
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
  {
    id: "vid-3",
    title: "Danza Contemporanea - Spazio e Movimento",
    slug: "danza-contemporanea-spazio-e-movimento",
    description: "Un'esplorazione della danza moderna in uno spazio urbano",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
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
    category: { id: "cat-7", name: "Ballerini", slug: "ballerini", color: "#9333ea" },
    tags: [],
  },
  {
    id: "vid-4",
    title: "Poesia Sonora - La Citta che Dorme",
    slug: "poesia-sonora-la-citta-che-dorme",
    description: "Una poesia recitata con una partitura musicale originale",
    thumbnail: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&h=300&fit=crop",
    duration: 234,
    viewCount: 567,
    status: "PUBLISHED",
    visibility: "PUBLIC",
    authorId: "user-4",
    createdAt: "2025-09-03T09:15:00Z",
    updatedAt: "2025-09-03T09:15:00Z",
    author: {
      id: "user-4",
      username: "luca_poeta",
      name: "Luca Verdi",
      image: "https://i.pravatar.com/64?img=4",
    },
    category: { id: "cat-5", name: "Poeti", slug: "poeti", color: "#0EA5E9" },
    tags: [],
  },
  {
    id: "vid-5",
    title: "Mix DJ - Vibrations of the Night",
    slug: "mix-dj-vibrations-of-the-night",
    description: "Un viaggio musicale attraverso le ombre della notte",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
    duration: 678,
    viewCount: 3421,
    status: "PUBLISHED",
    visibility: "PUBLIC",
    authorId: "user-6",
    createdAt: "2025-09-01T20:00:00Z",
    updatedAt: "2025-09-01T20:00:00Z",
    author: {
      id: "user-6",
      username: "dj_alex",
      name: "Alex Sound",
      image: "https://i.pravatar.com/64?img=6",
    },
    category: { id: "cat-6", name: "DJ", slug: "dj", color: "#8B5CF6" },
    tags: [],
  },
  {
    id: "vid-6",
    title: "Fotografia di Strada - Roma Notturna",
    slug: "fotografia-di-strada-roma-notturna",
    description: "Immagini che raccontano la citta dopo il tramonto",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    duration: 180,
    viewCount: 789,
    status: "PUBLISHED",
    visibility: "PUBLIC",
    authorId: "user-5",
    createdAt: "2025-08-30T18:00:00Z",
    updatedAt: "2025-08-30T18:00:00Z",
    author: {
      id: "user-5",
      username: "giulia_foto",
      name: "Giulia Neri",
      image: "https://i.pravatar.com/64?img=5",
    },
    category: { id: "cat-3", name: "Arti Varie", slug: "arti-varie", color: "#F59E0B" },
    tags: [],
  },
];

const mockCategories: Category[] = [
  { id: "cat-1", name: "Cantanti", slug: "cantanti", color: "#FFD700", videoCount: 42 },
  { id: "cat-3", name: "Arti Varie", slug: "arti-varie", color: "#F59E0B", videoCount: 87 },
  { id: "cat-4", name: "Artisti Di Strada", slug: "artisti-di-strada", color: "#10B981", videoCount: 31 },
  { id: "cat-5", name: "Poeti", slug: "poeti", color: "#0EA5E9", videoCount: 28 },
  { id: "cat-6", name: "DJ", slug: "dj", color: "#8B5CF6", videoCount: 56 },
  { id: "cat-7", name: "Ballerini", slug: "ballerini", color: "#9333EA", videoCount: 19 },
  { id: "cat-8", name: "Cinema", slug: "cinema", color: "#EF4444", videoCount: 44 },
  { id: "cat-9", name: "Pittori", slug: "pittori", color: "#FF6B6B", videoCount: 35 },
];

const mockContestVideos: Video[] = [
  {
    id: "vid-7",
    title: "Musa Urbana - Frammenti di Luce",
    slug: "musa-urbana-frammenti-di-luce",
    description: "Installazione artistica interattiva in un parco pubblico",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
    duration: 520,
    viewCount: 890,
    status: "PUBLISHED",
    visibility: "PUBLIC",
    authorId: "user-7",
    createdAt: "2025-09-15T12:00:00Z",
    updatedAt: "2025-09-15T12:00:00Z",
    author: {
      id: "user-7",
      username: "musa_urbana",
      name: "Musa Urbana",
      image: "https://i.pravatar.com/64?img=7",
    },
    category: { id: "cat-4", name: "Artisti Di Strada", slug: "artisti-di-strada", color: "#10B981" },
    tags: [],
  },
  {
    id: "vid-8",
    title: "Street Art Live Painting",
    slug: "street-art-live-painting",
    description: "Live painting session in the heart of Milan",
    thumbnail: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&h=300&fit=crop",
    duration: 480,
    viewCount: 654,
    status: "PUBLISHED",
    visibility: "PUBLIC",
    authorId: "user-8",
    createdAt: "2025-09-14T15:30:00Z",
    updatedAt: "2025-09-14T15:30:00Z",
    author: {
      id: "user-8",
      username: "bluemark",
      name: "Blu Mark",
      image: "https://i.pravatar.com/64?img=8",
    },
    category: { id: "cat-3", name: "Arti Varie", slug: "arti-varie", color: "#F59E0B" },
    tags: [],
  },
];

export default function HomePage() {
  return (
    <div className="pb-12">
      {/* Hero Section */}
      <section className="hero-section relative overflow-hidden rounded-2xl liquid-glass liquid-glass-hero py-12 md:py-20 mb-12">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand-yellow/5 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-brand-yellow/5 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl space-y-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="gradient-text">BAZZIBA!</span>
              <br />
              <span className="text-2xl md:text-3xl text-muted-foreground mt-4 block">
                La Nuova Piattaforma delle Arti
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Scopri e condividi contenuti video dedicati esclusivamente al mondo artistico.
              Musica, arte, cinema, teatro e molto altro.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/feed/latest"
                className="inline-flex items-center justify-center rounded-lg bg-brand-yellow px-6 py-3 text-base font-semibold text-black transition-all duration-200 hover:bg-brand-yellow-hover hover:scale-105"
              >
                <Play className="mr-2 h-5 w-5 fill-current" />
                Esplora i video
              </a>
              <a
                href="/upload"
                className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-base font-semibold transition-all duration-200 hover:bg-accent hover:scale-105"
              >
                <Upload className="mr-2 h-5 w-5" />
                Carica il tuo video
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Categorie</h2>
          <a
            href="/categories"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Tutte le categorie
          </a>
        </div>
        <CategoryGrid categories={mockCategories} />
      </section>

      {/* Contest Banner */}
      <section className="mb-12">
        <div className="rounded-2xl bg-gradient-to-r from-brand-yellow/10 to-brand-yellow/5 p-8 border border-brand-yellow/20">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-brand-yellow fill-current" />
            <span className="text-sm font-medium text-brand-yellow">
              CONTEST MENSILE BAZZIBA
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Vinci premi per i tuoi video artistici</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            Partecipa al nostro contest mensile e vinci premi in denaro per i tuoi contenuti
            artistici. Video, musica, arte, danza e molto altro.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/contest"
              className="inline-flex items-center justify-center rounded-lg bg-brand-yellow px-5 py-2.5 text-sm font-semibold text-black hover:bg-brand-yellow-hover transition-colors"
            >
              Partecipa ora
            </a>
            <a
              href="/contest"
              className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
            >
              Vai al contest
            </a>
          </div>
        </div>
      </section>

      {/* Latest Videos */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Video Recenti</h2>
          <a
            href="/feed/latest"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Vedi tutti
          </a>
        </div>
        <VideoGrid videos={mockVideos} showAuthor emptyMessage="Nessun video disponibile" />
      </section>

      {/* Contest Videos */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-brand-yellow fill-current" />
            <h2 className="text-2xl font-bold">Videos in Contest</h2>
          </div>
          <a
            href="/contest"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Vedi tutti
          </a>
        </div>
        <VideoGrid videos={mockContestVideos} compact emptyMessage="Nessun video in contest" />
      </section>

      {/* Trending */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Trending</h2>
          <a
            href="/feed/trending"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Vedi tutti
          </a>
        </div>
        <VideoGrid videos={mockVideos.slice(0, 4)} showAuthor={false} emptyMessage="Nessun video trending" />
      </section>
    </div>
  );
}
