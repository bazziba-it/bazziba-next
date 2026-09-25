import { prisma, safeQuery } from "@/lib/server";
import { VideoGrid, CategoryGrid } from "@/components/video/video-card";
import type { Video, Category } from "@/types";

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
      description: cat.description,
      videoCount: cat._count.videos,
    })) as Category[];
  });
}

async function getVideos(type: "latest" | "trending" | "subscribed", limit = 20) {
  return safeQuery(async () => {
    const where: any = {
      status: "PUBLISHED",
      visibility: "PUBLIC",
    };

    const orderBy: any =
      type === "trending"
        ? { viewCount: "desc" }
        : type === "latest"
        ? { createdAt: "desc" }
        : { createdAt: "desc" };

    return (await prisma.video.findMany({
      where,
      include: {
        author: { select: { id: true, username: true, name: true, image: true } },
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy,
      take: limit,
    })) as Video[];
  });
}

export default async function FeedPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type = "latest" } = await params;
  const feedType = ["latest", "trending", "subscribed"].includes(type)
    ? (type as "latest" | "trending" | "subscribed")
    : "latest";

  const [categories, videos] = await Promise.all([
    getCategories(),
    getVideos(feedType),
  ]);

  const feedLabels = {
    latest: "Ultime Pubblicazioni",
    trending: "Video Popolari",
    subscribed: "Canali Seguiti",
  };

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">{feedLabels[feedType]}</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Categorie</h2>
            <CategoryGrid categories={categories} />
          </section>
          <section>
            <VideoGrid
              videos={videos}
              title={feedLabels[feedType]}
              emptyMessage="Nessun video disponibile"
            />
          </section>
        </div>
      </div>
    </div>
  );
}
