import Image from "next/image";

/**
 * BAZZIBA official brand assets (from bazziba.it):
 * - /logo.png — the lowercase "bazziba" gradient wordmark (152x60, transparent)
 * - /icon-192.png — the official app icon (PWA/favicon/touch icons)
 */

export function BazzibaLogo({ height = 26, className = "" }: { height?: number; className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="BAZZIBA!"
      width={Math.round((height * 152) / 60)}
      height={height}
      className={className}
      priority
    />
  );
}
