/** @format */

// ADR-0001 (docs/adr/0001-liquid-glass-2026.md) — Liquid Glass 2026 primitives.
// Server-safe half: no "use client". The material recipe itself lives in
// globals.css keyed on the classes glassVariants emits (D2); this file only
// applies it. Client half (GlassCard entrance, GlassNav scroll) is in
// glass-motion.tsx, re-exported through ./index so "@/components/ui" stays
// the single import path (D3).

import { forwardRef, type HTMLAttributes, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "./index";

/* §5.3 — the single shared framer-motion spring configs. No ad-hoc springs per page. */
export const MOTION = {
  enter: { type: "spring", stiffness: 260, damping: 30, mass: 0.9 }, // cards/panels: y 8 -> 0, opacity 0 -> 1
  hover: { type: "spring", stiffness: 420, damping: 28 }, // scale 1 -> 1.015, y 0 -> -2
  press: { type: "spring", stiffness: 600, damping: 32 }, // scale -> 0.97
  page: { type: "spring", stiffness: 180, damping: 26 }, // route/sheet transitions
} as const;

/* §5.4 — stagger rules: index-based (delay = i * step), capped in code, never a long tail. */
export const STAGGER = {
  gridStepMs: 45,
  listStepMs: 30,
  gridCap: 8, // ≈ 360ms
  listCap: 6, // ≈ 180ms
  viewport: { once: true, margin: "-10%" },
} as const;

export type GlassTier = "docked" | "card" | "raised" | "overlay";

/* §6.1/§12.4 — CVA over the compat classes defined in globals.css, so primitives
   and the 13 raw-class call sites (§10) share one recipe. */
export const glassVariants = cva("glass", {
  variants: {
    tier: {
      docked: "glass-docked",
      card: "glass-card",
      raised: "glass-raised",
      overlay: "glass-overlay",
    },
    accent: { true: "glass-accent" },
    media: { true: "glass-media" },
    interactive: { true: "glass-interactive" },
  },
  defaultVariants: { tier: "card" },
});

export interface GlassSurfaceProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof glassVariants> {
  /** Elevation tier picked by role (docked / card / hero / modal), never by ad-hoc blur values (D4). */
  tier?: GlassTier;
  /** Cyan edge-light + accent tint — active/selected/featured only, it is not decoration (§4.5). */
  accent?: boolean;
  /** Backdrop is an image — forces the §9.2 scrim layer before text is placed on it. */
  media?: boolean;
  as?: "div" | "section" | "article" | "aside" | "header";
}

/**
 * Usage: <GlassSurface tier="raised" accent>…</GlassSurface>
 * The only place the glass recipe is applied (§6.1): isolation, fill, elevation
 * shadow, sheen ::before (suppressed on docked, §8), accent rim ::after, media scrim.
 */
export const GlassSurface = forwardRef<HTMLElement, GlassSurfaceProps>(function GlassSurface(
  { className, tier = "card", accent, media, as, ...props },
  ref
) {
  const Tag = (as ?? "div") as any;
  return (
    <Tag
      ref={ref}
      data-glass-tier={tier}
      data-glass-context={media ? "media" : undefined}
      className={cn(glassVariants({ tier, accent, media }), className)}
      {...props}
    />
  );
});

export interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "default" | "sm" | "lg" | "icon";
}

/**
 * Usage: <GlassButton size="sm">…</GlassButton>
 * Thin alias: the existing Button with variant="glass" (§6.3). variant="cyan"
 * stays the primary CTA; existing 12 variants and their call sites are untouched.
 * Forwarded ref per §6.5 (Button itself forwards it as of the same change).
 */
export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(function GlassButton(
  { size = "default", ...props },
  ref
) {
  return <Button ref={ref} variant="glass" size={size} {...props} />;
});
