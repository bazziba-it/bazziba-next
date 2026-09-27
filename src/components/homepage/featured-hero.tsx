import Link from "next/link";
import { TrendingUp, Play, Gift, Clock, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui";
import type { BazzibaVideo } from "@/data/wp";

interface FeaturedHeroProps {
  featuredVideo?: BazzibaVideo | null;
  contestCards?: { title: string; subtitle: string; timer?: string }[];
  featuredArtists?: { name: string; role: string; avatar?: string }[];
}

interface StatBadgeProps {
  icon: React.ReactNode;
  label: string;
}

function StatBadge({ icon, label }: StatBadgeProps) {
  return (
    <span className="flex items-center gap-1 bg-slate-900/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
      {icon}
      {label}
    </span>
  );
}

export default function FeaturedHero({
  featuredVideo,
  contestCards = [],
  featuredArtists = [],
}: FeaturedHeroProps) {
  const referenceStats = [
    { icon: <TrendingUp className="h-3 w-3 text-brand-cyan" />, label: "2.4K" },
    { icon: <Eye className="h-3 w-3 text-brand-cyan" />, label: "1.2M" },
    { icon: <Heart className="h-3 w-3 text-brand-cyan" />, label: "245K" },
  ];

  const contests = contestCards.length > 0
    ? contestCards
    : [
        { title: "Voci Acustiche", subtitle: "In Contest / Contest in corso", timer: "00:00:07:05" },
        { title: "Nuove Proposte - Iscrizioni", subtitle: "Iscrizioni" },
      ];

  const artists = featuredArtists.length > 0
    ? featuredArtists
    : [
        { name: "Leo K.", role: "Painter", avatar: "https://i.pravatar.cc/40?img=12" },
        { name: "Eva L.", role: "Filmmaker", avatar: "https://i.pravatar.cc/40?img=5" },
      ];

  return (
    <section className="relative pt-[72px] pb-6 overflow-hidden hero-ambient">
      {/* Ambient glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-80px] right-[-60px] w-[500px] h-[500px] rounded-full bg-brand-cyan/5 blur-3xl animate-pulse-cyan" />
        <div className="absolute bottom-[-40px] left-[-40px] w-[400px] h-[400px] rounded-full bg-brand-cyan/3 blur-3xl" />
      </div>

      <div className="container-max relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* ===== LEFT: Featured Video (lg:col-span-2) ===== */}
          <div className="lg:col-span-2 relative rounded-2xl overflow-hidden bg-black shadow-2xl group min-h-[420px]">
            {/* Video player background */}
            {featuredVideo && (
              <img
                src={featuredVideo.thumbnail}
                alt={featuredVideo.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
              />
            )}

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 to-transparent" />

            {/* Top-left: contest label */}
            <div className="absolute top-4 left-4">
              <div className="bg-brand-cyan/90 text-black text-[11px] font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-lg">
                <TrendingUp className="h-3 w-3" />
                {featuredVideo?.category || "In Evidenza"}
                <span className="opacity-60">/</span>
                <span className="opacity-80">Contest in corso</span>
              </div>
            </div>

            {/* Title */}
            <div className="absolute top-4 right-4 left-4 md:left-auto md:right-4">
              <h2 className="font-display text-headline-lg text-white drop-shadow-lg line-clamp-2 max-w-[70%] md:max-w-[80%]">
                {featuredVideo?.title || "Stefania Rinaldi - Cover & Inediti Live"}
              </h2>
            </div>

            {/* Stats row — hardcoded reference values */}
            <div className="absolute top-20 left-4 right-4 md:left-auto md:right-4 flex flex-wrap gap-3 text-xs text-slate-300">
              {referenceStats.map((stat, i) => (
                <StatBadge key={i} icon={stat.icon} label={stat.label} />
              ))}
            </div>

            {/* VOTA ORA button */}
            <div className="absolute bottom-24 left-4">
              <Button
                variant="cyan"
                size="lg"
                className="bg-brand-cyan text-black font-bold py-3 px-6 rounded-full flex items-center gap-2 shadow-lg shadow-brand-cyan-glow hover:shadow-xl hover:shadow-brand-cyan-glow"
                asChild
              >
                <a href="/c/vota">
                  <Gift className="h-4 w-4" />
                  VOTA ORA
                </a>
              </Button>
            </div>

            {/* Video controls bar */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent">
              <div className="flex items-center gap-3 text-white">
                <button className="w-8 h-8 rounded-full bg-brand-cyan/90 flex items-center justify-center hover:bg-brand-cyan transition-colors">
                  <Play className="h-4 w-4 text-black ml-0.5" />
                </button>
                <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-brand-cyan rounded-full" />
                </div>
                <button className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <span className="text-xs font-mono">2:27</span>
                </button>
                <button className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a2 2 0 0 1 0 2.83" />
                    <path d="M18.36 12H9" />
                  </svg>
                </button>
                <button className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* ===== RIGHT: Contest cards + featured artists (lg:col-span-1) ===== */}
          <div className="lg:col-span-1 space-y-4">
            {/* Contest cards — glassmorphism */}
            {contests.map((contest, i) => (
              <div
                key={i}
                className="glass-card p-4 rounded-2xl"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <p className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold mb-0.5">
                  {contest.subtitle}
                </p>
                <h3 className="text-base font-bold text-white leading-tight mb-2">
                  {contest.title}
                </h3>
                {contest.timer && (
                  <p className="text-xs text-slate-400 font-mono mb-3">
                    Contesta {contest.timer}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="cyan"
                    size="sm"
                    className="flex-1 bg-brand-cyan text-black font-bold py-2 rounded-full text-xs hover:bg-brand-cyan-hover"
                    asChild
                  >
                    <a href="/c/vota">VOTA ORA</a>
                  </Button>
                  <Button
                    variant="purple"
                    size="sm"
                    className="flex-1 bg-purple-600 text-white font-bold py-2 rounded-full text-xs hover:bg-purple-500"
                    asChild
                  >
                    <a href="/c/vota">PARTECIPA</a>
                  </Button>
                </div>
              </div>
            ))}

            {/* Featured artists strip */}
            <div className="pt-2">
              <p className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold mb-3">
                Next featured artists
              </p>
              <div className="flex flex-wrap gap-3">
                {artists.map((artist) => (
                  <div
                    key={artist.name}
                    className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 pr-3 rounded-full border border-slate-700/50"
                  >
                    <img
                      src={artist.avatar || `https://i.pravatar.cc/40?img=${artist.name.charCodeAt(0)}`}
                      alt={artist.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-cyan/30"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{artist.name}</p>
                      <p className="text-[10px] text-slate-400">{artist.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
