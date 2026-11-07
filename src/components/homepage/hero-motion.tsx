"use client";

/** Hero FX islands (ADR-0003): scroll parallax + headline word-stagger.
 *  Shared MOTION springs only; reduced-motion collapses to static rendering. */

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, Vote, Calendar, TrendingUp } from "lucide-react";
import { MOTION, STAGGER } from "@/components/ui/glass";
import { RealAvatar, ThumbPlaceholder } from "@/components/ui/media";
import type { BazzibaVideo } from "@/data/wp";

/** Parallax media layer: media drifts up to 18% + scales 1→1.08 as the hero scrolls out. */
export function HeroParallax({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  if (reduce) {
    return <div className={`absolute inset-0 overflow-hidden ${className}`}>{children}</div>;
  }

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div style={{ y, scale }} className="absolute inset-0">
        {children}
      </motion.div>
    </div>
  );
}

function formatDateIT(iso?: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return "";
  }
}

/**
 * Rotating hero carousel — one slide per in-evidenza video. Crossfade is
 * opacity-only; per-slide AnimatedHeadline replays via key remount.
 */
export function HeroCarousel({ videos }: { videos: BazzibaVideo[] }) {
  const slides = videos.slice(0, 5);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [slides.length, paused]);

  const restart = (next: (p: number) => number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrent(next);
    if (!paused) {
      intervalRef.current = setInterval(() => {
        setCurrent((p) => (p + 1) % slides.length);
      }, 6500);
    }
  };

  if (slides.length === 0) return null;

  return (
    <>
      {/* Slides — parallax wraps the whole media stack; active slide Ken-Burns zooms */}
      <HeroParallax>
        {slides.map((video, i) => (
          <motion.div
            key={video.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            aria-hidden={i !== current}
            animate={i === current && !paused ? { scale: [1, 1.06] } : { scale: 1 }}
            transition={i === current && !paused ? { duration: 7, ease: "linear", repeat: Infinity, repeatType: "reverse" } : { duration: 0.4 }}
            style={{ transformOrigin: "center" }}
          >
            {video.thumbnail ? (
              <>
                {/* Blurred backdrop fill — portrait posters get a soft side fill
                    instead of hard crops (landscape fully covers it anyway) */}
                <Image
                  src={video.thumbnail}
                  alt=""
                  aria-hidden
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority={i === 0}
                  className="object-cover scale-125 blur-2xl opacity-40"
                  unoptimized
                />
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority={i === 0}
                  className="object-cover"
                  unoptimized
                />
              </>
            ) : (
              <ThumbPlaceholder title={video.title} className="absolute inset-0" />
            )}
          </motion.div>
        ))}
      </HeroParallax>

      {/* Gradient scrims (§9.2) */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 to-transparent z-10 pointer-events-none" />

      {/* Rotation progress bar — restarts per slide, freezes on pause */}
      {slides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-30">
          <div
            key={paused ? `paused-${current}` : `slide-${current}`}
            className="h-full bg-brand-cyan hero-rotation-progress"
            style={{ animationPlayState: paused ? "paused" : "running" }}
          />
        </div>
      )}

      {slides.map((video, i) => (
        <div
          key={video.id}
          className={`absolute inset-0 z-20 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden={i !== current}
        >
          {/* Stacked overlay: category chip → title → meta (no absolute collisions) */}
          <div className="absolute top-4 left-4 right-4 flex flex-col items-start gap-2.5">
            <div className="bg-brand-cyan/90 text-black text-[11px] font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-lg">
              <TrendingUp className="h-3 w-3" />
              {video.categorySlug ? video.category : "In Evidenza"}
            </div>
            <AnimatedHeadline
              text={video.title}
              className="font-display text-headline-lg text-white drop-shadow-lg line-clamp-2 max-w-[85%]"
            />
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <Link
                href={`/u/${video.authorSlug || video.authorId}`}
                className="flex items-center gap-2 bg-brand-navy-800/70 px-2.5 py-1 rounded-full border border-white/10 hover:border-[#00f2ff]/40 transition-colors"
              >
                <RealAvatar src={video.authorAvatar} name={video.authorName} className="w-4 h-4 text-[7px]" />
                {video.authorName}
              </Link>
              {video.date && (
                <span className="flex items-center gap-1 bg-brand-navy-800/70 px-2.5 py-1 rounded-full border border-white/10">
                  <Calendar className="h-3 w-3 text-brand-cyan" />
                  {formatDateIT(video.date)}
                </span>
              )}
            </div>
          </div>

          {/* CTAs */}
          <div className="absolute bottom-6 left-4 flex gap-3">
            <Link
              href={`/watch/${video.id}`}
              className="bg-brand-cyan text-black font-bold py-3 px-6 rounded-full flex items-center gap-2 shadow-lg shadow-cyan-glow-1 hover:shadow-xl hover:shadow-cyan-glow-2 text-sm transition-shadow"
            >
              <Play className="h-4 w-4" />
              GUARDA ORA
            </Link>
            <Link
              href="/contest"
              className="bg-purple-600 text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 hover:bg-purple-500 text-sm transition-colors"
            >
              <Vote className="h-4 w-4" />
              VOTA ORA
            </Link>
          </div>
        </div>
      ))}

      {/* Arrows + dots */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => restart((p) => (p - 1 + slides.length) % slides.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand-navy-800/70 border border-white/10 flex items-center justify-center hover:bg-brand-navy-700/80 transition-colors text-white z-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
            aria-label="Slide precedente"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => restart((p) => (p + 1) % slides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand-navy-800/70 border border-white/10 flex items-center justify-center hover:bg-brand-navy-700/80 transition-colors text-white z-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
            aria-label="Slide successiva"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-[4.75rem] right-4 flex items-center gap-1.5 z-30" role="tablist" aria-label="Slide del video in evidenza">
            {/* WCAG 2.2.2: pause/play for the auto-rotation */}
            <button
              onClick={() => setPaused((v) => !v)}
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 mr-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
              aria-label={paused ? "Riprendi la rotazione automatica" : "Metti in pausa la rotazione"}
              aria-pressed={paused}
            >
              {paused ? (
                <Play className="h-3 w-3 ml-px" />
              ) : (
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
              )}
            </button>
            {slides.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === current}
                onClick={() => restart(() => i)}
                className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan ${
                  i === current ? "bg-brand-cyan w-6" : "bg-white/30 w-3 hover:bg-white/50"
                }`}
                aria-label={`Vai alla slide ${i + 1} di ${slides.length}`}
              />
            ))}
          </div>
          {/* Screen-reader slide announcement */}
          <span className="sr-only" aria-live="polite">
            {`Slide ${current + 1} di ${slides.length}: ${slides[current]?.title ?? ""}`}
          </span>
        </>
      )}
    </>
  );
}

/** Headline word-stagger: 45ms per word, delay capped at 8 words (STAGGER.gridStepMs/gridCap). */
export function AnimatedHeadline({ text, className = "" }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  const words = text.split(" ").filter(Boolean);

  if (reduce) return <h2 className={className}>{text}</h2>;

  return (
    <motion.h2 className={className} initial="hidden" animate="show">
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block"
          custom={i}
          variants={{
            hidden: { opacity: 0, y: 14 },
            show: (idx: number) => ({
              opacity: 1,
              y: 0,
              transition: {
                ...MOTION.enter,
                delay: (Math.min(idx, STAGGER.gridCap) * STAGGER.gridStepMs) / 1000,
              },
            }),
          }}
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.h2>
  );
}
