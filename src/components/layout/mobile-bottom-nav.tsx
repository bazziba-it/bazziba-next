"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Home, Search, Upload, Bell, User, TrendingUp, Trophy } from "lucide-react";

const mobileMenuItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Trending", href: "/feed/trending", icon: TrendingUp },
  { name: "Search", href: "/search", icon: Search },
  { name: "Contest", href: "/contest", icon: Trophy },
  { name: "Profilo", href: "/u", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur border-t">
      <div className="flex items-center justify-around h-16 px-2">
        {mobileMenuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-all duration-200 rounded-lg p-2",
                active
                  ? "text-brand-yellow bg-brand-yellow/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
        <Link
          href="/upload"
          className="flex flex-col items-center justify-center gap-1 text-xs font-medium text-white bg-brand-yellow rounded-full w-14 h-14 shadow-lg hover:scale-105 transition-transform"
        >
          <Upload className="h-6 w-6" />
        </Link>
      </div>
    </nav>
  );
}
