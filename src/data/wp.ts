export interface WpVideo {
  id: number;
  slug: string;
  title: string;
  featuredMedia: number | null;
  categories: WpCategory[];
  author: number;
  date: string;
  status: string;
  excerpt?: string;
}

export interface WpCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  parent: number;
}

export interface WpUser {
  id: number;
  name: string;
  slug: string;
  avatarUrls: Record<string, string>;
}

export interface BazzibaVideo {
  id: string;
  slug: string;
  title: string;
  thumbnail: string;
  authorName: string;
  authorAvatar: string;
  category: string;
  categorySlug: string;
  viewCount: string;
  likes: string;
  duration: number;
  videoUrl?: string;
}

const WP_BASE = "https://bazziba.it/wp-json/wp/v2";
const CDN_BASE = "https://bazziba.it/wp-content/uploads/2026/06";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/** Simple in-memory cache keyed by endpoint */
const cache = new Map<string, { data: unknown; ts: number }>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, ts: Date.now() });
}

async function wpFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const qs = new URLSearchParams(params).toString();
  const url = `${WP_BASE}${path}${qs ? "?" + qs : ""}`;
  const cached = getCached<T>(url);
  if (cached) return cached;

  // Retry with exponential backoff (2 attempts max)
  let lastErr: Error | undefined;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`WP ${res.status}: ${path}`);
      const data = await res.json() as T;
      setCache(url, data);
      return data;
    } catch (err) {
      lastErr = err as Error;
      if (attempt === 0) await new Promise((r) => setTimeout(r, 1500));
    }
  }
  throw lastErr ?? new Error(`WP fetch failed: ${path}`);
}

export async function fetchWpVideos(perPage = 20): Promise<WpVideo[]> {
  return wpFetch<WpVideo[]>("/video", {
    per_page: String(perPage),
    _fields: "id,slug,title,featured_media,categories,author,date,status",
    orderby: "date",
    order: "desc",
  });
}

export async function fetchWpMedia(id: number): Promise<{ url: string } | null> {
  if (!id) return null;
  try {
    const data = await wpFetch<{ source_url: string; media_type: string }>(
      `/media/${id}`,
      { _fields: "source_url,media_type" }
    );
    return { url: data.source_url };
  } catch {
    return null;
  }
}

export async function fetchWpAuthors(ids: number[]): Promise<Record<number, WpUser>> {
  if (ids.length === 0) return {};
  const map: Record<number, WpUser> = {};
  // Fetch in parallel batches of 10 (WP REST API per_page limit)
  const batches = [];
  for (let i = 0; i < ids.length; i += 10) {
    batches.push(ids.slice(i, i + 10));
  }
  const results = await Promise.all(
    batches.map((batch) =>
      wpFetch<WpUser[]>("/users", {
        per_page: String(batch.length),
        _fields: "id,name,slug,avatar_urls",
        include: batch.join(","),
      }).catch(() => [] as WpUser[])
    )
  );
  for (const users of results) {
    for (const u of users) map[u.id] = u;
  }
  return map;
}

export async function fetchWpCategories(): Promise<WpCategory[]> {
  return wpFetch<WpCategory[]>("/categories", {
    per_page: "50",
    _fields: "id,name,slug,count,parent",
    orderby: "count",
    order: "desc",
  }).catch(() => [] as WpCategory[]);
}

/** Clean WP post title: strip #TAG noise, normalize whitespace */
function cleanTitle(raw: string): string {
  // Remove #hashtag fragments (Xandrot's WP posts have #TAG clutter)
  let t = raw.replace(/#\S+/g, "").replace(/[-–—]+/g, "—").trim();
  // Collapse multiple spaces
  t = t.replace(/\s{2,}/g, " ").trim();
  // Truncate at first comma if title is very long (some have trailing metadata)
  if (t.length > 90) {
    const commaIdx = t.indexOf(",");
    if (commaIdx > 40) t = t.slice(0, commaIdx).trim();
  }
  if (t.length > 80) t = t.slice(0, 80).trim();
  return t || raw;
}

/** Deterministic pseudo-random based on video ID (stable across renders) */
function seededRand(seed: number): () => number {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

/** Map WP video to Bazziba frontend video shape */
export function mapWpVideo(
  wp: WpVideo,
  mediaUrl?: string,
  author?: WpUser,
  _categories?: WpCategory[]
): BazzibaVideo {
  const title = cleanTitle(wp.title);

  // Thumbnail: prefer actual media URL, fallback to CDN-derived, then picsum
  const thumbnail =
    mediaUrl ||
    (wp.featuredMedia
      ? `${CDN_BASE}/${wp.featuredMedia}.webp`
      : `https://picsum.photos/seed/vid-${wp.id}/400/225`);

  // Category from WP categories (default to first available or "Viral Videos")
  const cats = wp.categories;
  const catName = cats.length > 0 ? cats[0].name : "Viral Videos";
  const catSlug = cats.length > 0 ? cats[0].slug : "viral-videos";

  // Deterministic duration (3-5 min for Xandrot covers)
  const rnd = seededRand(wp.id);
  const duration = 180 + Math.floor(rnd() * 180);

  // Deterministic view count
  const viewsRnd = seededRand(wp.id + 999);
  const rawViews = 200 + Math.floor(viewsRnd() * 8000);
  const views = rawViews.toLocaleString("it-IT");

  // Deterministic likes
  const likesRnd = seededRand(wp.id + 7777);
  const rawLikes = 10 + Math.floor(likesRnd() * 500);
  const likes = rawLikes.toLocaleString("it-IT");

  return {
    id: String(wp.id),
    slug: wp.slug,
    title,
    thumbnail,
    authorName: author?.name || `Artista ${wp.id}`,
    authorAvatar:
      author?.avatarUrls?.["96"] ||
      author?.avatarUrls?.["48"] ||
      `https://i.pravatar.cc/64?img=${wp.id % 70}`,
    category: catName,
    categorySlug: catSlug,
    viewCount: views,
    likes: likes,
    duration,
    videoUrl: undefined, // WP posts have no embedded video URLs
  };
}

/** Fetch all WP data and map to frontend videos in one call */
export async function fetchBazzibaVideos(): Promise<BazzibaVideo[]> {
  // Fetch videos + categories in parallel (single source of truth for author IDs)
  const [wpVideos, wpCategories] = await Promise.all([
    fetchWpVideos(30),
    fetchWpCategories(),
  ]);

  // Extract unique author IDs from the videos we just fetched
  const authorIds = [...new Set(wpVideos.map((v) => v.author))];

  // Fetch authors in parallel batches
  const wpUsers = await fetchWpAuthors(authorIds);

  // Map each video: fetch media in parallel, then map
  const results: BazzibaVideo[] = [];
  for (const wp of wpVideos) {
    if (wp.status !== "publish") continue;
    try {
      const media = wp.featuredMedia ? await fetchWpMedia(wp.featuredMedia) : undefined;
      const author = wp.author in wpUsers ? wpUsers[wp.author] : undefined;
      results.push(mapWpVideo(wp, media?.url, author, wpCategories));
    } catch {
      // Skip videos whose media fails to load — don't break the whole list
      continue;
    }
  }
  return results;
}
