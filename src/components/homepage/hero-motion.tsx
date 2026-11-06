"use client";

/** Hero FX islands (ADR-0003): scroll parallax + headline word-stagger.
 *  Shared MOTION springs only; reduced-motion collapses to static rendering. */

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { MOTION, STAGGER } from "@/components/ui/glass";

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
