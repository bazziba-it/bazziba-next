import Link from "next/link";
import { TrendingUp, Play, Gift, Calendar } from "lucide-react";
import { Button, GlassSurface, GlassCard } from "@/components/ui";
import { RealAvatar, ThumbPlaceholder } from "@/components/ui/media";
import type { BazzibaVideo } from "@/data/wp";

interface FeaturedHeroProps {
  featuredVideo?: BazzibaVideo | null;
  /** Real contest editions from the WP contest CPT. */
  contestCards?: { title: string; subtitle: string }[];
  /** Real artists (recent video authors). */
  featuredArtists?: { name: string; role: string; avatar?: string | null }[];
}

function formatDateIT(iso?: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return "";
  }
}

export default function FeaturedHero({
  featuredVideo,
  contestCards = [],
  featuredArtists = [],
}: FeaturedHeroProps) {
  const contests = contestCards;

  return (
    <section className="relative pt-[72px] pb-6 overflow-hidden hero-ambient">
      {/* Ambient glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-80px] right-[-60px] w-[500px] h-[500px] rounded-full bg-brand-cyan/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-40px] left-[-40px] w-[400px] h-[400px] rounded-full bg-brand-cyan/3 blur-3xl" />
      </div>

      <div className="container-max relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* ===== LEFT: Featured Video (lg:col-span-2) ===== */}
          <GlassSurface tier="raised" className="lg:col-span-2 relative rounded-2xl overflow-hidden bg-black group min-h-[420px]">
            {featuredVideo?.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={featuredVideo.thumbnail}
                alt={featuredVideo.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
              />
            ) : (
              <ThumbPlaceholder title={featuredVideo?.title ?? "Bazziba"} className="absolute inset-0" />
            )}

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 to-transparent" />

            {/* Top-left: category label */}
            <div className="absolute top-4 left-4">
              <div className="bg-brand-cyan/90 text-black text-[11px] font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-lg">
                <TrendingUp className="h-3 w-3" />
                {featuredVideo?.category || "In Evidenza"}
              </div>
            </div>

            {/* Title */}
            <div className="absolute top-4 right-4 left-4 md:left-auto md:right-4">
              <h2 className="font-display text-headline-lg text-white drop-shadow-lg line-clamp-2 max-w-[70%] md:max-w-[80%]">
                {featuredVideo?.title ?? "BAZZIBA! — La piattaforma degli artisti"}
              </h2>
            </div>

            {/* Real meta: author + publish date */}
            {featuredVideo && (
              <div className="absolute top-20 left-4 right-4 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-2 bg-brand-navy-800/70 px-2.5 py-1 rounded-full border border-white/10">
                  <RealAvatar src={featuredVideo.authorAvatar} name={featuredVideo.authorName} className="w-4 h-4 text-[7px]" />
                  {featuredVideo.authorName}
                </span>
                {featuredVideo.date && (
                  <span className="flex items-center gap-1 bg-brand-navy-800/70 px-2.5 py-1 rounded-full border border-white/10">
                    <Calendar className="h-3 w-3 text-brand-cyan" />
                    {formatDateIT(featuredVideo.date)}
                  </span>
                )}
              </div>
            )}

            {/* CTA buttons */}
            <div className="absolute bottom-24 left-4 flex gap-3">
              {featuredVideo && (
                <Button
                  variant="cyan"
                  size="lg"
                  className="bg-brand-cyan text-black font-bold py-3 px-6 rounded-full flex items-center gap-2 shadow-lg shadow-cyan-glow-1 hover:shadow-xl hover:shadow-cyan-glow-2"
                  asChild
                >
                  <Link href={`/watch/${featuredVideo.id}`}>
                    <Play className="h-4 w-4" />
                    GUARDA ORA
                  </Link>
                </Button>
              )}
              <Button
                variant="purple"
                size="lg"
                className="bg-purple-600 text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 hover:bg-purple-500"
                asChild
              >
                <Link href="/contest">
                  <Gift className="h-4 w-4" />
                  VOTA ORA
                </Link>
              </Button>
            </div>

            {/* Bottom scrim bar */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-950/90 to-transparent" />
          </GlassSurface>

          {/* ===== RIGHT: Contest cards + featured artists ===== */}
          <div className="lg:col-span-1 space-y-4">
            {contests.map((contest, i) => (
              <GlassCard key={i} interactive={false} staggerIndex={i} className="p-4 rounded-2xl">
                <p className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold mb-0.5">
                  {contest.subtitle}
                </p>
                <h3 className="text-base font-bold text-white leading-tight mb-3">{contest.title}</h3>
                <div className="flex gap-2">
                  <Button
                    variant="cyan"
                    size="sm"
                    className="flex-1 bg-brand-cyan text-black font-bold py-2 rounded-full text-xs hover:bg-brand-cyan-hover"
                    asChild
                  >
                    <Link href="/contest">VOTA ORA</Link>
                  </Button>
                  <Button
                    variant="purple"
                    size="sm"
                    className="flex-1 bg-purple-600 text-white font-bold py-2 rounded-full text-xs hover:bg-purple-500"
                    asChild
                  >
                    <Link href="/upload">PARTECIPA</Link>
                  </Button>
                </div>
              </GlassCard>
            ))}

            {/* Featured artists strip — real recent authors */}
            {featuredArtists.length > 0 && (
              <div className="pt-2">
                <p className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold mb-3">
                  Artisti in evidenza
                </p>
                <div className="flex flex-wrap gap-3">
                  {featuredArtists.map((artist) => (
                    <div
                      key={artist.name}
                      className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 pr-3 rounded-full border border-slate-700/50"
                    >
                      <RealAvatar
                        src={artist.avatar}
                        name={artist.name}
                        className="w-8 h-8 text-[10px] ring-2 ring-brand-cyan/30"
                      />
                      <div>
                        <p className="text-xs font-bold text-white">{artist.name}</p>
                        <p className="text-[10px] text-slate-400">{artist.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
