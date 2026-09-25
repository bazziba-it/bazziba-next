import { prisma } from "@/lib/server";
import { VideoGrid, CategoryGrid } from "@/components/video/video-card";
import type { Video, Category } from "@/types";

// Wrap Prisma calls in try/catch to handle missing database engine gracefully
async function safeQuery<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error("[Bazziba] Database query failed:", error);
    return [] as T;
  }
}

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
    <div className="py-6">
      <div className="container mx-auto px-4 space-y-8">
        {/* Hero / Banner */}
        <section className="space-y-4">
          <h1 className="text-2xl font-bold md:text-3xl">BAZZIBA!</h1>
          <p className="text-muted-foreground max-w-2xl">
            La piattaforma digitale dedicata esclusivamente al mondo artistico.
            Condividi e scopri contenuti video con carattere e interesse artistico.
          </p>
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Categorie</h2>
          <CategoryGrid categories={categories} />
        </section>

        {/* Latest Videos */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Video Recenti</h2>
            <a
              href="/feed/latest"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Vedi tutti
            </a>
          </div>
          <VideoGrid videos={videos} showAuthor emptyMessage="Nessun video disponibile" />
        </section>

        {/* Contest */}
        {contestVideos.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-brand-yellow">
                  Contest in Corso
                </h2>
                <p className="text-sm text-muted-foreground">
                  Vota il tuo video preferito
                </p>
              </div>
              <a
                href="/contest"
                className="text-sm font-medium text-brand-yellow hover:text-brand-yellow/80"
              >
                Vai al contest
              </a>
            </div>
            <VideoGrid videos={contestVideos} compact emptyMessage="Nessun video in contest" />
          </section>
        )}

        {/* Trending */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Trending</h2>
          <VideoGrid videos={trending} compact showAuthor={false} emptyMessage="Nessun video trending" />
        </section>
      </div>
    </div>
  );
}
