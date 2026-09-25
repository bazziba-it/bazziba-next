import { VideoGrid, CategoryGrid } from "@/components/video/video-card";
import type { Video, Category } from "@/types";
import { Filter } from "lucide-react";
import Link from "next/link";

// Mock data for demonstration
const mockVideos: Video[] = [
  {
    id: "vid-1",
    title: "Il Canto dell'Anima - Performance Live",
    slug: "il-canto-dellanima-performance-live",
    description: "Un'interpretazione emozionante di una canzone originale",
    thumbnail: "https://images.unsplash.com/photo-1516204474435-7c6b6b7c8e9a?w=400&h=300&fit=crop",
    duration: 342,
    viewCount: 1248,
    status: "PUBLISHED",
    visibility: "PUBLIC",
    authorId: "user-1",
    createdAt: "2025-09-10T10:00:00Z",
    updatedAt: "2025-09-10T10:00:00Z",
    author: { id: "user-1", username: "elena_arte", name: "Elena Rossi", image: "https://i.pravatar.com/64?img=1" },
    category: { id: "cat-1", name: "Cantanti", slug: "cantanti", color: "#FFD700" },
    tags: [],
  },
  {
    id: "vid-2",
    title: "Pittura Astrale - Il Viaggio di un Artista",
    slug: "pittura-astrale-il-viaggio-di-un-artista",
    description: "Una panoramica del processo creativo dietro le opere astrali",
    thumbnail: "https://images.unsplash.com/photo-1578301979-642908803e52?w=400&h=300&fit=crop",
    duration: 892,
    viewCount: 892,
    status: "PUBLISHED",
    visibility: "PUBLIC",
    authorId: "user-3",
    createdAt: "2025-09-08T14:30:00Z",
    updatedAt: "2025-09-08T14:30:00Z",
    author: { id: "user-3", username: "marco_pittore", name: "Marco Bianchi", image: "https://i.pravatar.com/64?img=3" },
    category: { id: "cat-9", name: "Pittori", slug: "pittori", color: "#FF6B6B" },
    tags: [],
  },
  {
    id: "vid-3",
    title: "Danza Contemporanea - Spazio e Movimento",
    slug: "danza-contemporanea-spazio-e-movimento",
    description: "Un'esplorazione della danza moderna in uno spazio urbano",
    thumbnail: "https://images.unsplash.com/photo-15188376950205-8d818a1a3175?w=400&h=300&fit=crop",
    duration: 456,
    viewCount: 2156,
    status: "PUBLISHED",
    visibility: "PUBLIC",
    authorId: "user-2",
    createdAt: "2025-09-05T16:45:00Z",
    updatedAt: "2025-09-05T16:45:00Z",
    author: { id: "user-2", username: "sofia_danza", name: "Sofia Marchetti", image: "https://i.pravatar.com/64?img=2" },
    category: { id: "cat-7", name: "Ballerini", slug: "ballerini", color: "#9333ea" },
    tags: [],
  },
  {
    id: "vid-4",
    title: "Poesia Sonora - La Citta che Dorme",
    slug: "poesia-sonora-la-citta-che-dorme",
    description: "Una poesia recitata con una partitura musicale originale",
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
    description: "Un viaggio musicale attraverso le ombre della notte",
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
    id: "vid-6",
    title: "Fotografia di Strada - Roma Notturna",
    slug: "fotografia-di-strada-roma-notturna",
    description: "Immagini che raccontano la citta dopo il tramonto",
    thumbnail: "https://images.unsplash.com/photo-1470020735777-f943cac5a0ca?w=400&h=300&fit=crop",
    duration: 180,
    viewCount: 789,
    status: "PUBLISHED",
    visibility: "PUBLIC",
    authorId: "user-5",
    createdAt: "2025-08-30T18:00:00Z",
    updatedAt: "2025-08-30T18:00:00Z",
    author: { id: "user-5", username: "giulia_foto", name: "Giulia Neri", image: "https://i.pravatar.com/64?img=5" },
    category: { id: "cat-3", name: "Arts Varie", slug: "arti-varie", color: "#F59E0B" },
    tags: [],
  },
  {
    id: "vid-7",
    title: "Musa Urbana - Frammenti di Luce",
    slug: "musa-urbana-frammenti-di-luce",
    description: "Installazione artistica interattiva in un parco pubblico",
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
  {
    id: "vid-8",
    title: "Street Art Live Painting",
    slug: "street-art-live-painting",
    description: "Live painting session in the heart of Milan",
    thumbnail: "https://images.unsplash.com/photo-1577032819764-2b9a6a3c3f8e?w=400&h=300&fit=crop",
    duration: 480,
    viewCount: 654,
    status: "PUBLISHED",
    visibility: "PUBLIC",
    authorId: "user-8",
    createdAt: "2025-09-14T15:30:00Z",
    updatedAt: "2025-09-14T15:30:00Z",
    author: { id: "user-8", username: "bluemark", name: "Blu Mark", image: "https://i.pravatar.com/64?img=8" },
    category: { id: "cat-3", name: "Arts Varie", slug: "arti-varie", color: "#F59E0B" },
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

export default async function FeedPage() {
  const videos = mockVideos;
  const categories = mockCategories;

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Feed</h1>
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <Filter className="h-4 w-4" />
            Filtra
          </button>
        </div>

        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-semibold mb-4">Categorie</h2>
            <CategoryGrid categories={categories} />
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Video Recenti</h2>
              <div className="flex gap-2 text-sm">
                <Link href="/feed/latest" className="text-brand-yellow">
                  Recenti
                </Link>
                <span className="text-muted-foreground">·</span>
                <Link href="/feed/trending" className="text-muted-foreground hover:text-foreground">
                  Trending
                </Link>
              </div>
            </div>
            <VideoGrid
              videos={videos}
              emptyMessage="Nessun video disponibile"
            />
          </section>
        </div>
      </div>
    </div>
  );
}
