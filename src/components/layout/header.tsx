/**
 * Bazziba Next.js - Header Component
 */

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
          <span className="font-bold text-xl">Bazziba!</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/feed/latest" className="text-sm font-medium hover:text-brand-yellow">
            Home
          </Link>
          <Link href="/feed/trending" className="text-sm font-medium hover:text-brand-yellow">
            Popolari
          </Link>
          <Link href="/c/cantanti" className="text-sm font-medium hover:text-brand-yellow">
            Cantanti
          </Link>
          <Link href="/contest" className="text-sm font-medium hover:text-brand-yellow">
            Contest
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button className="rounded-full p-2 hover:bg-accent">
            <Search className="h-5 w-5" />
          </button>
          <button className="rounded-full p-2 hover:bg-accent">
            <Upload className="h-5 w-5" />
          </button>
          <button className="rounded-full p-2 hover:bg-accent">
            <Bell className="h-5 w-5" />
          </button>
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm">
            <Link href="/auth/signin">
              <User className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
