/** @format */

"use client";

// ADR-0001 — Liquid Glass 2026 primitives, client half (§6.5: only GlassCard
// interactive entrances and GlassNav scroll behaviour need "use client").
// Hover/press stays CSS-only (D5); framer-motion is used for mount/unmount only.

import {
  forwardRef,
  useEffect,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  GlassSurface,
  MOTION,
  STAGGER,
  glassVariants,
  type GlassTier,
} from "./glass";

// framer-motion owns drag/animation handlers; drop the conflicting DOM ones.
type MotionSafeDivProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
>;

export interface GlassCardProps extends MotionSafeDivProps {
  tier?: GlassTier;
  /** false for static panels (contest stats, FAQ) — no hover lift, no motion (§6.2). */
  interactive?: boolean;
  accent?: boolean;
  media?: boolean;
  /** Explicit entrance delay in seconds. */
  delay?: number;
  /** §5.4 index-based stagger; items past the cap appear instantly. */
  staggerIndex?: number;
  staggerStep?: "grid" | "list";
  /** Card lives inside a scrolling list — suppresses the sheen film (§8). */
  scrollList?: boolean;
}

/**
 * Usage: <GlassCard staggerIndex={i}>…</GlassCard>
 * GlassSurface + hover/press behaviour: hover lift via CSS (.glass-interactive,
 * §4.5), optional staggered spring entrance via framer-motion (§5.3/§5.4),
 * reduced-motion collapses to opacity-only (§9.3). Forwarded ref.
 */
export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(function GlassCard(
  {
    className,
    tier = "card",
    interactive = true,
    accent,
    media,
    delay,
    staggerIndex,
    staggerStep = "grid",
    scrollList,
    children,
    ...props
  },
  ref
) {
  const reduceMotion = useReducedMotion();
  const hasEntrance = delay != null || staggerIndex != null;

  // §5.4 — index-based, capped in code: after the cap there is no long tail.
  const stepMs = staggerStep === "grid" ? STAGGER.gridStepMs : STAGGER.listStepMs;
  const cap = staggerStep === "grid" ? STAGGER.gridCap : STAGGER.listCap;
  const enterDelay =
    delay ?? (staggerIndex != null ? (Math.min(staggerIndex, cap) * stepMs) / 1000 : 0);

  if (!interactive && !hasEntrance) {
    // Static panel — plain GlassSurface, no client motion needed (§6.2).
    return (
      <GlassSurface
        ref={ref}
        tier={tier}
        accent={accent}
        media={media}
        data-glass-scroll={scrollList || undefined}
        className={className}
        {...props}
      >
        {children}
      </GlassSurface>
    );
  }

  return (
    <motion.div
      ref={ref}
      data-glass-tier={tier}
      data-glass-context={media ? "media" : undefined}
      data-glass-scroll={scrollList || undefined}
      className={cn(
        glassVariants({ tier, accent, media, interactive: interactive || undefined }),
        className
      )}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={STAGGER.viewport}
      transition={reduceMotion ? { duration: 0 } : { ...MOTION.enter, delay: enterDelay }}
      whileTap={interactive && !reduceMotion ? { scale: 0.97, transition: MOTION.press } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
});

/**
 * FadeIn — scroll-driven section reveal (ADR-0003): opacity + 10px rise on
 * the shared MOTION.enter spring, whileInView once. For headers/panels that
 * aren't GlassCards.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={STAGGER.viewport}
      transition={reduceMotion ? { duration: 0 } : { ...MOTION.enter, delay }}
    >
      {children}
    </motion.div>
  );
}

export interface GlassNavProps extends HTMLAttributes<HTMLElement> {
  brand?: ReactNode;
  links?: ReactNode;
  actions?: ReactNode;
  /** Force the condensed (scrolled) state; defaults to tracking scrollY > 8. */
  condensed?: boolean;
  /** Override the inner container classes (default "glass-nav-inner container-max" = 1280px).
   *  navigation.tsx keeps its legacy 1600px via this prop — ADR-0001 D8/§13 hotspot. */
  innerClassName?: string;
}

/**
 * Usage: <GlassNav brand={<Logo/>} links={…} actions={…} />
 * Docked surface + scroll response (§6.4): fill deepens and height drops 4px
 * past scrollY 8, driven by a single passive listener in this one component —
 * never one per page. Sheen is suppressed on docked (§8).
 */
export const GlassNav = forwardRef<HTMLElement, GlassNavProps>(function GlassNav(
  { className, innerClassName, brand, links, actions, condensed, ...props },
  ref
) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isCondensed = condensed ?? scrolled;

  return (
    <GlassSurface
      as="header"
      tier="docked"
      ref={ref}
      className={cn(
        "sticky top-0 w-full z-[var(--z-docked)]",
        isCondensed && "glass-nav-condensed",
        className
      )}
      {...props}
    >
      <div className={innerClassName ?? "glass-nav-inner container-max"}>
        {brand}
        {links != null ? <nav aria-label={props["aria-label"] ?? "Primary"}>{links}</nav> : null}
        {actions}
      </div>
    </GlassSurface>
  );
});
