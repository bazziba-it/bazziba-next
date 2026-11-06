import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchUserBySlug, fetchVideosByAuthor } from "@/data/wp";
import { VideoGrid } from "@/components/video/video-card";
import { RealAvatar } from "@/components/ui/media";
import { GlassSurface } from "@/components/ui";
import { ExternalLink, Film } from "lucide-react";

export const revalidate = 300;

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = await fetchUserBySlug(username).catch(() => null);
  if (!user) notFound();

  const videos = await fetchVideosByAuthor(user.id, 24).catch(() => []);
  const avatar = user.avatar_urls?.["96"] ?? user.avatar_urls?.["48"] ?? null;
  const bio = (user.description ?? "").trim();

  return (
    <div className="min-h-screen bg-[#050a14] text-white">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Profile header — real WP user data */}
        <GlassSurface tier="card" className="rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <RealAvatar
              src={avatar}
              name={user.name}
              className="w-24 h-24 rounded-full border-2 border-[#00f2ff]/50 text-2xl"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-white/50 text-sm">@{user.slug}</p>
              {bio ? (
                <p className="mt-3 text-white/70 leading-relaxed">{bio}</p>
              ) : (
                <p className="mt-3 text-white/40 text-sm">Artista della community Bazziba.</p>
              )}
            </div>
            <a
              href={user.url || `https://bazziba.it/author/${user.slug}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 md:mt-0 px-6 py-2.5 bg-[#00f2ff] text-black font-bold rounded-full hover:bg-[#00d4e6] transition-colors text-sm flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Su bazziba.it
            </a>
          </div>

          {/* Real stat: published videos fetched from WP */}
          <div className="mt-6 pt-6 border-t border-white/5">
            <div className="inline-flex items-center gap-3 bg-white/5 rounded-xl px-5 py-3 border border-white/5">
              <Film className="h-5 w-5 text-[#00f2ff]" />
              <div>
                <p className="text-xl font-bold text-[#00f2ff]">{videos.length}</p>
                <p className="text-xs text-white/40">Video pubblicati</p>
              </div>
            </div>
          </div>
        </GlassSurface>

        {/* Real videos by this author */}
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff]" />
          Video di {user.name}
        </h2>

        <VideoGrid videos={videos} emptyMessage={`Nessun video pubblicato da ${user.name}`} />

        <div className="mt-8 pt-6 border-t border-white/5">
          <Link href="/" className="text-[#00f2ff] hover:underline text-sm">← Torna alla Home</Link>
        </div>
      </div>
    </div>
  );
}
