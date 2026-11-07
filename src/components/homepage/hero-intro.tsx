"use client";

/** Hero intro strip (ADR-0003): fills the dead space between nav and carousel
 *  with a headline, REAL live counters (count-up on scroll into view), and a
 *  big glass search CTA. All numbers come from WP X-WP-Total — no fabrication. */

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MOTION, STAGGER } from "@/components/ui/glass";
import { AnimatedHeadline } from "@/components/homepage/hero-motion";
import { SearchAutocomplete } from "@/components/layout/search-autocomplete";
import { Film, Users, MessageSquare, TrendingUp, Trophy } from "lucide-react";
import Link from "next/link";

/** Count-up number when scrolled into view (rAF, ~1s, ease-out). */
function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  // SSR renders the real value; the count-up replays 0→value on first view
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView || value <= 0) return;
    setDisplay(0);
    const start = performance.now();
    const dur = 1100;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
      {display.toLocaleString("it-IT")}
    </span>
  );
}

interface HeroIntroProps {
  stats: { videos: number; artists: number; comments: number };
}

export function HeroIntro({ stats }: HeroIntroProps) {
  const items = [
    { icon: Film, value: stats.videos, label: "Video" },
    { icon: Users, value: stats.artists, label: "Artisti" },
    { icon: MessageSquare, value: stats.comments, label: "Commenti" },
  ].filter((s) => s.value > 0);

  return (
    <section className="relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-brand-cyan/8 blur-3xl" />
      </div>

      <div className="container-max relative px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-center py-8 md:py-10">
          {/* Headline + counters */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={MOTION.enter}
              className="text-[11px] uppercase tracking-[0.25em] text-brand-cyan font-semibold mb-3"
            >
              La piattaforma degli artisti italiani
            </motion.p>

            <AnimatedHeadline
              text="Guarda. Vota. Condividi."
              className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-white tracking-tight leading-[1.05] mb-5"
            />

            {items.length > 0 && (
              <div className="flex items-center gap-6 sm:gap-8">
                {items.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...MOTION.enter, delay: (Math.min(i + 1, STAGGER.gridCap) * STAGGER.gridStepMs) / 1000 }}
                    className="flex items-center gap-2.5"
                  >
                    <span className="w-9 h-9 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-4 w-4 text-brand-cyan" />
                    </span>
                    <span>
                      <Counter value={item.value} />
                      <span className="block text-[11px] text-white/55 uppercase tracking-wider">{item.label}</span>
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Big search CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...MOTION.enter, delay: 0.15 }}
            className="w-full lg:w-[420px]"
          >
            <div className="glass-raised rounded-2xl p-4 sm:p-5 border border-brand-cyan/20">
              <p className="text-sm font-medium text-white/80 mb-3">
                Cosa vuoi guardare oggi?
              </p>
              <SearchAutocomplete inputClassName="h-12 text-base rounded-xl" />
              <div className="flex items-center gap-2 mt-3">
                <Link
                  href="/feed/trending"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-brand-cyan/25 text-[#8ef7ff] text-xs font-semibold hover:bg-brand-cyan/35 transition-colors"
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  In Evidenza
                </Link>
                <Link
                  href="/contest"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-purple-600/15 text-purple-300 text-xs font-semibold hover:bg-purple-600/25 transition-colors"
                >
                  <Trophy className="h-3.5 w-3.5" />
                  Contest attivo
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
