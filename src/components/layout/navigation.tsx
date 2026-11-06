"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { GlassNav } from "@/components/ui";
import { MOTION } from "@/components/ui/glass";

const brandMark = (
  <svg width="32" height="32" viewBox="0 0 100 32" fill="none">
    <rect width="100" height="32" rx="6" fill="#00f2ff"/>
    <rect x="10" y="6" width="8" height="20" rx="2" fill="#050a14"/>
    <rect x="22" y="10" width="6" height="12" rx="2" fill="#050a14"/>
    <rect x="32" y="4" width="8" height="24" rx="2" fill="#050a14"/>
    <rect x="44" y="8" width="6" height="16" rx="2" fill="#050a14"/>
    <rect x="54" y="2" width="8" height="28" rx="2" fill="#050a14"/>
    <rect x="66" y="12" width="6" height="8" rx="2" fill="#050a14"/>
    <rect x="76" y="14" width="6" height="4" rx="1" fill="#050a14"/>
    <rect x="86" y="8" width="8" height="16" rx="2" fill="#050a14"/>
  </svg>
);

const pillIcons: Record<string, React.ReactNode> = {
  tutti: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  cantanti: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  cinema: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20"/><path d="M17 2v20"/><path d="M2 12h20"/></svg>,
  pittori: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L18 13z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>,
  danzatori: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="4" r="2"/><path d="M12 6v6l-2 4h4l-2-4V6z"/><path d="M8 14c0 3.314 2.686 6 6 6s6-2.686 6-6"/></svg>,
  musicisti: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  community: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
};

/** Real video_category slugs (ADR-0003 — no fabricated categories). */
const pills: [string, string][] = [
  ["cantanti", "Cantanti"],
  ["musicisti", "Musicisti"],
  ["arti-varie", "Arti Varie"],
  ["artisti-di-strada", "Artisti di Strada"],
  ["poeti", "Poeti"],
  ["dj", "DJ"],
  ["ballerini", "Ballerini"],
  ["cinema", "Cinema"],
  ["pittori", "Pittori"],
];

const mainLinks: [string, string][] = [
  ["/", "Home"],
  ["/feed/trending", "Trending"],
  ["/contest", "Contest"],
  ["/search", "Cerca"],
];

export function Navigation() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      {/* ADR-0001 §6.4 — docked glass nav; the single passive scroll listener
          lives inside GlassNav. Inner keeps the legacy 1600px container
          (D8/§13 hotspot — deliberately not silently changed to 1280). */}
      <GlassNav
        innerClassName="glass-nav-inner max-w-[1600px] mx-auto px-5"
        brand={
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              {brandMark}
              <span className="text-lg font-bold text-white tracking-tight">BAZZIBA!</span>
            </Link>
          </div>
        }
        links={
          <div className="hidden md:flex items-center gap-0.5">
            {mainLinks.map(([href, label]) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-4 py-2 text-sm transition-colors ${active ? "text-white" : "text-white/60 hover:text-white"}`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 bg-white/10 rounded-lg"
                      transition={MOTION.page}
                    />
                  )}
                  <span className="relative">{label}</span>
                </Link>
              );
            })}
          </div>
        }
        actions={
          <>
            {/* Category pills — horizontal scroll */}
            <div className="hidden lg:flex items-center gap-1">
              {pills.map(([slug, label]) => (
                <Link
                  key={slug}
                  href={`/c/${slug}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/70 bg-white/5 rounded-full hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap"
                >
                  {pillIcons[slug]}
                  {label}
                </Link>
              ))}
            </div>

            {/* Search + user */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-sm text-white/40 w-[200px]">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.34-4.34"/></svg>
                <input type="text" placeholder="Cerca..." className="bg-transparent border-none outline-none text-sm text-white placeholder-white/40 w-full" />
              </div>
              <Link href="/upload" className="px-4 py-2 text-sm font-semibold text-black bg-[#00f2ff] rounded-lg hover:bg-[#00d4e6] transition-colors flex items-center gap-1.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                Carica
              </Link>
              <Link href="/auth/signin" className="px-4 py-2 text-sm font-semibold text-[#00f2ff] bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/10">
                ACCEDI
              </Link>
              <Link href="/auth/signup" className="px-4 py-2 text-sm font-semibold text-black bg-[#00f2ff] rounded-full hover:bg-[#00d4e6] transition-colors">
                REGISTRATI
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button className="md:hidden p-2 text-white/60 hover:text-white" aria-label="Menu">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
          </>
        }
      />

      {/* Mobile nav drawer — markup kept per §6.4, gains the docked tier only */}
      <div className="md:hidden hidden glass-docked">
        <div className="flex items-center justify-between px-4 py-2">
          <svg width="24" height="24" viewBox="0 0 100 32" fill="none">
            <rect width="100" height="32" rx="6" fill="#00f2ff"/>
            <rect x="10" y="6" width="8" height="20" rx="2" fill="#050a14"/>
            <rect x="22" y="10" width="6" height="12" rx="2" fill="#050a14"/>
            <rect x="32" y="4" width="8" height="24" rx="2" fill="#050a14"/>
            <rect x="44" y="8" width="6" height="16" rx="2" fill="#050a14"/>
            <rect x="54" y="2" width="8" height="28" rx="2" fill="#050a14"/>
            <rect x="66" y="12" width="6" height="8" rx="2" fill="#050a14"/>
            <rect x="76" y="14" width="6" height="4" rx="1" fill="#050a14"/>
            <rect x="86" y="8" width="8" height="16" rx="2" fill="#050a14"/>
          </svg>
          <span className="text-base font-bold text-white">BAZZIBA!</span>
          <button className="p-2 text-white/60" aria-label="Chiudi menu">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="flex items-center gap-1 px-3 overflow-x-auto py-2">
          {pills.map(([slug, label]) => (
            <Link key={slug} href={`/c/${slug}`} className="flex items-center gap-1 px-3 py-1 text-sm text-white/70 bg-white/5 rounded-full whitespace-nowrap">{label}</Link>
          ))}
        </div>
        <nav className="flex flex-col gap-1 px-4 py-2" aria-label="Mobile">
          {mainLinks.map(([href, label]) => (
            <Link key={href} href={href} className="px-4 py-2 text-sm text-white/60 hover:text-white">{label}</Link>
          ))}
          <Link href="/upload" className="mt-2 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-black bg-[#00f2ff] rounded-lg">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
            Carica video
          </Link>
        </nav>
      </div>
    </>
  );
}
