/** @format */

import Link from "next/link";
import { Logo, ThemeToggle } from "@/components/ui/logo";
import { Button } from "@/components/ui";
import { Search, Upload, Bell, User } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          <span className="font-bold text-xl text-brand-yellow">Bazziba!</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          <Link
            href="/feed/latest"
            className="text-sm font-medium px-3 py-1.5 rounded-lg hover:text-brand-yellow hover:bg-accent transition-colors"
          >
            Home
          </Link>
          <Link
            href="/feed/trending"
            className="text-sm font-medium px-3 py-1.5 rounded-lg hover:text-brand-yellow hover:bg-accent transition-colors"
          >
            Popolari
          </Link>
          <Link
            href="/c/cantanti"
            className="text-sm font-medium px-3 py-1.5 rounded-lg hover:text-brand-yellow hover:bg-accent transition-colors"
          >
            Cantanti
          </Link>
          <Link
            href="/contest"
            className="text-sm font-medium px-3 py-1.5 rounded-lg hover:text-brand-yellow hover:bg-accent transition-colors"
          >
            Contest
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/search" className="rounded-full p-2 hover:bg-accent transition-colors">
            <Search className="h-5 w-5 text-muted-foreground" />
          </Link>
          <Link href="/upload" className="rounded-full p-2 hover:bg-accent transition-colors">
            <Upload className="h-5 w-5 text-muted-foreground" />
          </Link>
          <button className="rounded-full p-2 hover:bg-accent transition-colors relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-brand-yellow" />
          </button>
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm">
            <a href="/auth/signin">
              <User className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
