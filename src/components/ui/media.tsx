"use client";

/**
 * Local media fallbacks (ADR-0003): when WP data has no avatar/thumbnail,
 * render these — never picsum/pravatar/external placeholder CDNs.
 */

import Image from "next/image";
import { useState } from "react";

const AVATAR_COLORS = ["#00f2ff", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#3b82f6"];

function colorFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Initials-based avatar — used when the WP user has no avatar_urls. */
export function InitialsAvatar({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span
      aria-label={name}
      className={`flex items-center justify-center rounded-full font-bold text-[#050a14] select-none ${className}`}
      style={{ backgroundColor: colorFor(name) }}
    >
      {initials(name)}
    </span>
  );
}

/** Avatar that renders the WP gravatar/upload when present, initials otherwise. */
export function RealAvatar({
  src,
  name,
  className = "",
  imgClassName = "",
}: {
  src: string | null | undefined;
  name: string;
  className?: string;
  imgClassName?: string;
}) {
  if (!src) return <InitialsAvatar name={name} className={className} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={name} loading="lazy" className={`rounded-full object-cover ${className} ${imgClassName}`} />
  );
}

/** Glass placeholder for a missing video thumbnail — play glyph + title initial. */
export function ThumbPlaceholder({ title, className = "" }: { title: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-[#0a1428] to-[#050a14] ${className}`}
      aria-label={title}
    >
      <div className="w-14 h-14 rounded-full bg-[#00f2ff]/15 border border-[#00f2ff]/30 flex items-center justify-center">
        <svg className="w-6 h-6 text-[#00f2ff] ml-0.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  );
}

/**
 * next/image with automatic ThumbPlaceholder fallback when the upstream
 * image fails (dead WP attachment URL, optimizer timeout on huge originals).
 */
export function SafeImage({
  src,
  alt,
  sizes,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return <ThumbPlaceholder title={alt} className="absolute inset-0" />;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setFailed(true)}
      // WP already serves right-sized variants (pickThumbSize ~768w) — the
      // Next optimizer only adds timeout risk (500/504 on slow upstreams).
      unoptimized
    />
  );
}
