"use client";

/** Hero FX islands (ADR-0003): scroll parallax + headline word-stagger.
 *  Shared MOTION springs only; reduced-motion collapses to static rendering. */

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Gift, Calendar, TrendingUp } from "lucide-react";
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
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (slides.length < 2) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [slides.length]);

  const restart = (next: (p: number) => number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrent(next);
    intervalRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length);
    }, 6500);
  };

  if (slides.length === 0) return null;

  return (
    <>
      {/* Slides — parallax wraps the whole media stack */}
      <HeroParallax>
        {slides.map((video, i) => (
          <div
            key={video.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            aria-hidden={i !== current}
          >
            {video.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={video.thumbnail}
                alt={video.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
            ) : (
              <ThumbPlaceholder title={video.title} className="absolute inset-0" />
            )}
          </div>
        ))}
      </HeroParallax>

      {/* Gradient scrims (§9.2) */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 to-transparent z-10 pointer-events-none" />

      {slides.map((video, i) => (
        <div
          key={video.id}
          className={`absolute inset-0 z-20 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden={i !== current}
        >
          {/* Top-left: real category */}
          <div className="absolute top-4 left-4">
            <div className="bg-brand-cyan/90 text-black text-[11px] font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-lg">
              <TrendingUp className="h-3 w-3" />
              {video.categorySlug ? video.category : "In Evidenza"}
            </div>
          </div>

          {/* Title — staggered entrance replays per slide */}
          <div className="absolute top-4 right-4 left-4 md:left-auto md:right-4">
            <AnimatedHeadline
              text={video.title}
              className="font-display text-headline-lg text-white drop-shadow-lg line-clamp-2 max-w-[70%] md:max-w-[80%]"
            />
          </div>

          {/* Real meta: author + publish date */}
          <div className="absolute top-20 left-4 right-4 flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <Link
              href={video.authorSlug ? `/u/${video.authorSlug}` : "#"}
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
              <Gift className="h-4 w-4" />
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
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand-navy-800/70 border border-white/10 flex items-center justify-center hover:bg-brand-navy-700/80 transition-colors text-white z-30"
            aria-label="Slide precedente"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => restart((p) => (p + 1) % slides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand-navy-800/70 border border-white/10 flex items-center justify-center hover:bg-brand-navy-700/80 transition-colors text-white z-30"
            aria-label="Slide successiva"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-6 right-4 flex gap-1.5 z-30">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => restart(() => i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? "bg-brand-cyan w-6" : "bg-white/30 w-3 hover:bg-white/50"
                }`}
                aria-label={`Vai alla slide ${i + 1}`}
              />
            ))}
          </div>
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
