"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Users, Film, ArrowUpDown } from "lucide-react";
import { RealAvatar } from "@/components/ui/media";
import type { WpUser } from "@/data/wp";

export interface ArtistEntry {
  user: WpUser;
  count: number;
  dominantCategory: string;
  dominantCategorySlug: string;
}

export function ArtistsDirectory({ artists }: { artists: ArtistEntry[] }) {
  const [query, setQuery] = useState("");
  const [sortByActivity, setSortByActivity] = useState(true);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = q
      ? artists.filter((a) => a.user.name.toLowerCase().includes(q) || a.user.slug.toLowerCase().includes(q))
      : [...artists];
    list.sort((a, b) =>
      sortByActivity
        ? b.count - a.count || a.user.name.localeCompare(b.user.name, "it")
        : a.user.name.localeCompare(b.user.name, "it")
    );
    return list;
  }, [artists, query, sortByActivity]);

  return (
    <div>
      {/* Search + sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca un artista..."
            className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00f2ff]/50 transition-colors"
          />
        </div>
        <button
          onClick={() => setSortByActivity((v) => !v)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60 hover:text-white hover:border-white/25 transition-colors"
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
          {sortByActivity ? "Più attivi" : "A–Z"}
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center py-16 text-white/40">Nessun artista trovato per &quot;{query}&quot;</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((a) => (
            <Link
              key={a.user.id}
              href={`/u/${a.user.slug}`}
              className="group glass-card rounded-2xl p-4 flex flex-col items-center text-center hover:border-[#00f2ff]/30 transition-colors"
            >
              <RealAvatar
                src={a.user.avatar_urls?.["96"] ?? null}
                name={a.user.name}
                className="w-16 h-16 rounded-full border-2 border-[#00f2ff]/20 group-hover:border-[#00f2ff]/50 transition-colors text-lg mb-3"
              />
              <p className="text-sm font-semibold text-white line-clamp-1 group-hover:text-[#00f2ff] transition-colors">
                {a.user.name}
              </p>
              {a.count > 0 && (
                <p className="text-[11px] text-white/40 mt-1 flex items-center gap-1">
                  <Film className="h-3 w-3" />
                  {a.count} video recenti
                </p>
              )}
              {a.dominantCategory && (
                <span className="mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#00f2ff]/10 text-[#00f2ff]">
                  {a.dominantCategory}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
