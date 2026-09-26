"use client";

import { useState, useEffect } from "react";
import { Menu, Search, Upload, Bell, User, Moon, Sun, LogIn, Home, TrendingUp, Trophy } from "lucide-react";
import { Button } from "@/components/ui";
import { Logo } from "@/components/ui/logo";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchAutocomplete } from "@/components/layout/search-autocomplete";

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

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Trending", href: "/feed/trending", icon: TrendingUp },
  { name: "Contest", href: "/contest", icon: Trophy },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full glass-nav liquid-glass-nav">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-9 w-9" />
            <span className="font-bold text-xl text-brand-yellow">Bazziba!</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href} className={cn("flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200", active ? "bg-brand-yellow/10 text-brand-yellow shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-accent")}>
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}

            {categories.map((cat) => (
              <Link key={cat.slug} href={`/c/${cat.slug}`} className={cn("text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap", isActive(`/c/${cat.slug}`) ? "text-brand-yellow bg-brand-yellow/10 shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-accent")}>
                {cat.name}
              </Link>
            ))}

            <Link href="/contest" className={cn("flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200", isActive("/contest") ? "bg-brand-yellow text-black shadow-md hover:shadow-lg" : "text-brand-yellow hover:bg-brand-yellow/10")}>
              <Trophy className="h-4 w-4" />
              Contest
            </Link>
          </nav>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:block flex-1 max-w-2xl mx-4">
          <SearchAutocomplete />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon">
            <Upload className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="h-4 w-4 hidden dark:block" />
          </Button>

          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Link href="/auth/signin" className="flex items-center">
              <LogIn className="h-4 w-4 mr-2" />
              Accedi
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile Search Row */}
      <div className="md:hidden px-4 pb-2">
        <SearchAutocomplete />
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t glass-nav liquid-glass-nav">
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
              <li><Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link></li>
              <li><Link href="/feed/trending" className="text-muted-foreground hover:text-foreground transition-colors">Trending</Link></li>
              <li><Link href="/feed/subscribed" className="text-muted-foreground hover:text-foreground transition-colors">Creatore</Link></li>
              <li><Link href="/contest" className="text-muted-foreground hover:text-foreground transition-colors">Contest</Link></li>
              <li><Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">Cerca</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-foreground">Community</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/u" className="text-muted-foreground hover:text-foreground transition-colors">Membri</Link></li>
              <li><Link href="/newsletter" className="text-muted-foreground hover:text-foreground transition-colors">Newsletter</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-foreground">Legale</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Termini</Link></li>
              <li><Link href="/cookie-policy" className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</Link></li>
              <li><Link href="/contattaci" className="text-muted-foreground hover:text-foreground transition-colors">Contatti</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
