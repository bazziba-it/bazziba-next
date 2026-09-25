import { prisma } from "@/lib/server";
import { VideoGrid, CategoryGrid } from "@/components/video/video-card";
import type { Video, Category } from "@/types";
import { safeQuery } from "@/lib/server";
import { TrendingUp, Trophy, Play, Star } from "lucide-react";
import Image from "next/image";

async function getVideos() {
  return safeQuery(async () => {
    const videos = await prisma.video.findMany({
      where: { status: "PUBLISHED", visibility: "PUBLIC" },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return videos as Video[];
  });
}

async function getCategories() {
  return safeQuery(async () => {
    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { videos: true },
        },
      },
    });
    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      color: cat.color,
      videoCount: cat._count.videos,
    })) as Category[];
  });
}

async function getTrendingVideos() {
  return safeQuery(async () => {
    return (await prisma.video.findMany({
      where: { status: "PUBLISHED", visibility: "PUBLIC" },
      orderBy: {
        viewCount: "desc",
      },
      include: {
        author: { select: { id: true, username: true, name: true, image: true } },
      },
      take: 10,
    })) as Video[];
  });
}

async function getContestVideos() {
  return safeQuery(async () => {
    const activeContest = await prisma.contest.findFirst({
      where: {
        status: "VOTING",
      },
      include: {
        entries: {
          include: {
            video: {
              include: {
                author: { select: { id: true, username: true, name: true, image: true } },
              },
            },
          },
          orderBy: {
            video: {
              viewCount: "desc",
            },
          },
          take: 10,
        },
      },
    });

    if (!activeContest) return [];
    return activeContest.entries.map((entry) => entry.video) as Video[];
  });
}

export default async function HomePage() {
  const [videos, categories, trending, contestVideos] = await Promise.all([
    getVideos(),
    getCategories(),
    getTrendingVideos(),
    getContestVideos(),
  ]);

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 space-y-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-yellow/20 via-background to-primary/5 py-12 md:py-20">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand-yellow/10 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl space-y-6 text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                <span className="text-brand-yellow">BAZZIBA!</span>
                <br />
                <span className="text-2xl md:text-3xl text-muted-foreground">
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
                  className="inline-flex items-center justify-center rounded-lg bg-brand-yellow px-6 py-3 text-base font-semibold text-black transition-colors hover:bg-brand-yellow-hover"
                >
                  <Play className="mr-2 h-5 w-5 fill-current" />
                  Esplora i video
                </a>
                <a
                  href="/upload"
                  className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-base font-semibold transition-colors hover:bg-accent"
                >
                  <Star className="mr-2 h-5 w-5" />
                  Carica il tuo video
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Categorie</h2>
            <a
              href="/categories"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Tutte le categorie →
            </a>
          </div>
          <CategoryGrid categories={categories} />
        </section>

        {/* Latest Videos */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Video Recenti</h2>
            <a
              href="/feed/latest"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Vedi tutti
            </a>
          </div>
          <VideoGrid videos={videos} showAuthor emptyMessage="Nessun video disponibile" />
        </section>

        {/* Contest */}
        {contestVideos.length > 0 && (
          <section>
            <div className="rounded-2xl bg-gradient-to-r from-brand-yellow/10 to-primary/10 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-brand-yellow flex items-center gap-2">
                    <Trophy className="h-6 w-6" />
                    Contest in Corso
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Vota il tuo video preferito
                  </p>
                </div>
                <a
                  href="/contest"
                  className="text-sm font-medium text-brand-yellow hover:text-brand-yellow-hover"
                >
                  Vai al contest →
                </a>
              </div>
              <VideoGrid videos={contestVideos} compact emptyMessage="Nessun video in contest" />
            </div>
          </section>
        )}

        {/* Trending */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              Trending
            </h2>
            <a
              href="/feed/trending"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Vedi tutti
            </a>
          </div>
          <VideoGrid videos={trending} showAuthor={false} emptyMessage="Nessun video trending" />
        </section>
      </div>
    </div>
  );
}
