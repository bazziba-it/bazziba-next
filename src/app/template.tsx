"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { MOTION } from "@/components/ui/glass";

/**
 * Route-level page transition (ADR-0003): every navigation replays this
 * template — fade + 12px rise on the shared MOTION.page spring.
 * transform/opacity only; reduced-motion users get the instant swap
 * via MotionConfig reducedMotion="user" in the root layout.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={MOTION.page}
    >
      {children}
    </motion.div>
  );
}
