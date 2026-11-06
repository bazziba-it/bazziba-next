/** Shared real-data formatters (no fabricated values anywhere). */

/** "3:06" from seconds; null-safe. */
export function formatDurationSec(sec: number | null | undefined): string | null {
  if (sec == null || !Number.isFinite(sec) || sec <= 0) return null;
  const s = Math.round(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  return `${m}:${String(r).padStart(2, "0")}`;
}

/** Italian relative time: "3 giorni fa". */
export function timeAgoIT(iso: string | Date): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const mins = Math.max(1, Math.floor((Date.now() - then) / 60000));
  if (mins < 60) return mins === 1 ? "1 minuto fa" : `${mins} minuti fa`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return hours === 1 ? "1 ora fa" : `${hours} ore fa`;
  const days = Math.floor(hours / 24);
  if (days < 30) return days === 1 ? "1 giorno fa" : `${days} giorni fa`;
  const months = Math.floor(days / 30);
  if (months < 12) return months === 1 ? "1 mese fa" : `${months} mesi fa`;
  return new Date(iso).toLocaleDateString("it-IT");
}
