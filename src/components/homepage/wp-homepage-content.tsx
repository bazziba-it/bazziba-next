/** @format */

"use client";

import Link from "next/link";
import FeaturedHero from "@/components/homepage/featured-hero";
import Footer from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { fetchBazzibaVideos, type BazzibaVideo } from "@/data/wp";
import {
  Play,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  Clock,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

/* ===== StreamTube Eye-Catching Slider — real WP data ===== */
function StreamTubeSlider({ videos }: { videos: BazzibaVideo[] }) {
  // Use first 3 published videos for the slider
  const sliderVideos = videos.slice(0, 3).map((v) => ({
    id: `slider-${v.id}`,
    title: v.title,
    thumbnail: v.thumbnail,
    views: v.viewCount,
    duration: v.duration,
    videoUrl: v.videoUrl,
  }));

  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderVideos.length);
    }, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sliderVideos.length]);

  const next = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrent((prev) => (prev + 1) % sliderVideos.length);
    intervalRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % sliderVideos.length);
    }, 6000);
  };

  const prev = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrent((prev) => (prev - 1 + sliderVideos.length) % sliderVideos.length);
    intervalRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % sliderVideos.length);
    }, 6000);
  };

  if (sliderVideos.length === 0) return null;

  return (
    <section className="relative w-full h-[420px] md:h-[500px] overflow-hidden bg-black rounded-2xl mb-6 shadow-2xl">
      {/* Slider items */}
      {sliderVideos.map((video, i) => (
        <div
          key={video.id}
          className={`absolute inset-0 flex items-center justify-center p-8 transition-opacity duration-700 ${
            i === current ? "opacity-[1] z-10" : "opacity-[0] z-0"
          }`}
        >
          <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl group">
            {/* Video background */}
            <div className="absolute inset-0 bg-black">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

            {/* Play button center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-brand-cyan/90 flex items-center justify-center shadow-2xl shadow-brand-cyan-glow hover:scale-110 transition-transform cursor-pointer">
                <Play className="h-10 w-10 text-black ml-0.5" />
              </div>
            </div>

            {/* Video info */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-xl font-bold text-white font-['Poppins'] drop-shadow-lg mb-2">
                {video.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-white/70">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {video.views} visualizzazioni
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {video.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Share2 className="h-3 w-3" />
                  Condividi
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors text-white z-20"
        aria-label="Precedente"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors text-white z-20"
        aria-label="Successivo"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {sliderVideos.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (intervalRef.current) clearInterval(intervalRef.current);
              setCurrent(i);
              intervalRef.current = setInterval(() => {
                setCurrent((p) => (p + 1) % sliderVideos.length);
              }, 6000);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current ? "bg-brand-cyan w-6" : "bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* "Eye Catching Slider" label */}
      <div className="absolute top-4 left-4">
        <span className="text-[11px] uppercase tracking-widest text-brand-cyan font-semibold bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
          Eye Catching Slider
        </span>
      </div>
    </section>
  );
}

/* ===== Main homepage content ===== */
function WpFetchedContent() {
  const [videos, setVideos] = useState<BazzibaVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchBazzibaVideos()
      .then((data) => {
        if (mounted) {
          setVideos(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("WP fetch error:", err);
        if (mounted) {
          setError(err instanceof Error ? err.message : "Impossibile caricare i video");
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050a14] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-[#00f2ff]" />
        <p className="mt-4 text-white/30 text-sm font-['Poppins']">Caricamento...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050a14]">
        <Navigation />
        <main className="flex-1 pt-[64px] lg:pt-[64px]">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <p className="text-red-400 text-sm font-['Poppins']">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050a14]">
        <Navigation />
        <main className="flex-1 pt-[64px] lg:pt-[64px]">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <p className="text-white/40 text-sm font-['Poppins']">Nessun video trovato</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Featured video = first video
  const featured = videos[0];
  // Contest cards = first 2 videos after featured
  const contestCards = videos.slice(1, 3).map((v, i) => ({
    title: v.title.slice(0, 40),
    subtitle: i === 0 ? "In Contest / Contest in corso" : "Iscrizioni",
    timer: i === 0 ? "00:00:07:05" : undefined,
  }));
  // Featured artists = authors of next 2 videos
  const featuredArtists = videos.slice(3, 5).map((v) => ({
    name: v.authorName.split(" ")[0],
    role: "Cantautore" as const,
    avatar: v.authorAvatar,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-[#050a14]">
      <Navigation />

      <main className="flex-1 pt-[64px] lg:pt-[64px]">
        {/* ===== StreamTube Eye-Catching Slider (real WP data) ===== */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <StreamTubeSlider videos={videos} />
        </div>

        {/* ===== StreamTube-style: fullwidth hero strip ===== */}
        <div className="max-w-full">
          <FeaturedHero
            featuredVideo={featured}
            contestCards={contestCards}
            featuredArtists={featuredArtists}
          />
        </div>

        {/* ===== StreamTube-style: video grid with sidebar categories ===== */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category sidebar — StreamTube left sidebar style */}
          <aside className="hidden xl:block w-[200px] flex-shrink-0">
            <div className="sticky top-[80px]">
              <p className="text-[11px] uppercase tracking-widest text-white/30 font-semibold mb-3 px-2">
                Categorie
              </p>
              <div className="space-y-1">
                {[
                  { name: "Tutti", slug: "tutti" },
                  { name: "Musica", slug: "musica" },
                  { name: "Viral Videos", slug: "viral-videos" },
                  { name: "VOTA", slug: "vota" },
                  { name: "Informazione", slug: "informazione" },
                  { name: "TV", slug: "tv" },
                  { name: "Giochi", slug: "giochi" },
                  { name: "Live", slug: "live" },
                ].map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/c/${cat.slug}`}
                    className="flex items-center gap-2 px-2 py-2 text-sm text-white/60 hover:text-[#00f2ff] hover:bg-white/5 rounded-lg transition-all"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Video grid — fullwidth main content */}
          <div className="flex-1">
            {/* Section header */}
            <div className="flex items-center justify-between mb-4 px-2">
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
            </div>

            {/* Grid — StreamTube responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 xl:gap-5">
              {videos.map((vid, index) => (
                <Link
                  key={vid.id}
                  href={`/watch/${vid.id}`}
                  className="streamtube-card group block animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  prefetch={false}
                >
                  <div className="thumbnail">
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="play-overlay">
                      <div className="play-icon">
                        <svg className="h-5 w-5 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="duration">
                      {Math.floor(vid.duration / 60)}:
                      {String(vid.duration % 60).padStart(2, "0")}
                    </div>
                    <div className="category-badge">{vid.category}</div>
                  </div>
                  <div className="info">
                    {vid.authorAvatar && (
                      <div className="author-avatar">
                        <img src={vid.authorAvatar} alt="" />
                      </div>
                    )}
                    <div className="meta">
                      <p className="title">{vid.title}</p>
                      <p className="author">{vid.authorName}</p>
                      <p className="views">@{vid.viewCount} visualizzazioni</p>
                    </div>
                  </div>
                  <div className="px-3 pb-3">
                    <button
                      className={`action-btn ${
                        vid.category === "VOTA" || vid.category === "Live" ? "watch" : ""
                      }`}
                    >
                      {vid.category === "VOTA" || vid.category === "Live" ? "VOTA" : "GUARDA"}
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function WpHomepageContent() {
  return <WpFetchedContent />;
}
