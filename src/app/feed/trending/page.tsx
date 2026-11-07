/** @format */

import Link from "next/link";
import { fetchVideosExplore, fetchVideoCategories, fetchSiteStats, type BazzibaVideo, type WpTerm } from "@/data/wp";
import { VideoGrid } from "@/components/video/video-card";
import { Shuffle, Clock, SortAsc, Type, LayoutGrid, List } from "lucide-react";

export const revalidate = 300;

const SORTS = [
  { id: "recenti", label: "Recenti", icon: Clock, orderby: "date", order: "desc" },
  { id: "meno-recenti", label: "Meno recenti", icon: SortAsc, orderby: "date", order: "asc" },
  { id: "az", label: "Titolo A–Z", icon: Type, orderby: "title", order: "asc" },
  { id: "random", label: "Casuale", icon: Shuffle, orderby: null, order: null },
] as const;

const DURATIONS = [
  { id: "tutte", label: "Qualsiasi durata" },
  { id: "corti", label: "< 2 min" },
  { id: "medi", label: "2–5 min" },
  { id: "lunghi", label: "> 5 min" },
] as const;

function matchesDuration(v: BazzibaVideo, dur: string): boolean {
  if (dur === "tutte") return true;
  if (v.durationSec == null) return false;
  if (dur === "corti") return v.durationSec < 120;
  if (dur === "medi") return v.durationSec >= 120 && v.durationSec <= 300;
  if (dur === "lunghi") return v.durationSec > 300;
  return true;
}

function buildHref(base: string, params: Record<string, string | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
  const qs = sp.toString();
  return qs ? `${base}?${qs}` : base;
}

