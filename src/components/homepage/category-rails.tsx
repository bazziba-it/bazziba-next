/** @format */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SafeImage, ThumbPlaceholder, RealAvatar } from "@/components/ui/media";
import { formatDurationSec, timeAgoIT } from "@/lib/format";
import type { BazzibaVideo } from "@/data/wp";

export interface Rail {
  name: string;
  slug: string;
  count: number;
  videos: BazzibaVideo[];
}

/**
 * Category rails — Netflix-style horizontal snap-scroll rows (home page).
 * Server-rendered; scrolling is native overflow-x + scroll-snap.
 */
export function CategoryRails({ rails }: { rails: Rail[] }) {
  return (
    <div className="space-y-8">
      {rails.map((rail) => (
        <section key={rail.slug} aria-label={rail.name}>
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-end justify-between mb-3">
            <h2 className="text-lg font-bold text-white font-['Poppins'] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff]" />
              {rail.name}
              <span className="text-xs font-normal text-white/30">{rail.count} video</span>
            </h2>
            <Link
              href={`/c/${rail.slug}`}
              className="text-xs text-white/40 hover:text-[#00f2ff] transition-colors flex items-center gap-1 flex-shrink-0"
            >
              Vedi tutto
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Snap-scroll rail — full-bleed on mobile, inset on desktop */}
          <div className="overflow-x-auto scrollbar-hide [mask-image:linear-gradient(to_right,black_94%,transparent)]">
            <div className="flex gap-3 w-max px-4 sm:px-6 lg:px-8 pb-1 snap-x snap-mandatory">
              {rail.videos.map((v) => (
                <Link
                  key={v.id}
                  href={`/watch/${v.id}`}
                  className="group w-[240px] sm:w-[280px] shrink-0 snap-start"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/5 group-hover:border-[#00f2ff]/30 transition-colors">
                    {v.thumbnail ? (
                      <SafeImage
                        src={v.thumbnail}
                        alt={v.title}
                        sizes="(max-width: 640px) 240px, 280px"
                        className={`object-cover transition-transform duration-300 group-hover:scale-[1.05] ${v.portrait ? "object-top" : ""}`}
                      />
                    ) : (
                      <ThumbPlaceholder title={v.title} className="h-full w-full" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {v.durationSec && (
                      <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                        {formatDurationSec(v.durationSec)}
                      </span>
                    )}
                    {v.tags.includes("in-evidenza") && (
                      <span className="absolute top-2 left-2 bg-[#00f2ff] text-[#050a14] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                        Top
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex gap-2 items-start">
                    <RealAvatar src={v.authorAvatar} name={v.authorName} className="w-6 h-6 rounded-full flex-shrink-0 text-[8px] border border-white/10" />
                    <div className="min-w-0">
                      <p className="text-[0.82rem] font-medium text-[#e5e7eb] leading-snug line-clamp-2 group-hover:text-[#00f2ff] transition-colors">
                        {v.title}
                      </p>
                      <p className="text-[11px] text-white/40 mt-0.5 truncate">
                        {v.authorName} · {timeAgoIT(v.date)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}

              {/* End-of-rail "see all" card */}
              <Link
                href={`/c/${rail.slug}`}
                className="group w-[120px] shrink-0 snap-start flex flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-[#00f2ff]/30 transition-colors aspect-video self-start"
              >
                <span className="w-10 h-10 rounded-full bg-[#00f2ff]/10 flex items-center justify-center group-hover:bg-[#00f2ff]/20 transition-colors">
                  <ArrowRight className="h-4 w-4 text-[#00f2ff]" />
                </span>
                <span className="text-[11px] text-white/50">Tutti i {rail.count}</span>
              </Link>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
