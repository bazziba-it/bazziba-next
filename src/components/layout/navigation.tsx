/** @format */

"use client";

import Link from "next/link";
import { Logo, ThemeToggle } from "@/components/ui/logo";
import { Button } from "@/components/ui";
import { Search, Upload, Bell, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { SearchAutocomplete } from "@/components/layout/search-autocomplete";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Cantanti", slug: "cantanti", icon: "🎤" },
  { name: "Musicisti", slug: "musicisti", icon: "🎸" },
  { name: "Arti Varie", slug: "arti-varie", icon: "🎨" },
  { name: "Artisti Di Strada", slug: "artisti-di-strada", icon: "🎭" },
  { name: "Poeti", slug: "poeti", icon: "📜" },
  { name: "DJ", slug: "dj", icon: "🎧" },
  { name: "Ballerini", slug: "ballerini", icon: "💃" },
  { name: "Cinema", slug: "cinema", icon: "🎬" },
  { name: "Pittori", slug: "pittori", icon: "🖼️" },
];

const desktopNavItems = [
  { name: "Home", href: "/", icon: null },
  { name: "Trending", href: "/feed/trending", icon: null },
  { name: "Contest", href: "/contest", icon: null },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full liquid-glass-nav">
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* Left: logo + mobile menu toggle */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-9 w-9" />
            <span className="font-bold text-xl text-brand-yellow">Bazziba!</span>
          </Link>
        </div>

        {/* Center: desktop nav */}
        <nav className="hidden md:flex items-center space-x-1">
          {desktopNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200",
                "text-muted-foreground hover:text-foreground hover:bg-accent",
              )}
            >
              {item.name}
            </Link>
          ))}

          {/* Category pills */}
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/c/${cat.slug}`}
              className={cn(
                "text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap",
                "text-muted-foreground hover:text-foreground hover:bg-accent",
              )}
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
        </nav>

        {/* Right: search + actions */}
        <div className="flex items-center gap-2">
          {/* Desktop search */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <SearchAutocomplete />
          </div>

          {/* Mobile search icon */}
          <Button variant="ghost" size="icon" className="md:hidden" asChild>
            <a href="/search">
              <Search className="h-4 w-4" />
            </a>
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <a href="/upload">
              <Upload className="h-4 w-4" />
            </a>
          </Button>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-brand-yellow" />
          </Button>

          <ThemeToggle />

          <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
            <a href="/auth/signin" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              Accedi
            </a>
          </Button>
        </div>
      </div>

      {/* Mobile search row */}
      <div className="md:hidden px-4 pb-2">
        <SearchAutocomplete />
      </div>

      {/* Mobile drawer overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-screen bg-background/95 backdrop-blur border-r transition-transform md:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* Mobile nav items */}
          <nav className="flex-1 space-y-1">
            {desktopNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="border-t my-3" />

            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/c/${cat.slug}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </Link>
            ))}
          </nav>

          <div className="border-t pt-4 mt-auto space-y-2">
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <a href="/auth/signin">Accedi</a>
            </Button>
            <Button className="w-full bg-brand-yellow text-black hover:bg-brand-gold-hover" asChild>
              <a href="/upload">Carica video</a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t liquid-glass-nav bg-background/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Logo className="h-7 w-7" />
              <span className="font-bold text-xl text-brand-yellow">Bazziba!</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              La piattaforma digitale dedicata al mondo artistico.
              Condividi e scopri contenuti video con carattere e interesse artistico.
            </p>
            <p className="text-xs text-muted-foreground">
              © 2025 Bazziba S.r.l. - REA: RM-1722388 - P.IVA 17497291009
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-foreground">Esplora</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/feed/trending" className="text-muted-foreground hover:text-foreground transition-colors">
                  Trending
                </Link>
              </li>
              <li>
                <Link href="/contest" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contest
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cerca
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-foreground">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/u" className="text-muted-foreground hover:text-foreground transition-colors">
                  Membri
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/newsletter" className="text-muted-foreground hover:text-foreground transition-colors">
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-foreground">Legale</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Termini
                </Link>
              </li>
              <li>
                <Link href="/contattaci" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contatti
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