export default async function TrendingPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; sort?: string; dur?: string; hd?: string; view?: string }>;
}) {
  const sp = await searchParams;
  const [categories, stats] = await Promise.all([
    fetchVideoCategories().catch(() => []),
    fetchSiteStats().catch(() => ({ videos: 0, artists: 0, comments: 0 })),
  ]);

  const activeSort = SORTS.find((s) => s.id === sp.sort) ?? SORTS[0];
  const activeCat = sp.cat ?? "";
  const activeDur = DURATIONS.some((d) => d.id === sp.dur) ? (sp.dur as string) : "tutte";
  const hdOnly = sp.hd === "1";
  const view = sp.view === "list" ? "list" : "grid";
  const category = categories.find((c) => c.slug === activeCat) ?? null;

  // Random: pull a random catalog page (WP has no orderby=rand on this install)
  let videos: BazzibaVideo[] = [];
  if (activeSort.id === "random") {
    const totalPages = Math.max(1, Math.min(30, Math.ceil((stats.videos || 100) / 24)));
    const randomPage = 1 + Math.floor(Math.random() * totalPages);
    videos = await fetchVideosExplore({ categoryId: category?.id, perPage: 24, page: randomPage, orderby: "date" }).catch(() => []);
  } else {
    videos = await fetchVideosExplore({
      categoryId: category?.id,
      orderby: activeSort.orderby ?? "date",
      order: activeSort.order ?? "desc",
      perPage: 24,
    }).catch(() => []);
  }

  // Post-refinements on real metadata (duration + resolution from media_details)
  if (activeDur !== "tutte") videos = videos.filter((v) => matchesDuration(v, activeDur));
  if (hdOnly) videos = videos.filter((v) => v.resolution === "1080p" || v.resolution === "4K" || v.resolution === "720p");

  const hrefFor = (patch: Record<string, string | undefined>) =>
    buildHref("/feed/trending", { cat: activeCat || undefined, sort: activeSort.id, dur: activeDur !== "tutte" ? activeDur : undefined, hd: hdOnly ? "1" : undefined, view, ...patch });

  return (
    <div className="min-h-screen bg-[#050a14] text-white">
      {/* Sticky filter bar */}
      <div className="sticky top-[64px] z-[var(--z-docked)] bg-[#050a14]/90 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 space-y-2.5">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide -mx-4 px-4 [mask-image:linear-gradient(to_right,black_92%,transparent)]">
            <span className="text-[11px] uppercase tracking-widest text-white/30 flex-shrink-0 mr-1">Categoria</span>
            <Link
              href={hrefFor({ cat: undefined })}
              className={`whitespace-nowrap px-3 py-1.5 text-xs rounded-full border transition-colors ${
                !activeCat ? "bg-[#00f2ff] text-black font-bold border-[#00f2ff]" : "bg-white/5 text-white/60 border-white/10 hover:border-[#00f2ff]/40"
              }`}
            >
              Tutte
            </Link>
            {categories.map((c: WpTerm) => (
              <Link
                key={c.id}
                href={hrefFor({ cat: c.slug })}
                className={`whitespace-nowrap px-3 py-1.5 text-xs rounded-full border transition-colors ${
                  activeCat === c.slug ? "bg-[#00f2ff] text-black font-bold border-[#00f2ff]" : "bg-white/5 text-white/60 border-white/10 hover:border-[#00f2ff]/40"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>

          {/* Sort + duration + HD + view */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-0.5 [mask-image:linear-gradient(to_right,black_92%,transparent)]">
            <span className="text-[11px] uppercase tracking-widest text-white/30 flex-shrink-0 mr-1">Ordina</span>
            {SORTS.map((s) => (
              <Link
                key={s.id}
                href={hrefFor({ sort: s.id })}
                className={`whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border transition-colors ${
                  activeSort.id === s.id ? "bg-white/15 text-white font-semibold border-white/25" : "bg-white/5 text-white/50 border-white/10 hover:border-white/25"
                }`}
              >
                <s.icon className="h-3.5 w-3.5" />
                {s.label}
              </Link>
            ))}
            <span className="w-px h-5 bg-white/10 mx-1 flex-shrink-0" />
            {DURATIONS.map((d) => (
              <Link
                key={d.id}
                href={hrefFor({ dur: d.id === "tutte" ? undefined : d.id })}
                className={`whitespace-nowrap px-3 py-1.5 text-xs rounded-full border transition-colors ${
                  activeDur === d.id ? "bg-white/15 text-white font-semibold border-white/25" : "bg-white/5 text-white/50 border-white/10 hover:border-white/25"
                }`}
              >
                {d.label}
              </Link>
            ))}
            <span className="w-px h-5 bg-white/10 mx-1 flex-shrink-0" />
            <Link
              href={hrefFor({ hd: hdOnly ? undefined : "1" })}
              className={`whitespace-nowrap px-3 py-1.5 text-xs rounded-full border transition-colors ${
                hdOnly ? "bg-[#00f2ff]/20 text-[#00f2ff] font-semibold border-[#00f2ff]/40" : "bg-white/5 text-white/50 border-white/10 hover:border-white/25"
              }`}
            >
              Solo HD
            </Link>
            <span className="flex-1" />
            <div className="flex border border-white/10 rounded-full overflow-hidden flex-shrink-0">
              <Link href={hrefFor({ view: undefined })} aria-label="Vista griglia"
                className={`px-2.5 py-1.5 ${view === "grid" ? "bg-white/15 text-white" : "text-white/40"}`}>
                <LayoutGrid className="h-3.5 w-3.5" />
              </Link>
              <Link href={hrefFor({ view: "list" })} aria-label="Vista lista"
                className={`px-2.5 py-1.5 ${view === "list" ? "bg-white/15 text-white" : "text-white/40"}`}>
                <List className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff]" />
            {activeSort.id === "random" ? "Scopri a caso" : "In Evidenza & Esplora"}
            <span className="text-sm font-normal text-white/30">
              {videos.length} video{category ? ` in ${category.name}` : ""}
            </span>
          </h1>
        </div>

        {videos.length === 0 ? (
          <p className="text-center py-20 text-white/40">
            Nessun video con questi filtri — prova ad allargare la ricerca.
          </p>
        ) : view === "grid" ? (
          <VideoGrid videos={videos} showAuthor />
        ) : (
          <div className="space-y-3">
            {videos.map((v) => (
              <Link key={v.id} href={`/watch/${v.id}`} className="group flex gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#00f2ff]/30 transition-colors">
                <div className="relative w-40 sm:w-56 aspect-video rounded-lg overflow-hidden bg-black flex-shrink-0">
                  {v.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-white/20 text-xs">N/A</div>
                  )}
                  {v.durationSec && (
                    <span className="absolute bottom-1.5 right-1.5 bg-black/75 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                      {Math.floor(v.durationSec / 60)}:{String(v.durationSec % 60).padStart(2, "0")}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm sm:text-base line-clamp-2 group-hover:text-[#00f2ff] transition-colors">{v.title}</h3>
                  <p className="text-xs text-white/40 mt-1">{v.authorName}</p>
                  <p className="text-xs text-white/50 mt-2 line-clamp-2 hidden sm:block">{v.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {v.categorySlug && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[#00f2ff]/10 text-[#00f2ff]">{v.category}</span>
                    )}
                    {v.resolution && <span className="text-[10px] font-mono text-white/30">{v.resolution}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
