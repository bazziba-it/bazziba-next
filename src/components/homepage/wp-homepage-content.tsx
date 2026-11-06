/** @format */

"use client";

import Link from "next/link";
import FeaturedHero from "@/components/homepage/featured-hero";
import Footer from "@/components/layout/footer";
import { GlassCard, FadeIn } from "@/components/ui";
import { ThumbPlaceholder, RealAvatar } from "@/components/ui/media";
import type { BazzibaVideo, WpTerm } from "@/data/wp";
import { Play, ChevronLeft, ChevronRight, Share2, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";

/* ===== StreamTube Eye-Catching Slider — real WP data, no fabricated metrics ===== */
function StreamTubeSlider({ videos }: { videos: BazzibaVideo[] }) {
  const sliderVideos = videos.slice(0, 5);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (sliderVideos.length < 2) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderVideos.length);
    }, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sliderVideos.length]);

  const restart = (next: (p: number) => number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrent(next);
    intervalRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % sliderVideos.length);
    }, 6000);
  };

  if (sliderVideos.length === 0) return null;

  return (
    <section className="relative w-full h-[420px] md:h-[500px] overflow-hidden bg-black rounded-2xl mb-6 shadow-2xl">
      {sliderVideos.map((video, i) => (
        <div
          key={video.id}
          className={`absolute inset-0 flex items-center justify-center p-8 transition-opacity duration-700 ${
            i === current ? "opacity-[1] z-10" : "opacity-[0] z-0"
          }`}
        >
          <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl group">
            <div className="absolute inset-0 bg-black">
              {video.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={video.thumbnail} alt={video.title} className="h-full w-full object-cover" />
              ) : (
                <ThumbPlaceholder title={video.title} className="h-full w-full" />
              )}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

            <Link href={`/watch/${video.id}`} className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-brand-cyan/90 flex items-center justify-center shadow-2xl shadow-cyan-glow-1 hover:scale-110 transition-transform cursor-pointer">
                <Play className="h-10 w-10 text-black ml-0.5" />
              </div>
            </Link>

            <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
              <h3 className="text-xl font-bold text-white font-['Poppins'] drop-shadow-lg mb-2">
                {video.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-white/70">
                <span className="flex items-center gap-1.5">
                  <User className="h-3 w-3" />
                  {video.authorName}
                </span>
                {video.categorySlug && (
                  <span className="bg-brand-cyan/20 text-brand-cyan px-2 py-0.5 rounded-full text-xs">
                    {video.category}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={() => restart((prev) => (prev - 1 + sliderVideos.length) % sliderVideos.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand-navy-800/70 border border-white/10 flex items-center justify-center hover:bg-brand-navy-700/80 transition-colors text-white z-20"
        aria-label="Precedente"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => restart((prev) => (prev + 1) % sliderVideos.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand-navy-800/70 border border-white/10 flex items-center justify-center hover:bg-brand-navy-700/80 transition-colors text-white z-20"
        aria-label="Successivo"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {sliderVideos.map((_, i) => (
          <button
            key={i}
            onClick={() => restart(() => i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current ? "bg-brand-cyan w-6" : "bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="absolute top-4 left-4">
        <span className="text-[11px] uppercase tracking-widest text-brand-cyan font-semibold bg-brand-navy-800/70 border border-white/10 px-2 py-1 rounded-full">
          In Evidenza
        </span>
      </div>
    </section>
  );
}

interface WpHomepageContentProps {
  videos: BazzibaVideo[];
  sliderVideos: BazzibaVideo[];
  heroVideo: BazzibaVideo | null;
  contestCards: { title: string; subtitle: string }[];
  featuredArtists: { name: string; role: string; avatar?: string | null }[];
  categories: WpTerm[];
}

/* ===== Main homepage content — props from the server page, real WP data only ===== */
export default function WpHomepageContent({
  videos,
  sliderVideos,
  heroVideo,
  contestCards,
  featuredArtists,
  categories,
}: WpHomepageContentProps) {
  if (videos.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050a14]">
        <main className="flex-1 pt-[64px]">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <p className="text-white/40 text-sm font-['Poppins']">
                Nessun video trovato — bazziba.it non risponde. Riprova più tardi.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050a14]">
      <main className="flex-1 pt-[64px]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <StreamTubeSlider videos={sliderVideos} />
        </div>

        <div className="max-w-full">
          <FeaturedHero
            featuredVideo={heroVideo}
            contestCards={contestCards}
            featuredArtists={featuredArtists}
          />
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex gap-6">
          {/* Real category sidebar from video_category taxonomy */}
          <aside className="hidden xl:block w-[200px] flex-shrink-0">
            <div className="sticky top-[80px]">
              <p className="text-[11px] uppercase tracking-widest text-white/30 font-semibold mb-3 px-2">
                Categorie
              </p>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/c/${cat.slug}`}
                    className="flex items-center gap-2 px-2 py-2 text-sm text-white/60 hover:text-[#00f2ff] hover:bg-white/5 rounded-lg transition-all"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff]/40" />
                    {cat.name}
                    <span className="ml-auto text-[10px] text-white/25">{cat.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <FadeIn className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-xl font-bold text-white font-['Poppins']">
                Ultime pubblicazioni
                <span className="ml-2 text-sm font-normal text-white/30">
                  ({videos.length} video)
                </span>
              </h2>
              <Link
                href="/feed/latest"
                className="text-xs text-white/40 hover:text-[#00f2ff] transition-colors flex items-center gap-1"
              >
                Vedi tutto
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 xl:gap-5">
              {videos.map((vid, index) => (
                <GlassCard key={vid.id} staggerIndex={index} scrollList className="overflow-hidden">
                  <Link href={`/watch/${vid.id}`} className="group block" prefetch={false}>
                    <div className="relative aspect-video overflow-hidden bg-black">
                      {vid.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={vid.thumbnail}
                          alt={vid.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                          loading="lazy"
                        />
                      ) : (
                        <ThumbPlaceholder title={vid.title} className="h-full w-full" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-11 h-11 rounded-full bg-white/15 border-2 border-white/30 flex items-center justify-center">
                          <svg className="h-5 w-5 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      {vid.categorySlug && (
                        <div className="absolute bottom-2.5 left-2.5 bg-brand-cyan/90 text-[#050a14] text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                          {vid.category}
                        </div>
                      )}
                    </div>
                    <div className="p-3 flex gap-2.5 items-start">
                      <RealAvatar
                        src={vid.authorAvatar}
                        name={vid.authorName}
                        className="w-7 h-7 rounded-full flex-shrink-0 border border-white/10 text-[9px]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[0.85rem] font-medium text-[#e5e7eb] leading-[1.3] line-clamp-2">{vid.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{vid.authorName}</p>
                      </div>
                    </div>
                    <div className="px-3 pb-3">
                      <span className="flex items-center justify-center gap-1 py-1.5 w-full text-[11px] font-semibold rounded-md border font-display transition-all bg-brand-cyan/15 text-brand-cyan border-brand-cyan/20 hover:bg-brand-cyan/25 hover:border-brand-cyan/40">
                        GUARDA
                      </span>
                    </div>
                  </Link>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
