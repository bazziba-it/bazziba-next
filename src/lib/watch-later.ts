"use client";

/** Local "Guarda più tardi" list — no account needed (StreamTube has per-user
 *  collections behind auth; this is the anonymous equivalent). */

export interface WatchLaterItem {
  id: string;
  slug: string;
  title: string;
  thumbnail: string | null;
  authorName: string;
  category: string;
  categorySlug: string;
  durationSec: number | null;
  addedAt: number;
}

const KEY = "bazziba_watch_later";

export function getWatchLater(): WatchLaterItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as WatchLaterItem[];
  } catch {
    return [];
  }
}

export function inWatchLater(id: string): boolean {
  return getWatchLater().some((v) => v.id === id);
}

export function toggleWatchLater(item: Omit<WatchLaterItem, "addedAt">): boolean {
  const list = getWatchLater();
  const idx = list.findIndex((v) => v.id === item.id);
  let next: WatchLaterItem[];
  if (idx >= 0) {
    next = list.filter((v) => v.id !== item.id);
  } else {
    next = [{ ...item, addedAt: Date.now() }, ...list].slice(0, 100);
  }
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("watch-later-changed"));
  return idx < 0;
}

export function removeFromWatchLater(id: string): void {
  const next = getWatchLater().filter((v) => v.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("watch-later-changed"));
}

/** Playback position memory (resume where you left off). */
const POS_KEY = "bazziba_positions";
const POS_TTL = 30 * 86400000; // 30 days

export function savePosition(videoId: string, seconds: number): void {
  if (typeof window === "undefined" || !Number.isFinite(seconds) || seconds < 5) return;
  try {
    const all = JSON.parse(localStorage.getItem(POS_KEY) ?? "{}") as Record<string, { t: number; at: number }>;
    all[videoId] = { t: Math.floor(seconds), at: Date.now() };
    localStorage.setItem(POS_KEY, JSON.stringify(all));
  } catch { /* storage full — ignore */ }
}

export function getPosition(videoId: string): number | null {
  if (typeof window === "undefined") return null;
  try {
    const all = JSON.parse(localStorage.getItem(POS_KEY) ?? "{}") as Record<string, { t: number; at: number }>;
    const e = all[videoId];
    if (!e || Date.now() - e.at > POS_TTL) return null;
    return e.t;
  } catch {
    return null;
  }
}

export function clearPosition(videoId: string): void {
  try {
    const all = JSON.parse(localStorage.getItem(POS_KEY) ?? "{}") as Record<string, unknown>;
    delete all[videoId];
    localStorage.setItem(POS_KEY, JSON.stringify(all));
  } catch { /* ignore */ }
}
