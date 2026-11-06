"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { MOTION } from "@/components/ui/glass";

/** Floating back-to-top button — appears after 600px scroll, glass style. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9, transition: { duration: 0.15 } }}
          transition={MOTION.enter}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Torna su"
          className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-[var(--z-overlay)]
            w-11 h-11 rounded-full glass-raised border border-[#00f2ff]/30
            flex items-center justify-center text-[#00f2ff]
            shadow-lg shadow-black/40 hover:border-[#00f2ff]/60 hover:shadow-cyan-glow-1
            transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f2ff]"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
