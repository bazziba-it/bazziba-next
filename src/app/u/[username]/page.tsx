import { notFound } from "next/navigation";
import { prisma, safeQuery } from "@/lib/server";
import { VideoGrid } from "@/components/video/video-card";
import type { Video, Category } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = await safeQuery(async () => {
    return await prisma.user.findUnique({
      where: { username },
      select: {
        name: true,
        bio: true,
        image: true,
      },
    });
  });

  if (!user) {
    return {
      title: "User not found",
      description: "This user does not exist",
    };
  }

  return {
    title: user.name || user.username,
    description: user.bio?.substring(0, 160),
  };
}

async function getUser(username: string) {
  return safeQuery(async () => {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        videos: {
          where: {
            status: "PUBLISHED",
            visibility: "PUBLIC",
          },
          include: {
            author: {
              select: { id: true, username: true, name: true, image: true },
            },
            category: true,
            tags: { include: { tag: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 12,
        },
        _count: {
          select: {
            videos: true,
            followers: true,
            following: true,
          },
        },
      },
    });
    if (!user) return null;
    return user;
  });
}

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = await getUser(username);

  if (!user) {
    notFound();
  }

  const videos: Video[] = user.videos || [];

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl bg-gray-200">
                {user.username?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name || user.username}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
            {user.bio && <p className="text-sm text-muted-foreground mt-1">{user.bio}</p>}
            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
              <span>{user._count.videos} videos</span>
              <span>{user._count.followers} followers</span>
              <span>{user._count.following} following</span>
            </div>
          </div>
        </div>

        <VideoGrid
          videos={videos}
          title="Video"
          emptyMessage={`${user.name || user.username} hasn't uploaded any videos`}
        />
      </div>
    </div>
  );
}
