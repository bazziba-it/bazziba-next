import { notFound } from "next/navigation";
import { prisma, safeQuery } from "@/lib/server";
import { VideoGrid } from "@/components/video/video-card";
import type { Video, Category } from "@/types";

async function getCategory(slug: string) {
  return safeQuery(async () => {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { videos: true },
        },
      },
    });
    if (!category) return null;
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      color: category.color,
      description: category.description,
      videoCount: category._count.videos,
    } as Category;
  });
}

async function getCategoryVideos(slug: string, page: number = 1, limit: number = 20) {
  return safeQuery(async () => {
    const skip = (page - 1) * limit;
    return (await prisma.video.findMany({
      where: {
        status: "PUBLISHED",
        visibility: "PUBLIC",
        category: { slug },
      },
      include: {
        author: {
          select: { id: true, username: true, name: true, image: true },
        },
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    })) as Video[];
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  const videos = await getCategoryVideos(slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground mb-6">{category.description}</p>
        )}
        <VideoGrid
          videos={videos}
          title={category.name}
          showAuthor
          emptyMessage={`Nessun video nella categoria ${category.name}`}
        />
      </div>
    </div>
  );
}
