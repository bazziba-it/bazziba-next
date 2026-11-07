import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { GlassCard } from "@/components/ui";
import { RealAvatar } from "@/components/ui/media";
import { timeAgoIT } from "@/lib/format";
import type { WpPulseItem } from "@/data/wp";

/**
 * "Live pulse" — the latest REAL comments across the site, linking to the
 * videos they belong to. Social proof + freshness between hero and rails.
 */
export function HomePulse({ items }: { items: WpPulseItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mb-10" aria-label="Ultimi commenti">
      <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f2ff] opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f2ff]" />
        </span>
        Ultimi commenti dalla community
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.slice(0, 3).map((item, i) => (
          <GlassCard key={item.id} interactive={false} staggerIndex={i} className="p-3.5 rounded-xl">
            <Link href={`/watch/${item.videoId}`} className="group block">
              <div className="flex items-center gap-2.5 mb-2">
                <RealAvatar src={item.authorAvatar} name={item.authorName} className="w-7 h-7 text-[9px] flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white truncate">{item.authorName}</p>
                  <p className="text-[10px] text-white/35">{timeAgoIT(item.date)}</p>
                </div>
                <MessageCircle className="h-3.5 w-3.5 text-[#00f2ff]/50 flex-shrink-0" />
              </div>
              <p className="text-[0.82rem] text-white/70 leading-snug line-clamp-2 mb-2">
                {item.text.replace(/https?:\/\/\S+/g, (u) => {
                  try { return `🔗 ${new URL(u).hostname.replace(/^www\./, "")}`; } catch { return "🔗 link"; }
                })}
              </p>
              <p className="text-[11px] text-[#00f2ff]/70 truncate group-hover:text-[#00f2ff] transition-colors">
                su “{item.videoTitle}” →
              </p>
            </Link>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
