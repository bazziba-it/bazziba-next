"use client";

import Link from "next/link";
import {
  Play,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  fetchBazzibaVideos,
  fetchVideoCategories,
  fetchLatestPosts,
  type BazzibaVideo,
  type WpTerm,
  type WpPost,
} from "@/data/wp";
import { RealAvatar, ThumbPlaceholder } from "@/components/ui/media";

/* =====================================================
   StreamTube boxed/home-1 — exact clone (client UI)
   Now 100% real bazziba.it data via the shared wp layer.
   ===================================================== */

function formatDateIT(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("it-IT", { day: "numeric", month: "short" });
  } catch {
    return "";
  }
}

/* ---- Eye Catching Slider — real videos, real category/author meta ---- */
function EyeCatchingSlider({ videos }: { videos: BazzibaVideo[] }) {
  const slider = videos.slice(0, 5);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (slider.length < 2) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slider.length);
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
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
          {slider.map((s) => (
            <div key={s.id} className="w-full flex-shrink-0 relative">
              <div className="w-full h-[420px] relative bg-[#1a1d26]">
                {s.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.thumbnail} alt={s.title} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <ThumbPlaceholder title={s.title} className="absolute inset-0" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/90 via-[#121212]/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-xl font-['Montserrat'] font-bold mb-1 line-clamp-1">{s.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-[#abb8c3]">
                    <span>{s.authorName}</span>
                    {s.categorySlug && (
                      <span className="bg-[#9b51e0]/20 text-[#9b51e0] px-2 rounded-full">{s.category}</span>
                    )}
                    <span className="text-[#747775]">{formatDateIT(s.date)}</span>
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
function BoxedVideoCard({ v, index }: { v: BazzibaVideo; index: number }) {
  return (
    <Link
      href={`/watch/${v.id}`}
      className="relative flex flex-col group rounded-lg overflow-hidden bg-[#161823] border border-[#32373c] hover:border-[#00d084]/40 transition-all duration-200"
    >
      <div className="relative aspect-video w-full bg-[#1a1d26] overflow-hidden">
        {v.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={v.thumbnail}
            alt={v.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <ThumbPlaceholder title={v.title} className="w-full h-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
        {v.categorySlug && (
          <div className="absolute bottom-2 left-2 text-xs bg-[#9b51e0]/90 text-white px-1.5 py-0.5 rounded font-medium">
            {v.category}
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-14 h-14 rounded-full bg-[#00d084] flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-200">
            <Play size={28} fill="currentColor" className="text-[#121212]" />
          </div>
        </div>
        {v.tags.includes("in-evidenza") && (
          <div className="absolute top-2 right-2 bg-[#00d084] text-[#121212] text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#121212]" />
            TOP
          </div>
        )}
      </div>
      <div className="p-2.5 flex flex-col gap-1 flex-1">
        <h4 className="text-white text-sm font-['Roboto'] font-medium line-clamp-2 leading-tight group-hover:text-[#00d084] transition-colors">
          {v.title}
        </h4>
        <div className="flex items-center gap-1.5 mt-auto">
          <RealAvatar
            src={v.authorAvatar}
            name={v.authorName}
            className="w-7 h-7 rounded-full border border-[#32373c] bg-[#1a1d26] text-[9px]"
          />
          <span className="text-[#747775] text-xs font-['Roboto'] truncate">{v.authorName}</span>
        </div>
      </div>
    </Link>
  );
}

/* ---- VideoRow with real category pills ---- */
function VideoRow({ title, videos, categories }: { title: string; videos: BazzibaVideo[]; categories: WpTerm[] }) {
  const [filter, setFilter] = useState("tutti");
  const filtered = filter === "tutti" ? videos : videos.filter((v) => v.categorySlug === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-white font-['Montserrat'] font-bold text-lg">{title}</h3>
        <Link href="/feed" className="text-[#747775] text-xs hover:text-[#00d084] transition-colors flex items-center gap-1">
          Carica Altri
          <ArrowRight size={12} />
        </Link>
      </div>

      <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setFilter("tutti")}
          className={`whitespace-nowrap px-3 py-1 text-xs rounded-full transition-all duration-200 font-medium ${
            filter === "tutti" ? "bg-[#00d084] text-[#121212] font-bold" : "bg-[#1a1d26] text-[#abb8c3] hover:bg-[#252a38] cursor-pointer"
          }`}
        >
          Tutti
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.slug)}
            className={`whitespace-nowrap px-3 py-1 text-xs rounded-full transition-all duration-200 font-medium ${
              filter === c.slug ? "bg-[#00d084] text-[#121212] font-bold" : "bg-[#1a1d26] text-[#abb8c3] hover:bg-[#252a38] cursor-pointer"
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
            <BoxedVideoCard key={v.id} v={v} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- SidebarCategories — real taxonomy ---- */
function SidebarCategories({ categories }: { categories: WpTerm[] }) {
  return (
    <div className="w-[220px] flex-shrink-0">
      <div className="sticky top-[80px] bg-[#161823] rounded-lg border border-[#32373c] p-3">
        <h4 className="text-[#747775] text-xs font-['Roboto'] uppercase tracking-wider mb-2">Categorie</h4>
        <nav className="flex flex-col gap-0.5">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/c/${c.slug}`}
              className="flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors hover:bg-[#0a0e1a] hover:text-[#00d084] group"
            >
              <span className="w-2 h-2 rounded-full bg-[#00d084]/50" />
              <span className="text-[#abb8c3] group-hover:text-white transition-colors">{c.name}</span>
              <span className="ml-auto text-[10px] text-[#747775]">{c.count}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

/* ---- HandPickedSection — real editorial tag "in-evidenza" ---- */
function HandPickedSection({ videos }: { videos: BazzibaVideo[] }) {
  const picks = videos.filter((v) => v.tags.includes("in-evidenza")).slice(0, 4);
  if (picks.length === 0) return null;

  return (
    <section className="my-3 px-4">
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-white font-['Montserrat'] font-bold text-lg">Hand Picked</h3>
        <Link href="/feed/trending" className="text-[#747775] text-xs hover:text-[#00d084] transition-colors flex items-center gap-1">
          Carica Altri
          <ArrowRight size={12} />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {picks.map((v, i) => (
          <BoxedVideoCard key={v.id} v={v} index={i + 3} />
        ))}
      </div>
    </section>
  );
}

/* ---- LatestPostsSection — real WP blog posts ---- */
function LatestPostsSection({ posts }: { posts: WpPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="my-3 px-4">
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-white font-['Montserrat'] font-bold text-lg">Latest Posts</h3>
        <a
          href="https://bazziba.it/blog/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#747775] text-xs hover:text-[#00d084] transition-colors flex items-center gap-1"
        >
          Carica Altri
          <ArrowRight size={12} />
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {posts.map((p) => (
          <a
            key={p.id}
            href={`https://bazziba.it/${p.slug}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#161823] border border-[#32373c] rounded-lg p-3 cursor-pointer hover:border-[#00d084]/40 transition-all group block"
          >
            <h5 className="text-white text-sm font-['Roboto'] font-medium line-clamp-2 mb-2 group-hover:text-[#00d084] transition-colors">
              {p.title}
            </h5>
            <p className="text-[#747775] text-xs line-clamp-2 mb-2">{p.excerpt}</p>
            <div className="flex items-center justify-end text-xs text-[#747775]">
              <span>{formatDateIT(p.date)}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ---- AboutSection — static site copy (real links) ---- */
function AboutSection() {
  return (
    <section className="my-3 px-4">
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-white font-['Montserrat'] font-bold text-lg">About / Info</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { href: "/feed/trending", icon: <Eye size={20} className="text-[#00d084]" />, title: "In Evidenza", desc: "I video scelti dalla redazione" },
          { href: "/contest", icon: <Heart size={20} className="text-[#9b51e0]" />, title: "Contest", desc: "Vota i video del contest mensile" },
          { href: "/feed", icon: <Play size={20} className="text-[#0693e3]" />, title: "Ultimi video", desc: "Le ultime pubblicazioni della community" },
        ].map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="bg-[#161823] border border-[#32373c] rounded-lg p-4 text-center hover:border-[#00d084]/40 transition-all group cursor-pointer block"
          >
            <div className="flex justify-center mb-2">{item.icon}</div>
            <h5 className="text-white font-['Montserrat'] font-bold text-base mb-1 group-hover:text-[#00d084] transition-colors">{item.title}</h5>
            <p className="text-[#747775] text-xs">{item.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ---- Main Client Page ---- */
export default function BoxedHome1Client() {
  const [videos, setVideos] = useState<BazzibaVideo[]>([]);
  const [categories, setCategories] = useState<WpTerm[]>([]);
  const [posts, setPosts] = useState<WpPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetchBazzibaVideos(50).catch(() => []),
      fetchVideoCategories().catch(() => []),
      fetchLatestPosts(3).catch(() => []),
    ])
      .then(([v, c, p]) => {
        if (!cancelled) {
          setVideos(v);
          setCategories(c);
          setPosts(p);
          setLoading(false);
        }
      })
      .catch(() => {
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

  if (videos.length === 0) {
    return (
      <div className="min-h-screen bg-[#161823] flex flex-col items-center justify-center">
        <p className="text-[#747775] text-sm font-['Roboto']">bazziba.it non risponde — riprova più tardi.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161823] flex flex-col">
      <div className="w-full max-w-[1240px] mx-auto flex-1 flex flex-col px-0">
        <EyeCatchingSlider videos={videos} />
        <div className="mt-4 flex gap-4 px-4 pb-4 flex-1">
          <SidebarCategories categories={categories} />
          <div className="flex-1 min-w-0">
            <VideoRow title="Latest Videos" videos={videos} categories={categories} />
          </div>
        </div>
        <HandPickedSection videos={videos} />
        <LatestPostsSection posts={posts} />
        <AboutSection />
      </div>
    </div>
  );
}
