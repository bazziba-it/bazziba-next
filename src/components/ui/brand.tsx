import { useId } from "react";

/**
 * BAZZIBA! brand mark — "signal into play": three ascending equalizer bars
 * morphing into a play triangle on a cyan gradient tile. Single source for
 * nav, footer, drawer, offline page; PWA/favicon PNGs are generated from it.
 */

export function BazzibaMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  // Unique gradient IDs per instance — multiple marks per page must not collide.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const tileId = `bz-tile-${uid}`;
  const sheenId = `bz-sheen-${uid}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="BAZZIBA!"
    >
      <defs>
        <linearGradient id={tileId} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#00f2ff" />
          <stop offset="1" stopColor="#00a9c9" />
        </linearGradient>
        <linearGradient id={sheenId} x1="0" y1="0" x2="0" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="12" fill={`url(#${tileId})`} />
      <rect x="2" y="2" width="44" height="22" rx="12" fill={`url(#${sheenId})`} />
      {/* ascending equalizer bars */}
      <rect x="10" y="24" width="4.6" height="12" rx="2.3" fill="#050a14" />
      <rect x="16.9" y="16" width="4.6" height="20" rx="2.3" fill="#050a14" />
      <rect x="23.8" y="10" width="4.6" height="26" rx="2.3" fill="#050a14" />
      {/* play triangle completing the rise */}
      <path d="M32.5 17.5 L32.5 30.5 L41.5 24 Z" fill="#050a14" />
    </svg>
  );
}

export function BazzibaWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-bold tracking-tight text-white ${className}`}>
      BAZZIBA<span className="text-[#00f2ff]">!</span>
    </span>
  );
}

export function BazzibaLogo({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <BazzibaMark size={size} />
      <BazzibaWordmark className="text-lg" />
    </span>
  );
}
