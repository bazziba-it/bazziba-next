"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

/** Global nav progress bar: instant feedback on internal link clicks
 *  (ISR first-hits can take 1-3s — the bar makes clicks feel instant). */
export function NavProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (href.startsWith("/") && !href.startsWith("//")) {
        setKey((k) => k + 1);
        setActive(true);
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    setActive(false);
  }, [pathname]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key={key}
          className="fixed top-0 left-0 right-0 h-0.5 bg-[#00f2ff] z-[var(--z-toast)] origin-left"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 0.85, opacity: 1 }}
          exit={{ scaleX: 1, opacity: 0, transition: { duration: 0.25 } }}
          transition={{ duration: 2.5, ease: [0.1, 0.5, 0.2, 1] }}
        />
      )}
    </AnimatePresence>
  );
}
