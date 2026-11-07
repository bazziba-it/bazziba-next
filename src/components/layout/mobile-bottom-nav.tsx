"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MOTION } from "@/components/ui/glass";
import { Home, Search, Upload, Bell, User, TrendingUp, Trophy } from "lucide-react";

const mobileMenuItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Trending", href: "/feed/trending", icon: TrendingUp },
  { name: "Cerca", href: "/search", icon: Search },
  { name: "Contest", href: "/contest", icon: Trophy },
  { name: "Artisti", href: "/u", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    // ADR-0001 §7 layer 5 — docked glass, no sheen; top hairline overrides the
    // docked bottom-hairline default. §8: nav + dock count as one surface each.
    <nav
      className="fixed bottom-0 left-0 right-0 z-[var(--z-overlay)] md:hidden glass-docked border-t border-b-0"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {mobileMenuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <motion.span key={item.href} whileTap={{ scale: 0.92 }} transition={MOTION.press}>
              <Link
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 text-xs font-medium transition-all duration-200 rounded-lg p-2 min-w-0",
                  active
                    ? "text-brand-yellow bg-brand-yellow/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="mbn-active-dot"
                    className="absolute -top-0.5 w-1 h-1 rounded-full bg-brand-yellow"
                    transition={MOTION.page}
                  />
                )}
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            </motion.span>
          );
        })}
        <Link
          href="/upload"
          className="flex flex-col items-center justify-center gap-0 text-xs font-medium text-black bg-brand-yellow rounded-full w-14 h-14 shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 active:scale-95"
        >
          <Upload className="h-6 w-6 fill-current" />
        </Link>
      </div>
    </nav>
  );
}
