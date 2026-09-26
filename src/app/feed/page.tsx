"use client";

import { VideoGrid, CategoryGrid } from "@/components/video/video-card";
import type { Video, Category } from "@/types";
import { Filter, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";

// Extended mock data for infinite scroll
const allMockVideos: Video[] = [
  {
    id: "vid-1", title: "Il Canto dell'Anima - Performance Live", slug: "il-canto-dellanima-performance-live", description: "Un'interpretazione emozionante di una canzone originale", thumbnail: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&h=300&fit=crop", duration: 342, viewCount: 1248, status: "PUBLISHED", visibility: "PUBLIC", authorId: "user-1", createdAt: "2025-09-10T10:00:00Z", updatedAt: "2025-09-10T10:00:00Z",
    author: { id: "user-1", username: "elena_arte", name: "Elena Rossi", image: "https://i.pravatar.com/64?img=1" },
    category: { id: "cat-1", name: "Cantanti", slug: "cantanti", color: "#FFD700" }, tags: [],
  },
  {
    id: "vid-2", title: "Pittura Astrale - Il Viaggio di un Artista", slug: "pittura-astrale-il-viaggio-di-un-artista", description: "Una panoramica del processo creativo dietro le opere astrali", thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop", duration: 892, viewCount: 892, status: "PUBLISHED", visibility: "PUBLIC", authorId: "user-3", createdAt: "2025-09-08T14:30:00Z", updatedAt: "2025-09-08T14:30:00Z",
    author: { id: "user-3", username: "marco_pittore", name: "Marco Bianchi", image: "https://i.pravatar.com/64?img=3" },
    category: { id: "cat-9", name: "Pittori", slug: "pittori", color: "#FF6B6B" }, tags: [],
  },
  {
    id: "vid-3", title: "Danza Contemporanea - Spazio e Movimento", slug: "danza-contemporanea-spazio-e-movimento", description: "Un'esplorazione della danza moderna in uno spazio urbano", thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop", duration: 456, viewCount: 2156, status: "PUBLISHED", visibility: "PUBLIC", authorId: "user-2", createdAt: "2025-09-05T16:45:00Z", updatedAt: "2025-09-05T16:45:00Z",
    author: { id: "user-2", username: "sofia_danza", name: "Sofia Marchetti", image: "https://i.pravatar.com/64?img=2" },
    category: { id: "cat-7", name: "Ballerini", slug: "ballerini", color: "#9333ea" }, tags: [],
  },
  {
    id: "vid-4", title: "Poesia Sonora - La Citta che Dorme", slug: "poesia-sonora-la-citta-che-dorme", description: "Una poesia recitata con una partitura musicale originale", thumbnail: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&h=300&fit=crop", duration: 234, viewCount: 567, status: "PUBLISHED", visibility: "PUBLIC", authorId: "user-4", createdAt: "2025-09-03T09:15:00Z", updatedAt: "2025-09-03T09:15:00Z",
    author: { id: "user-4", username: "luca_poeta", name: "Luca Verdi", image: "https://i.pravatar.com/64?img=4" },
    category: { id: "cat-5", name: "Poeti", slug: "poeti", color: "#0EA5E9" }, tags: [],
  },
  {
    id: "vid-5", title: "Mix DJ - Vibrations of the Night", slug: "mix-dj-vibrations-of-the-night", description: "Un viaggio musicale attraverso le ombre della notte", thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop", duration: 678, viewCount: 3421, status: "PUBLISHED", visibility: "PUBLIC", authorId: "user-6", createdAt: "2025-09-01T20:00:00Z", updatedAt: "2025-09-01T20:00:00Z",
    author: { id: "user-6", username: "dj_alex", name: "Alex Sound", image: "https://i.pravatar.com/64?img=6" },
    category: { id: "cat-6", name: "DJ", slug: "dj", color: "#8B5CF6" }, tags: [],
  },
  {
    id: "vid-6", title: "Fotografia di Strada - Roma Notturna", slug: "fotografia-di-strada-roma-notturna", description: "Immagini che raccontano la citta dopo il tramonto", thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop", duration: 180, viewCount: 789, status: "PUBLISHED", visibility: "PUBLIC", authorId: "user-5", createdAt: "2025-08-30T18:00:00Z", updatedAt: "2025-08-30T18:00:00Z",
    author: { id: "user-5", username: "giulia_foto", name: "Giulia Neri", image: "https://i.pravatar.com/64?img=5" },
    category: { id: "cat-3", name: "Arts Varie", slug: "arti-varie", color: "#F59E0B" }, tags: [],
  },
  {
    id: "vid-7", title: "Musa Urbana - Frammenti di Luce", slug: "musa-urbana-frammenti-di-luce", description: "Installazione artistica interattiva in un parco pubblico", thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop", duration: 520, viewCount: 890, status: "PUBLISHED", visibility: "PUBLIC", authorId: "user-7", createdAt: "2025-09-15T12:00:00Z", updatedAt: "2025-09-15T12:00:00Z",
    author: { id: "user-7", username: "musa_urbana", name: "Musa Urbana", image: "https://i.pravatar.com/64?img=7" },
    category: { id: "cat-4", name: "Artisti Di Strada", slug: "artisti-di-strada", color: "#10B981" }, tags: [],
  },
  {
    id: "vid-8", title: "Street Art Live Painting", slug: "street-art-live-painting", description: "Live painting session in the heart of Milan", thumbnail: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&h=300&fit=crop", duration: 480, viewCount: 654, status: "PUBLISHED", visibility: "PUBLIC", authorId: "user-8", createdAt: "2025-09-14T15:30:00Z", updatedAt: "2025-09-14T15:30:00Z",
    author: { id: "user-8", username: "bluemark", name: "Blu Mark", image: "https://i.pravatar.com/64?img=8" },
    category: { id: "cat-3", name: "Arts Varie", slug: "arti-varie", color: "#F59E0B" }, tags: [],
  },
];

// Generate additional mock videos for infinite scroll
const generateMoreVideos = (start: number, count: number): Video[] => {
  const artists = [
    { name: "Anna Bianchi", username: "anna_b", image: "https://i.pravatar.com/64?img=9" },
    { name: "Carlo Verdi", username: "carlo_v", image: "https://i.pravatar.com/64?img=10" },
    { name: "Diana Rosa", username: "diana_r", image: "https://i.pravatar.com/64?img=11" },
    { name: "Edoardo Blu", username: "edo_blu", image: "https://i.pravatar.com/64?img=12" },
    { name: "Federica Viola", username: "fede_v", image: "https://i.pravatar.com/64?img=13" },
    { name: "Gianni Grigio", username: "gianni_g", image: "https://i.pravatar.com/64?img=14" },
  ];
  const titles = [
    "Arte Digitale - NFT e il Futuro dell'Arte", "Cooking Show - Ricette di Nonna",
    "Viaggio in Toscana - Documentario", "Chitarra Classica - Pezzi Imperdibili",
    "Sculpture Time-lapse - Marmo", "Origami - Piegare la carta",
    "Beat Making - Producer Life", "Street Music - Vicoli di Napoli",
  ];
  const thumbnails = [
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  ];
  const categories = ["Cantanti", "Musicisti", "Arti Varie", "Poeti", "DJ", "Ballerini"];

  const result: Video[] = [];
  for (let i = 0; i < count; i++) {
    const idx = start + i;
    const artist = artists[idx % artists.length];
    const title = titles[idx % titles.length];
    const duration = 60 + Math.floor(Math.random() * 600);

    result.push({
      id: `vid-${idx + 10}`,
      title: `${title} #${idx + 10}`,
      slug: `slug-${idx + 10}`,
      description: title,
      thumbnail: `${thumbnails[idx % thumbnails.length]}?w=400&h=300&fit=crop`,
      duration,
      viewCount: Math.floor(Math.random() * 5000) + 100,
      status: "PUBLISHED",
      visibility: "PUBLIC",
      authorId: `user-${idx + 10}`,
      createdAt: `2025-08-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}T10:00:00Z`,
      updatedAt: `2025-08-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}T10:00:00Z`,
      author: { id: `user-${idx + 10}`, username: artist.username, name: artist.name, image: artist.image },
      category: { id: `cat-${idx % 6 + 1}`, name: categories[idx % categories.length], slug: categories[idx % categories.length].toLowerCase(), color: "#FFD700" },
      tags: [],
    });
  }
  return result;
};

const mockCategories: Category[] = [
  { id: "cat-1", name: "Cantanti", slug: "cantanti", color: "#FFD700", videoCount: 42 },
  { id: "cat-3", name: "Arts Varie", slug: "arti-varie", color: "#F59E0B", videoCount: 87 },
  { id: "cat-4", name: "Artisti Di Strada", slug: "artisti-di-strada", color: "#10B981", videoCount: 31 },
  { id: "cat-5", name: "Poeti", slug: "poeti", color: "#0EA5E9", videoCount: 28 },
  { id: "cat-6", name: "DJ", slug: "dj", color: "#8B5CF6", videoCount: 56 },
  { id: "cat-7", name: "Ballerini", slug: "ballerini", color: "#9333EA", videoCount: 19 },
  { id: "cat-8", name: "Cinema", slug: "cinema", color: "#EF4444", videoCount: 44 },
  { id: "cat-9", name: "Pittori", slug: "pittori", color: "#FF6B6B", videoCount: 35 },
];

export default function FeedPage() {
  const [videos, setVideos] = useState<Video[]>(allMockVideos);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"latest" | "trending">("latest");

  const VIDEOS_PER_PAGE = 8;

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    setTimeout(() => {
      const newVideos = generateMoreVideos(page * VIDEOS_PER_PAGE, VIDEOS_PER_PAGE);
      setVideos((prev) => [...prev, ...newVideos]);
      setPage((prev) => prev + 1);
      if (videos.length + newVideos.length >= 40) {
        setHasMore(false);
      }
      setLoading(false);
    }, 600); // Simulate network request
  }, [page, loading, hasMore, videos.length]);

  // Auto-load when scrolling near bottom
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollHeight - scrollTop - clientHeight < 300) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore, loading, hasMore]);

  const displayVideos = activeTab === "latest" ? videos : videos.slice().sort((a, b) => b.viewCount - a.viewCount);

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold gradient-text bg-clip-text text-transparent">
            {activeTab === "latest" ? "Video Recenti" : "Video Trending"}
          </h1>
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <Filter className="h-4 w-4" />
            Filtra
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => { setActiveTab("latest"); setVideos(allMockVideos); setPage(1); setHasMore(true); }}
            className={`pb-2 px-1 text-sm font-medium transition-colors ${
              activeTab === "latest"
                ? "text-brand-yellow border-b-2 border-brand-yellow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Recenti
          </button>
          <button
            onClick={() => { setActiveTab("trending"); setVideos(allMockVideos); setPage(1); setHasMore(true); }}
            className={`pb-2 px-1 text-sm font-medium transition-colors ${
              activeTab === "trending"
                ? "text-brand-yellow border-b-2 border-brand-yellow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Popolari
          </button>
        </div>

        <CategoryGrid categories={mockCategories} />

        <VideoGrid
          videos={displayVideos}
          emptyMessage="Nessun video disponibile"
        />

        {/* Loading & Load More */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-brand-yellow" />
            <span className="ml-2 text-muted-foreground">Caricamento...</span>
          </div>
        )}

        {!loading && hasMore && (
          <div className="flex justify-center py-8">
            <button
              onClick={loadMore}
              className="px-6 py-3 bg-brand-yellow text-black rounded-full font-semibold hover:bg-brand-gold-hover transition-colors shadow-lg hover:shadow-xl"
            >
              Carica Altri
            </button>
          </div>
        )}

        {!hasMore && !loading && (
          <p className="text-center text-muted-foreground py-8">
            Hai visto tutti i video disponibili.
          </p>
        )}
      </div>
    </div>
  );
}
