"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** App-wide framer-motion config: honors the user's prefers-reduced-motion (ADR-0003). */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
