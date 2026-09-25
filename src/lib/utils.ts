/**
 * Bazziba Next.js - Utility Functions
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format, parseISO } from "date-fns";
import { it } from "date-fns/locale";

// Tailwind class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date distance (e.g., "2 hours ago")
export function timeAgo(date: Date | string): string {
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    return formatDistanceToNow(d, { addSuffix: true, locale: it });
  } catch {
    return "Recently";
  }
}

// Format date (e.g., "Jan 15, 2025")
export function formatDate(date: Date | string): string {
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    return format(d, "MMM d, yyyy", { locale: it });
  } catch {
    return "";
  }
}

// Format date with time
export function formatDateTime(date: Date | string): string {
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    return format(d, "MMM d, yyyy 'at' h:mm a", { locale: it });
  } catch {
    return "";
  }
}

// Format view count (compact notation: 1.2K, 5M)
export function formatViews(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

// Format number with locale
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("it-IT").format(n);
}

// Validate email
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate username (3-20 chars, alphanumeric + underscore)
export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

// Generate color from string (for category badges)
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).padStart(6, "0");
  return `#${c}`;
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    return true;
  } catch {
    return false;
  }
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Get YouTube video ID from URL
export function getYouTubeVideoId(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^?&'"'\n]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Generate OG image URL for video (using Cloudflare Workers or similar)
export function getVideoOgImage(video: {
  title: string;
  author: string;
  thumbnail?: string | null;
}): string {
  const params = new URLSearchParams({
    title: video.title,
    author: video.author,
    ...(video.thumbnail ? { thumbnail: video.thumbnail } : {}),
  });
  return `/api/og?${params.toString()}`;
}

// Class for managing video playback state
export class VideoPlayerState {
  playing: boolean = false;
  paused: boolean = false;
  loading: boolean = false;
 ended: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  volume: number = 1;
  muted: boolean = false;
  quality: string = "hd1080";
  isFullscreen: boolean = false;
  isPiP: boolean = false;
}
