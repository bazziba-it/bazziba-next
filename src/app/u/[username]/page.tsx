import { VideoGrid } from "@/components/video/video-card";
import type { Video } from "@/types";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

// Mock user data for demonstration
const mockUsers: Record<string, {
  id: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  videoCount: number;
  followerCount: number;
  followingCount: number;
  videos: Video[];
}> = {
  musa_urbana: {
    id: "user-7",
    username: "musa_urbana",
    name: "Musa Urbana",
    image: "https://i.pravatar.com/64?img=7",
    bio: "Street artist e artista urbano. Trasformo le città in gallerie aperte.",
    videoCount: 18,
    followerCount: 3247,
    followingCount: 42,
    videos: [
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
        category: { id: "cat-4", name: "Artisti Di Strata", slug: "artisti-di-strada", color: "#10B981" },
        tags: [],
      },
      {
        id: "vid-9",
        title: "Graffiti Stories - Roma",
        slug: "graffiti-stories-roma",
        description: "Documentario sui graffiti nascosti del centro di Roma",
        thumbnail: "https://images.unsplash.com/photo-1578301979-642908803e52?w=400&h=300&fit=crop",
        duration: 380,
        viewCount: 445,
        status: "PUBLISHED",
        visibility: "PUBLIC",
        authorId: "user-7",
        createdAt: "2025-09-10T10:00:00Z",
        updatedAt: "2025-09-10T10:00:00Z",
        author: { id: "user-7", username: "musa_urbana", name: "Musa Urban", image: "https://i.pravatar.com/64?img=7" },
        category: { id: "cat-3", name: "Arti Varie", slug: "arti-varie", color: "#F59E0B" },
        tags: [],
      },
      {
        id: "vid-12",
        title: "Urban Canvas - Milan Walls",
        slug: "urban-canvas-milan-walls",
        description: "Un tour attraverso le strade di Milano alla ricerca di arte urbana",
        thumbnail: "https://images.unsplash.com/photo-1578301979-642908803e52?w=400&h=300&fit=crop",
        duration: 720,
        viewCount: 1567,
        status: "PUBLISHED",
        visibility: "PUBLIC",
        authorId: "user-7",
        createdAt: "2025-09-05T14:00:00Z",
        updatedAt: "2025-09-05T14:00:00Z",
        author: { id: "user-7", username: "musa_urbana", name: "Musa Urbana", image: "https://i.pravatar.com/64?img=7" },
        category: { id: "cat-4", name: "Artisti Di Strada", slug: "artisti-di-strada", color: "#10B981" },
        tags: [],
      },
    ],
  },
  elena_arte: {
    id: "user-1",
    username: "elena_arte",
    name: "Elena Rossi",
    image: "https://i.pravatar.com/64?img=1",
    bio: "Cantante e compositrice. Amo esprimere emozioni attraverso la musica.",
    videoCount: 12,
    followerCount: 1842,
    followingCount: 28,
    videos: [
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
        id: "vid-13",
        title: "Armonie Notturne - Serata Acustica",
        slug: "armoniche-notturne-serata-acustica",
        description: "Una serata intima con chitarra e voce",
        thumbnail: "https://images.unsplash.com/photo-1516204474435-7c6b6b7c8e9a?w=400&h=300&fit=crop",
        duration: 280,
        viewCount: 634,
        status: "PUBLISHED",
        visibility: "PUBLIC",
        authorId: "user-1",
        createdAt: "2025-09-02T18:00:00Z",
        updatedAt: "2025-09-02T18:00:00Z",
        author: { id: "user-1", username: "elena_arte", name: "Elena Rossi", image: "https://i.pravatar.com/64?img=1" },
        category: { id: "cat-1", name: "Cantanti", slug: "cantanti", color: "#FFD700" },
        tags: [],
      },
    ],
  },
};

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = mockUsers[username];

  if (!user) {
    notFound();
  }

  const videos: Video[] = user.videos;

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-8 p-6 rounded-xl bg-card border card-elevated">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex-shrink-0 ring-2 ring-brand-yellow/20">
            <img
              src={user.image}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <span className="text-brand-yellow text-sm font-medium">✓ Verificato</span>
            </div>
            <p className="text-muted-foreground">@{user.username}</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">{user.bio}</p>
            <div className="flex gap-6 mt-3 text-sm">
              <span><strong>{user.videoCount}</strong> video</span>
              <span><strong>{Math.round(user.followerCount / 1000)}K</strong> follower</span>
              <span><strong>{user.followingCount}</strong> following</span>
            </div>
            <button className="mt-3 px-4 py-2 rounded-lg bg-brand-yellow text-sm font-medium text-black hover:bg-brand-yellow-hover transition-colors">
              Segui
            </button>
          </div>
        </div>

        {/* Videos Grid */}
        <VideoGrid
          videos={videos}
          title="Video"
          emptyMessage={`${user.name} non ha ancora pubblicato video`}
        />
      </div>
    </div>
  );
}
