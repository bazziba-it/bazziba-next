"use client";

import { useEffect } from "react";

/** Registers /sw.js once (production only) — powers the PWA offline shell. */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("[pwa] service worker registration failed:", err);
    });
  }, []);
  return null;
}
