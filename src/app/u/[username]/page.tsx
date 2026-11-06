import Link from "next/link";
import { redirect } from "next/navigation";
import { fetchUserBySlug, fetchUserById, fetchUsers, fetchVideosByAuthor, searchUsers, type WpUser } from "@/data/wp";
import { VideoGrid } from "@/components/video/video-card";
import { RealAvatar } from "@/components/ui/media";
import { GlassSurface } from "@/components/ui";
import { ExternalLink, Film, UserSearch, ArrowRight } from "lucide-react";

export const revalidate = 300;

/** Normalize for fuzzy slug matching: lowercase, alphanumerics only. */
function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  // 1) Numeric ID — resolve and redirect to the canonical slug URL
  if (/^\d+$/.test(username)) {
    const user = await fetchUserById(username).catch(() => null);
    if (user?.slug) redirect(`/u/${user.slug}`);
  } else {
    // 2) Exact slug
    const user = await fetchUserBySlug(username).catch(() => null);
    if (user) return <ProfileView user={user} />;

    // 3) Fuzzy resolution — users type /u/xandro when the slug is xandrot
    const candidates = await searchUsers(username, 10).catch(() => []);
    const target = norm(username);
    const confident = candidates.find((u) => norm(u.slug) === target || norm(u.name) === target);
    const match = confident ?? (candidates.length === 1 ? candidates[0] : null);
    if (match?.slug) redirect(`/u/${match.slug}`);

    // 4) Friendly not-found with real artist suggestions (never a dead end)
    return <UserNotFound username={username} suggestions={candidates} />;
  }

  // Unknown numeric ID — same friendly page
  return <UserNotFound username={username} suggestions={[]} />;
}

async function ProfileView({ user }: { user: WpUser }) {
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

async function UserNotFound({ username, suggestions }: { username: string; suggestions: WpUser[] }) {
  // No fuzzy suggestions? Show real artists from the community instead
  const artists = suggestions.length > 0 ? suggestions : await fetchUsers(12).catch(() => []);

  return (
    <div className="min-h-screen bg-[#050a14] text-white">
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-[#00f2ff]/10 border border-[#00f2ff]/30 flex items-center justify-center mx-auto mb-6">
          <UserSearch className="h-7 w-7 text-[#00f2ff]" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Artista non trovato</h1>
        <p className="text-white/50 mb-10">
          Nessun artista corrisponde a &quot;{username}&quot;. Forse cercavi uno di questi?
        </p>

        {artists.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {artists.slice(0, 8).map((u) => (
              <Link
                key={u.id}
                href={`/u/${u.slug}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#00f2ff]/40 transition-colors group"
              >
                <RealAvatar src={u.avatar_urls?.["48"] ?? null} name={u.name} className="w-10 h-10 text-xs" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate group-hover:text-[#00f2ff] transition-colors">{u.name}</p>
                  <p className="text-xs text-white/40 truncate">@{u.slug}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-[#00f2ff] transition-colors" />
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/search" className="text-sm text-[#00f2ff] hover:underline">Cerca un artista</Link>
          <span className="text-white/20">·</span>
          <Link href="/" className="text-sm text-white/50 hover:text-white">Torna alla Home</Link>
        </div>
      </div>
    </div>
  );
}
