"use client";

import Image from "next/image";
import { useState } from "react";
import { Menu, Search, Upload, Bell, User, Moon, Sun, LogIn } from "lucide-react";
import { Button } from "@/components/ui";
import { Logo } from "@/components/ui/logo";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Cantanti", slug: "cantanti" },
  { name: "Musicisti", slug: "musicisti" },
  { name: "Arti Varie", slug: "arti-varie" },
  { name: "Artisti Di Strada", slug: "artisti-di-strada" },
  { name: "Poeti", slug: "poeti" },
  { name: "DJ", slug: "dj" },
  { name: "Ballerini", slug: "ballerini" },
  { name: "Cinema", slug: "cinema" },
  { name: "Pittori", slug: "pittori" },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <a href="/" className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="font-bold text-xl">Bazziba!</span>
          </a>
          
          <nav className="hidden md:flex items-center space-x-1">
            <a
              href="/"
              className="text-sm font-medium hover:text-foreground/70 transition-colors px-3 py-2 rounded-md hover:bg-accent"
            >
              Home
            </a>
            {categories.map((cat) => (
              <a
                key={cat.slug}
                href={`/c/${cat.slug}`}
                className="text-sm font-medium hover:text-foreground/70 transition-colors px-3 py-2 rounded-md hover:bg-accent"
              >
                {cat.name}
              </a>
            ))}
            <a
              href="/contest"
              className="text-sm font-medium text-brand-yellow hover:text-brand-yellow/80 transition-colors px-3 py-2 rounded-md hover:bg-accent"
            >
              Contest
            </a>
          </nav>
        </div>

        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Cerca video, artisti, canzoni..."
              className="w-full rounded-full border border-input pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
            <Search className="h-4 w-4 md:hidden" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <Upload className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="h-4 w-4 hidden dark:block" />
          </Button>

          <Button variant="ghost" size="sm">
            <a href="/auth/signin" className="flex items-center">
              <LogIn className="h-4 w-4 mr-2" />
              Accedi
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">BAZZIBA!</h3>
            <p className="text-sm text-muted-foreground">
              La piattaforma digitale dedicata al mondo artistico.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              © 2025 Bazziba S.r.l. - REA: RM-1722388 - P.IVA 17497291009
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Esplora</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-muted-foreground hover:text-foreground">Home</a></li>
              <li><a href="/feed/trending" className="text-muted-foreground hover:text-foreground">Trending</a></li>
              <li><a href="/feed/subscribed" className="text-muted-foreground hover:text-foreground">Creatore</a></li>
              <li><a href="/contest" className="text-muted-foreground hover:text-foreground">Contest</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Community</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/membri" className="text-muted-foreground hover:text-foreground">Membri</a></li>
              <li><a href="/newsletter" className="text-muted-foreground hover:text-foreground">Newsletter</a></li>
              <li><a href="/faq" className="text-muted-foreground hover:text-foreground">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Legale</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/privacy-policy" className="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
              <li><a href="/terms" className="text-muted-foreground hover:text-foreground">Termini</a></li>
              <li><a href="/cookie-policy" className="text-muted-foreground hover:text-foreground">Cookie Policy</a></li>
              <li><a href="/contattaci" className="text-muted-foreground hover:text-foreground">Contatti</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
