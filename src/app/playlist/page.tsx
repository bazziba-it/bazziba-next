"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ListMusic, Play, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { getWatchLater, removeFromWatchLater, type WatchLaterItem } from "@/lib/watch-later";
import { formatDurationSec } from "@/lib/format";

export default function PlaylistPage() {
  const [items, setItems] = useState<WatchLaterItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(getWatchLater());
    const onChange = () => setItems(getWatchLater());
    window.addEventListener("watch-later-changed", onChange);
    return () => window.removeEventListener("watch-later-changed", onChange);
  }, []);

  const move = (index: number, dir: -1 | 1) => {
    const next = [...items];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    setItems(next);
    localStorage.setItem("bazziba_watch_later", JSON.stringify(next));
  };

  if (!mounted) return <div className="min-h-screen bg-[#050a14]" />;

  return (
    <div className="min-h-screen bg-[#050a14] text-white">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ListMusic className="h-6 w-6 text-[#00f2ff]" />
            Guarda più tardi
          </h1>
          {items.length > 0 && (
            <Link
              href={`/watch/${items[0].id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#00f2ff] text-black text-sm font-bold rounded-full hover:bg-[#00d4e6] transition-colors"
            >
              <Play className="h-4 w-4" />
              Riproduci tutto
            </Link>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ListMusic className="h-12 w-12 text-white/15 mx-auto mb-4" />
            <p className="text-white/50 mb-2">La tua lista è vuota.</p>
            <p className="text-sm text-white/30 mb-6">
              Salva i video con &quot;Guarda più tardi&quot; dalla pagina del video — li ritrovi qui, su questo dispositivo.
            </p>
            <Link href="/feed/trending" className="text-[#00f2ff] hover:underline text-sm">
              Scopri i video →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((v, i) => (
              <div key={v.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#00f2ff]/25 transition-colors group">
                <span className="text-xs font-mono text-white/25 w-5 text-center flex-shrink-0">{i + 1}</span>
                <Link href={`/watch/${v.id}`} className="relative w-32 sm:w-40 aspect-video rounded-lg overflow-hidden bg-black flex-shrink-0">
                  {v.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-white/20 text-xs">N/A</div>
                  )}
                  {v.durationSec && (
                    <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[10px] font-mono px-1 rounded">
                      {formatDurationSec(v.durationSec)}
                    </span>
                  )}
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/watch/${v.id}`} className="font-medium text-sm line-clamp-2 hover:text-[#00f2ff] transition-colors">
                    {v.title}
                  </Link>
                  <p className="text-xs text-white/40 mt-1 truncate">{v.authorName} · {v.category}</p>
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Sposta su"
                    className="p-1.5 text-white/30 hover:text-white disabled:opacity-20 rounded">
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Sposta giù"
                    className="p-1.5 text-white/30 hover:text-white disabled:opacity-20 rounded">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  onClick={() => removeFromWatchLater(v.id)}
                  aria-label="Rimuovi dalla lista"
                  className="p-2 text-white/30 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
