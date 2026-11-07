"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { GlassNav } from "@/components/ui";
import { MOTION } from "@/components/ui/glass";
import { SearchAutocomplete } from "@/components/layout/search-autocomplete";
import { BazzibaLogo } from "@/components/ui/brand";

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
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* ADR-0001 §6.4 — docked glass nav; the single passive scroll listener
          lives inside GlassNav. Inner keeps the legacy 1600px container
          (D8/§13 hotspot — deliberately not silently changed to 1280). */}
      <GlassNav
        innerClassName="glass-nav-inner max-w-[1600px] mx-auto px-5"
        brand={
          <Link href="/" aria-label="BAZZIBA! — Home">
            <BazzibaLogo height={26} />
          </Link>
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
              {/* Real search: debounced WP autocomplete with results dropdown */}
              <div className="hidden sm:block w-[220px]">
                <SearchAutocomplete />
              </div>
              <Link href="/upload" className="hidden md:flex px-4 py-2 text-sm font-semibold text-black bg-[#00f2ff] rounded-lg hover:bg-[#00d4e6] transition-colors items-center gap-1.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                Carica
              </Link>
              <Link href="/auth/signin" className="hidden md:block px-4 py-2 text-sm font-semibold text-[#00f2ff] bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/10">
                ACCEDI
              </Link>
              <Link href="/auth/signup" className="hidden md:block px-4 py-2 text-sm font-semibold text-black bg-[#00f2ff] rounded-full hover:bg-[#00d4e6] transition-colors">
                REGISTRATI
              </Link>
            </div>

            {/* Mobile hamburger — opens the animated drawer */}
            <button
              className="md:hidden p-2 text-white/60 hover:text-white"
              aria-label={drawerOpen ? "Chiudi menu" : "Apri menu"}
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen((v) => !v)}
            >
              {drawerOpen ? (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              ) : (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
              )}
            </button>
          </>
        }
      />

      {/* Mobile nav drawer — animated slide-down with real search + real categories */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.15 } }}
            transition={MOTION.page}
            className="md:hidden glass-docked border-b border-white/10 sticky top-[64px] z-[var(--z-docked)]"
          >
            {/* Real search with autocomplete */}
            <div className="px-4 pt-3">
              <SearchAutocomplete />
            </div>

            {/* Real category pills */}
            <div className="flex items-center gap-1.5 px-4 overflow-x-auto py-3 scrollbar-hide">
              {pills.map(([slug, label]) => (
                <Link
                  key={slug}
                  href={`/c/${slug}`}
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-white/70 bg-white/5 rounded-full whitespace-nowrap hover:bg-white/10 hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Main links with active state */}
            <nav className="flex flex-col gap-1 px-4 pb-3" aria-label="Mobile">
              {mainLinks.map(([href, label]) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setDrawerOpen(false)}
                    className={`px-4 py-2.5 rounded-lg text-sm transition-colors ${
                      active ? "bg-white/10 text-white font-medium" : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
              <Link
                href="/upload"
                onClick={() => setDrawerOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-black bg-[#00f2ff] rounded-lg"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                Carica video
              </Link>
              <div className="flex gap-2 mt-2">
                <Link
                  href="/auth/signin"
                  onClick={() => setDrawerOpen(false)}
                  className="flex-1 text-center px-4 py-2.5 text-sm font-semibold text-[#00f2ff] bg-white/5 rounded-lg border border-white/10"
                >
                  ACCEDI
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setDrawerOpen(false)}
                  className="flex-1 text-center px-4 py-2.5 text-sm font-semibold text-black bg-[#00f2ff] rounded-lg"
                >
                  REGISTRATI
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
