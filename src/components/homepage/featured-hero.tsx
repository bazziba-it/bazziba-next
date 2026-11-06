import Link from "next/link";
import { Button, GlassSurface, GlassCard } from "@/components/ui";
import { RealAvatar } from "@/components/ui/media";
import { HeroCarousel } from "@/components/homepage/hero-motion";
import type { BazzibaVideo } from "@/data/wp";

interface FeaturedHeroProps {
  /** In-evidenza videos for the rotating hero (up to 5). */
  featuredVideos?: BazzibaVideo[];
  /** Real contest editions from the WP contest CPT. */
  contestCards?: { title: string; subtitle: string }[];
  /** Real artists (recent video authors). */
  featuredArtists?: { name: string; role: string; avatar?: string | null }[];
}

export default function FeaturedHero({
  featuredVideos = [],
  contestCards = [],
  featuredArtists = [],
}: FeaturedHeroProps) {
  return (
    <section className="relative pt-[72px] pb-6 overflow-hidden hero-ambient">
      {/* Ambient glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-80px] right-[-60px] w-[500px] h-[500px] rounded-full bg-brand-cyan/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-40px] left-[-40px] w-[400px] h-[400px] rounded-full bg-brand-cyan/3 blur-3xl" />
      </div>

      <div className="container-max relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* ===== LEFT: rotating hero carousel (lg:col-span-2) ===== */}
          <GlassSurface tier="raised" className="lg:col-span-2 relative rounded-2xl overflow-hidden bg-black group min-h-[420px]">
            <HeroCarousel videos={featuredVideos} />
          </GlassSurface>

          {/* ===== RIGHT: Contest cards + featured artists ===== */}
          <div className="lg:col-span-1 space-y-4">
            {contestCards.map((contest, i) => (
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
