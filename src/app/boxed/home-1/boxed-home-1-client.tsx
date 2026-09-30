"use client";

import Link from "next/link";
import {
  Play,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Share2,
  Clock,
  ThumbsUp,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

/* =====================================================
   StreamTube boxed/home-1 — exact clone (client UI)
   Colors: dark #161823 bg, #00d084 green accent, #0693e3 blue
   #9b51e0 purple, #fcb900 gold, #cf2e2e red, #32373c border
   Typography: Montserrat headings, Roboto body
   Layout: 8 sections matching StreamTube boxed/home-1 screenshot
   ===================================================== */

/* ---- WP data layer (inlined for client bundle) ---- */
const WP_BASE = "https://bazziba.it/wp-json/wp/v2";

async function wpFetch(path: string, params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = `${WP_BASE}${path}${qs ? "?" + qs : ""}`;
  const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`WP ${res.status}: ${path}`);
  return res.json();
}

const SEED = 42;
function seededRand(max: number): number {
  const x = Math.sin(SEED + max) * 10000;
  return x - Math.floor(x);
}

function seededSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function formatViews(n: string | number): string {
  const v = typeof n === "number" ? n : parseInt(n, 10);
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (v >= 1_000) return (v / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(v);
}

function formatLikes(n: string | number): string {
  const v = typeof n === "number" ? n : parseInt(n, 10);
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (v >= 1_000) return (v / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(v);
}

function durationStr(secs: number): string {
  if (!secs || secs <= 0) return "2:27";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getAvatarUrl(authorId: number | null, avatarUrls: Record<string, string> | undefined): string {
  if (authorId && avatarUrls && avatarUrls["96"]) return avatarUrls["96"] as string;
  if (authorId) {
    const seed = seededSeed(String(authorId));
    return `https://ui-avatars.com/api/?name=user${authorId}&size=96&background=random&color=fff`;
  }
  return "https://bazziba.it/wp-content/uploads/2026/06/default-avatar.png";
}

function mapWpVideo(wp: any, mediaMap: Map<number, string>): any {
  const title = (wp.title?.rendered || "Video").replace(/<[^>]+>/g, "").trim();
  const slug = wp.slug || title.toLowerCase().replace(/\s+/g, "-");
  const authorData = wp._embedded?.author?.[0] || wp.author_data || null;
  const authorName = authorData?.name || "Bazziba";
  const authorAvatar = getAvatarUrl(wp.author, authorData?.avatar_urls);
  const cat = wp.categories?.[0];
  let category = cat ? cat.name : "Viral Videos";
  let categorySlug = cat ? cat.slug : "viral-videos";

  let thumbnail = "";
  if (wp.featuredMedia) {
    const mediaUrl = mediaMap.get(Number(wp.featuredMedia));
    if (mediaUrl) {
      thumbnail = mediaUrl;
    } else if (wp._embedded?.["wp:featuredmedia"]?.[0]) {
      const m = wp._embedded["wp:featuredmedia"][0];
      thumbnail = m.source_url || m.guid || "";
    } else {
      thumbnail = `https://picsum.photos/seed/${slug}/400/225`;
    }
  } else {
    thumbnail = `https://picsum.photos/seed/${slug}/400/225`;
  }

  return {
    id: String(wp.id),
    slug,
    title,
    thumbnail,
    authorName,
    authorAvatar,
    category,
    categorySlug,
    viewCount: String(wp.meta?.views || seededRand(150000) + 12000),
    likes: String(wp.meta?.likes || seededRand(8000) + 400),
    duration: Number(wp.meta?.duration) || seededRand(1200) + 120,
    videoUrl: wp.link || "",
  };
}

async function fetchBazzibaVideos(): Promise<any[]> {
  const videos = await wpFetch("/video", {
    per_page: "50",
    _embed: "true",
    status: "publish",
    order: "desc",
  });

  return videos.map((v) => mapWpVideo(v, new Map()));
}

/* ---- types ---- */
interface BazzibaVideo {
  id: string;
  slug: string;
  title: string;
  thumbnail: string;
  authorName: string;
  authorAvatar: string;
  category: string;
  categorySlug: string;
  viewCount: string;
  likes: string;
  duration: number;
  videoUrl?: string;
}

const CATEGORIES = [
  { name: "Tutti", slug: "tutti" },
  { name: "Cantanti", slug: "cantanti" },
  { name: "Cinema", slug: "cinema" },
  { name: "Pittori", slug: "pittori" },
  { name: "Danzatori", slug: "danzatori" },
  { name: "Musicisti", slug: "musicisti" },
  { name: "Community", slug: "community" },
  { name: "Video Virali", slug: "viral-videos" },
];

/* ---- components ---- */

/* ---- Header ---- */
function Header() {
  return (
    <div className="sticky top-0 z-50 bg-[#121212] border-b border-[#32373c]">
      <div className="max-w-[1240px] mx-auto flex items-center justify-between px-4 h-[64px]">
        <Link href="/boxed/home-1" className="flex items-center gap-2">
          <span className="text-3xl font-bold text-[#00d084]">BAZZIBA!</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Cerca video..."
              className="bg-[#1a1d26] text-[#abb8c3] text-sm px-3 py-1.5 rounded-lg w-[200px] border border-[#32373c] focus:outline-none focus:border-[#00d084]/50 placeholder:text-[#747775]"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#747775] text-xs">/</span>
          </div>
          <Link
            href="/boxed/home-1"
            className="bg-[#00d084] text-[#121212] px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-[#00e694] transition-colors"
          >
            Carica
          </Link>
          <Link
            href="/auth/signin"
            className="bg-[#1a1d26] text-[#abb8c3] px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-[#252a38] transition-colors"
          >
            ACCEDI
          </Link>
          <Link
            href="/auth/signup"
            className="bg-[#00d084] text-[#121212] px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-[#00e694] transition-colors"
          >
            REGISTRATI
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---- Eye Catching Slider ---- */
function EyeCatchingSlider({ videos }: { videos: BazzibaVideo[] }) {
  const slider = videos.length > 0 ? videos.slice(0, 5).map((v) => ({
    id: v.id,
    title: v.title,
    thumbnail: v.thumbnail,
    views: v.viewCount || "0",
    duration: v.duration || 0,
    likes: v.likes || "0",
    authorName: v.authorName || "Bazziba",
  })) : [];

  const [current, setCurrent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slider.length);
    }, 6000);
    return () => clearInterval(timerRef.current);
  }, [slider.length]);

  if (slider.length === 0) return null;

  return (
    <section className="my-3 px-4">
      <div className="flex items-center gap-2 mb-2">
        <Eye size={14} className="text-[#747775]" />
        <span className="text-[#747775] text-xs font-['Roboto'] tracking-wider uppercase">
          Eye Catching Slider
        </span>
      </div>
      <div className="relative rounded-xl overflow-hidden bg-[#121212] border border-[#32373c]">
        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
          {slider.map((s, i) => (
            <div key={s.id} className="w-full flex-shrink-0 relative">
              <div
                className="w-full h-[420px] relative bg-[#1a1d26]"
                style={{
                  backgroundImage: `url(${s.thumbnail})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/90 via-[#121212]/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-xl font-['Montserrat'] font-bold mb-1 line-clamp-1">{s.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-[#abb8c3]">
                    <span>👁 {s.views}</span>
                    <div className="flex items-center gap-1 bg-[#9b51e0]/20 text-[#9b51e0] px-2 rounded-full">
                      <Heart size={12} />
                      <span>{s.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-[#32373c] text-[#abb8c3] px-2 rounded-full">
                      <Clock size={12} />
                      <span>{durationStr(s.duration)}</span>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/watch/${s.id}`}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 group"
                >
                  <div className="w-16 h-16 rounded-full bg-[#00d084] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <Play size={24} fill="currentColor" className="text-[#121212]" />
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setCurrent((prev) => (prev - 1 + slider.length) % slider.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % slider.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
        <div className="absolute bottom-3 right-3 flex gap-1.5">
          {slider.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-white w-4" : "bg-white/40"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- VideoCard ---- */
function VideoCard({ v, index }: { v: BazzibaVideo; index: number }) {
  return (
    <Link
      href={`/watch/${v.id}`}
      className="relative flex flex-col group rounded-lg overflow-hidden bg-[#161823] border border-[#32373c] hover:border-[#00d084]/40 transition-all duration-200"
    >
      <div className="relative aspect-video w-full bg-[#1a1d26] overflow-hidden">
        <img
          src={v.thumbnail}
          alt={v.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${v.slug}/400/225`; }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
        <div className="absolute bottom-2 left-2 text-xs bg-[#9b51e0]/90 text-white px-1.5 py-0.5 rounded font-medium">
          {durationStr(v.duration)}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-14 h-14 rounded-full bg-[#00d084] flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-200">
            <Play size={28} fill="currentColor" className="text-[#121212]" />
          </div>
        </div>
        {index < 3 && (
          <div className="absolute top-2 right-2 bg-[#00d084] text-[#121212] text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#121212]" />
            LIVE
          </div>
        )}
      </div>
      <div className="p-2.5 flex flex-col gap-1 flex-1">
        <h4 className="text-white text-sm font-['Roboto'] font-medium line-clamp-2 leading-tight group-hover:text-[#00d084] transition-colors">
          {v.title}
        </h4>
        <div className="flex items-center gap-1.5 mt-auto">
          <img
            src={v.authorAvatar}
            alt={v.authorName}
            className="w-7 h-7 rounded-full object-cover border border-[#32373c] bg-[#1a1d26]"
            onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${v.authorName}&background=random&size=96`; }}
          />
          <span className="text-[#747775] text-xs font-['Roboto'] truncate">{v.authorName}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#747775]">
          <Eye size={12} className="text-[#747775]" />
          <span>{v.viewCount}</span>
          <div className="flex items-center gap-0.5 text-[#9b51e0]">
            <Heart size={12} fill="currentColor" />
            <span>{v.likes}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ---- VideoRow ---- */
function VideoRow({ title, videos }: { title: string; videos: BazzibaVideo[] }) {
  const [filter, setFilter] = useState("tutti");
  const filtered = filter === "tutti"
    ? videos
    : videos.filter((v) => v.categorySlug === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-white font-['Montserrat'] font-bold text-lg">{title}</h3>
        <Link
          href="/feed"
          className="text-[#747775] text-xs hover:text-[#00d084] transition-colors flex items-center gap-1"
        >
          Carica Altri
          <ArrowRight size={12} />
        </Link>
      </div>

      {/* Category filter pills */}
      <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map((c) => (
          <button
            key={c.slug}
            onClick={() => setFilter(c.slug)}
            className={`whitespace-nowrap px-3 py-1 text-xs rounded-full transition-all duration-200 font-medium ${
              filter === c.slug
                ? "bg-[#00d084] text-[#121212] font-bold"
                : "bg-[#1a1d26] text-[#abb8c3] hover:bg-[#252a38] cursor-pointer"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-8 text-[#747775]">
          <p className="text-lg mb-1">Nessun video trovato</p>
          <p className="text-xs">Prova a cambiare categoria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((v, i) => (
            <VideoCard key={v.id} v={v} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- SidebarCategories ---- */
function SidebarCategories() {
  return (
    <div className="w-[220px] flex-shrink-0">
      <div className="sticky top-[80px] bg-[#161823] rounded-lg border border-[#32373c] p-3">
        <h4 className="text-[#747775] text-xs font-['Roboto'] uppercase tracking-wider mb-2">Categorie</h4>
        <nav className="flex flex-col gap-0.5">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/c/${c.slug}`}
              className="flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors hover:bg-[#0a0e1a] hover:text-[#00d084] group"
            >
              <span className={`w-2 h-2 rounded-full ${c.slug === "tutti" ? "bg-[#00d084]" : c.slug === "cantanti" ? "bg-[#0693e3]" : c.slug === "cinema" ? "bg-[#9b51e0]" : c.slug === "pittori" ? "bg-[#fcb900]" : c.slug === "danzatori" ? "bg-[#cf2e2e]" : c.slug === "musicisti" ? "bg-[#00d084]" : "bg-[#32373c]"}`} />
              <span className="text-[#abb8c3] group-hover:text-white transition-colors">{c.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

/* ---- HandPickedSection ---- */
function HandPickedSection({ videos }: { videos: BazzibaVideo[] }) {
  const picks = videos.length > 0 ? videos.slice(2, 7).slice(0, 4) : [];
  if (picks.length === 0) return null;

  return (
    <section className="my-3 px-4">
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-white font-['Montserrat'] font-bold text-lg">Hand Picked</h3>
        <Link
          href="/feed"
          className="text-[#747775] text-xs hover:text-[#00d084] transition-colors flex items-center gap-1"
        >
          Carica Altri
          <ArrowRight size={12} />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {picks.map((v, i) => (
          <VideoCard key={v.id} v={v} index={i + 3} />
        ))}
      </div>
    </section>
  );
}

/* ---- LatestPostsSection (blog posts) ---- */
function LatestPostsSection() {
  const POSTS = [
    { title: "Nuovo video: Il ritorno dei grandi", excerpt: "Scopri i backstage della produzione", author: "Admin", date: "2 ore fa" },
    { title: "ECM 2026: le novità per i video", excerpt: "Tutto ciò che devi sapere sui nuovi formati", author: "Editor", date: "5 ore fa" },
    { title: "L'arte nel video digitale", excerpt: "Come le nuove tecnologie stanno cambiando il modo di creare", author: "Artista", date: "1 giorno fa" },
  ];

  return (
    <section className="my-3 px-4">
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-white font-['Montserrat'] font-bold text-lg">Latest Posts</h3>
        <Link
          href="/blog"
          className="text-[#747775] text-xs hover:text-[#00d084] transition-colors flex items-center gap-1"
        >
          Carica Altri
          <ArrowRight size={12} />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {POSTS.map((p, i) => (
          <div
            key={i}
            className="bg-[#161823] border border-[#32373c] rounded-lg p-3 cursor-pointer hover:border-[#00d084]/40 transition-all group"
          >
            <h5 className="text-white text-sm font-['Roboto'] font-medium line-clamp-2 mb-2 group-hover:text-[#00d084] transition-colors">
              {p.title}
            </h5>
            <p className="text-[#747775] text-xs line-clamp-2 mb-2">{p.excerpt}</p>
            <div className="flex items-center justify-between text-xs text-[#747775]">
              <span>✍️ {p.author}</span>
              <span>🕐 {p.date}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---- TrendingSection ---- */
function TrendingSection({ videos }: { videos: BazzibaVideo[] }) {
  const trending = videos.length > 0 ? [...videos].sort((a, b) => {
    const viewsA = parseInt(a.viewCount, 10) || 0;
    const viewsB = parseInt(b.viewCount, 10) || 0;
    return viewsB - viewsA;
  }).slice(0, 8) : [];

  if (trending.length === 0) return null;

  return (
    <section className="my-3 px-4">
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-white font-['Montserrat'] font-bold text-lg">Trending</h3>
        <Link
          href="/feed"
          className="text-[#747775] text-xs hover:text-[#00d084] transition-colors flex items-center gap-1"
        >
          Carica Altri
          <ArrowRight size={12} />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {trending.map((v, i) => (
          <div
            key={v.id}
            className="flex gap-2 items-start bg-[#161823] border border-[#32373c] rounded-lg p-2 hover:border-[#00d084]/40 transition-all group"
          >
            <span className="text-[#fcb900] text-xl font-['Montserrat'] font-bold text-center leading-none">{i + 1}.</span>
            <div className="flex-1 min-w-0">
              <div className="aspect-video w-full rounded overflow-hidden bg-[#1a1d26] mb-1.5 relative">
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${v.slug}/400/225`; }}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#00d084] flex items-center justify-center">
                    <Play size={20} fill="currentColor" className="text-[#121212]" />
                  </div>
                </div>
              </div>
              <h6 className="text-white text-xs font-['Roboto'] font-medium line-clamp-2 group-hover:text-[#00d084] transition-colors">
                {v.title}
              </h6>
              <div className="flex items-center gap-1 text-xs text-[#747775]">
                <Eye size={10} />
                <span>{v.viewCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---- AboutSection ---- */
function AboutSection() {
  return (
    <section className="my-3 px-4">
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-white font-['Montserrat'] font-bold text-lg">About / Info</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { icon: <Eye size={20} className="text-[#00d084]" />, title: "Trending", desc: "I video più popolari della settimana", color: "bg-[#00d084]/10 text-[#00d084]" },
          { icon: <Heart size={20} className="text-[#9b51e0]" />, title: "Community", desc: "Contenuti dai nostri creatori", color: "bg-[#9b51e0]/10 text-[#9b51e0]" },
          { icon: <Play size={20} className="text-[#0693e3]" />, title: "Livestream", desc: "Guarda i live streaming in diretta", color: "bg-[#0693e3]/10 text-[#0693e3]" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-[#161823] border border-[#32373c] rounded-lg p-4 text-center hover:border-[#00d084]/40 transition-all group cursor-pointer"
          >
            <div className="flex justify-center mb-2">{item.icon}</div>
            <h5 className="text-white font-['Montserrat'] font-bold text-base mb-1 group-hover:text-[#00d084] transition-colors">{item.title}</h5>
            <p className="text-[#747775] text-xs">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---- Footer ---- */
function Footer() {
  return (
    <footer className="bg-[#121212] border-t border-[#32373c] mt-4">
      <div className="max-w-[1240px] mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-[#00d084]">BAZZIBA!</span>
            <span className="text-[#747775] text-sm">© 2026</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#747775]">
            <Link href="/" className="hover:text-[#00d084] transition-colors">Home</Link>
            <Link href="/feed" className="hover:text-[#00d084] transition-colors">Video</Link>
            <Link href="/c/tutti" className="hover:text-[#00d084] transition-colors">Categorie</Link>
            <Link href="/u/admin" className="hover:text-[#00d084] transition-colors">Utenti</Link>
          </div>
          <div className="flex items-center gap-2">
            {[
              { href: "https://facebook.com/bazziba", icon: "f", label: "Facebook" },
              { href: "https://instagram.com/bazziba", icon: "📷", label: "Instagram" },
              { href: "https://twitter.com/bazziba", icon: "𝕏", label: "X" },
              { href: "https://youtube.com/bazziba", icon: "▶", label: "YouTube" },
              { href: "https://wa.me/3900000000", icon: "💬", label: "WhatsApp" },
            ].map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#1a1d26] border border-[#32373c] flex items-center justify-center text-[#747775] hover:border-[#00d084]/50 hover:text-[#00d084] transition-all text-xs" title={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---- Main Client Page ---- */
export default function BoxedHome1Client() {
  const [videos, setVideos] = useState<BazzibaVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchBazzibaVideos()
      .then((v) => { if (!cancelled) { setVideos(v); setLoading(false); } })
      .catch((e) => {
        console.warn("WP fetch failed:", e);
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#161823] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#32373c] border-t-[#00d084]" />
        <p className="mt-3 text-[#747775] text-xs font-['Roboto']">Caricamento...</p>
      </div>
    );
  }

  const shuffled = videos.length > 0 ? [...videos].sort(() => Math.random() - 0.5) : videos;

  return (
    <div className="min-h-screen bg-[#161823] flex flex-col">
      <div className="w-full max-w-[1240px] mx-auto flex-1 flex flex-col px-0">
        <Header />
        <EyeCatchingSlider videos={shuffled} />
        <div className="mt-4 flex gap-4 px-4 pb-4 flex-1">
          <SidebarCategories />
          <div className="flex-1 min-w-0">
            <VideoRow title="Latest Videos" videos={shuffled} />
          </div>
        </div>
        <HandPickedSection videos={shuffled} />
        <LatestPostsSection />
        <TrendingSection videos={shuffled} />
        <AboutSection />
        <Footer />
      </div>
    </div>
  );
}
