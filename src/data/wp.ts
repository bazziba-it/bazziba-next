/**
 * bazziba.it WordPress REST API data layer (ADR-0003).
 *
 * Hard rules (see wp-rest-api skill + ADR-0003):
 * - NEVER combine `_embed=true` with `_fields` — `_fields` strips `_embedded`.
 * - title/excerpt/content are `{ rendered }` objects — always shape-guard.
 * - Video taxonomy term names come from `_embedded["wp:term"]` matched BY TERM ID
 *   (the internal taxonomy label is unreliable: video_category terms report as
 *   "categories"). Resolve names by ID only.
 * - Thumbnails: `_embedded["wp:featuredmedia"][0].source_url` or `/media/{id}`.
 *   Never derive URLs from media IDs (filenames are hashed).
 * - No fabricated metrics: views/likes/duration are NOT in the API — omit them.
 * - No silent per-item try/catch: skips are counted and logged; an empty result
 *   from a non-empty API response throws.
 */

export interface WpVideo {
  id: number;
  slug: string;
  /** WP REST always returns title as { rendered }; plain string only when _fields flattens it. */
  title: string | { rendered: string };
  excerpt?: string | { rendered: string };
  content?: string | { rendered: string };
  featured_media: number | null;
  /** Term IDs per taxonomy (names live in _embedded["wp:term"], matched by ID). */
  video_category?: number[];
  video_collection?: number[];
  video_tag?: number[];
  generi?: number[];
  contest_taxonomy?: number[];
  author: number;
  date: string;
  status: string;
  _embedded?: {
    "wp:featuredmedia"?: {
      source_url?: string;
      guid?: { rendered: string };
      media_details?: {
        width?: number;
        height?: number;
        sizes?: Record<string, { source_url: string; width: number; height: number }>;
      };
    }[];
    "wp:term"?: { id: number; name: string; slug: string; taxonomy: string }[][];
  };
}

export interface WpTerm {
  id: number;
  name: string;
  slug: string;
  count: number;
  taxonomy?: string;
}

export interface WpUser {
  id: number;
  name: string;
  slug: string;
  description?: string;
  url?: string;
  avatar_urls?: Record<string, string>;
  /** @deprecated use avatar_urls */
  avatarUrls?: Record<string, string>;
}

export interface WpComment {
  id: number;
  post: number;
  parent: number;
  author_name: string;
  author_avatar_urls?: Record<string, string>;
  date: string;
  content: { rendered: string };
}

export interface WpContest {
  id: number;
  slug: string;
  title: string | { rendered: string };
  content?: string | { rendered: string };
  date: string;
  featured_media: number | null;
  contest_taxonomy?: number[];
  _embedded?: {
    "wp:featuredmedia"?: { source_url?: string }[];
  };
}

export interface WpPageData {
  id: number;
  slug: string;
  title: string;
  content: string;
}

export interface WpVideoMedia {
  mp4: string | null;
  poster: string | null;
  durationSec: number | null;
  resolution: string | null;
}

/** Frontend video shape — real WP data only, no fabrications. */
export interface BazzibaVideo {
  id: string;
  slug: string;
  title: string;
  description: string;
  /** null → render the local glass placeholder, never a mock CDN image. */
  thumbnail: string | null;
  authorId: number;
  authorName: string;
  /** Real WP user slug for /u/[username] links (empty when unresolved). */
  authorSlug: string;
  /** null → render initials avatar, never pravatar. */
  authorAvatar: string | null;
  category: string;
  categorySlug: string;
  categoryId: number | null;
  date: string;
  /** Real MP4 URL when resolved via /media?parent= (watch page). */
  videoUrl?: string | null;
  /** video_tag slugs, e.g. "in-evidenza", "vincitori-contest". */
  tags: string[];
  /** Real duration in seconds from the MP4 attachment's media_details (null when unknown). */
  durationSec: number | null;
  /** Real video resolution label from media_details, e.g. "1080p" (null when unknown). */
  resolution: string | null;
  /** Portrait video (width < height) — cards use object-top so faces aren't center-cropped. */
  portrait: boolean;
}

const WP_BASE = "https://bazziba.it/wp-json/wp/v2";

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

async function wpFetch<T>(path: string, params: Record<string, string> = {}, timeoutMs = 8000): Promise<T> {
  const qs = new URLSearchParams(params).toString();
  const url = `${WP_BASE}${path}${qs ? "?" + qs : ""}`;
  const cached = getCached<T>(url);
  if (cached) return cached;

  // Retry with exponential backoff (2 attempts max)
  let lastErr: Error | undefined;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      // next.revalidate makes server fetches ISR-cacheable (prerendered at
      // build, revalidated every 5 min); browsers ignore the `next` option.
      const res = await fetch(url, {
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(timeoutMs),
      } as RequestInit);
      if (!res.ok) throw new Error(`WP ${res.status}: ${path}`);
      const data = (await res.json()) as T;
      setCache(url, data);
      return data;
    } catch (err) {
      lastErr = err as Error;
      if (attempt === 0) await new Promise((r) => setTimeout(r, 1500));
    }
  }
  throw lastErr ?? new Error(`WP fetch failed: ${path}`);
}

/** Shape-guard for WP { rendered } objects (or plain strings under _fields). */
function rendered(raw: string | { rendered: string } | undefined | null): string {
  if (!raw) return "";
  return typeof raw === "string" ? raw : raw.rendered ?? "";
}

/** Strip HTML tags from rendered WP content/excerpt. */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Clean WP post title: strip #TAG noise, boilerplate disclaimers, normalize spacing. */
function cleanTitle(raw: string): string {
  let t = raw.replace(/#\S+/g, "").replace(/[-–—]+/g, "—").trim();
  // Repeated rights-disclaimer boilerplate (very common in this corpus) — strip to end of title
  t = t.replace(/\s*[-–—,]?\s*(non ho i diritti|nessun diritto|ho diritti|diritt[io] sul brano|belle cover italiane).*$/gi, "");
  // Missing space after glued colon ("Cover:In mezzo" → "Cover: In mezzo")
  t = t.replace(/(\p{Ll}):(\p{Lu})/gu, "$1: $2");
  // Leading upload dates ("2025—04—20 TITLE" / "2025-04-20 TITLE")
  t = t.replace(/^\d{4}[-–—]\d{1,2}[-–—]\d{1,2}\s*/, "");
  // "&" as Italian "e" when glued to a lowercase word ("Perche& fai" → "Perche e fai"; "R&B" untouched)
  t = t.replace(/(\p{Ll})&\s+/gu, "$1 e ").replace(/\s+&(\p{Ll})/gu, " e $1");
  // Spaced standalone ampersand between words is "and" in this corpus ("Cover & Inediti" → "Cover e Inediti")
  t = t.replace(/(\p{L}) & (\p{L})/gu, "$1 e $2");
  // Stray leading/trailing ampersands ("& giovani&")
  t = t.replace(/^[&\s]+|[&\s]+$/g, "");
  // Missing space at lowercase→uppercase boundary ("CantautoreBELLE" → "Cantautore BELLE")
  t = t.replace(/(\p{Ll})(\p{Lu})/gu, "$1 $2");
  t = t.replace(/\s{2,}/g, " ").replace(/[—–\-,;.:\s]+$/g, "").trim();
  if (t.length > 90) {
    const commaIdx = t.indexOf(",");
    if (commaIdx > 40) t = t.slice(0, commaIdx).trim();
  }
  if (t.length > 80) t = t.slice(0, 80).trim();
  return t || raw;
}

/** True when the WP title is a raw filename/UUID/numeric placeholder, not a real title. */
function isPlaceholderTitle(t: string): boolean {
  const s = t.trim();
  if (!s) return true;
  if (/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(s)) return true; // UUID
  if (/^[0-9a-f]{20,}$/i.test(s)) return true; // long hex blob
  if (/^\d+$/.test(s)) return true; // pure numeric (media id)
  if (/^[A-Z]{2,4}[_-]?\d{3,6}$/i.test(s)) return true; // camera filename (IMG_6700, DSC_1234, VID_001)
  if (/\.(mp4|mov|webm|jpg|jpeg|png)$/i.test(s)) return true; // filename
  return false;
}

/** Flatten embedded terms and index by term ID (taxonomy labels are unreliable). */
function embeddedTermsById(wp: WpVideo): Map<number, { name: string; slug: string }> {
  const map = new Map<number, { name: string; slug: string }>();
  for (const group of wp._embedded?.["wp:term"] ?? []) {
    for (const t of group) map.set(t.id, { name: t.name, slug: t.slug });
  }
  return map;
}

/**
 * Pick the WP-generated image size closest to ~768px wide (never the
 * multi-MB original): WP creates medium/medium_large/large variants on
 * upload — served directly by bazziba.it, fast and optimizer-friendly.
 */
function pickThumbSize(
  media?: { media_details?: { sizes?: Record<string, { source_url: string; width: number }> } } | null
): string | null {
  const sizes = media?.media_details?.sizes;
  if (!sizes) return null;
  const variants = Object.values(sizes).filter((s) => s.source_url && s.width);
  if (variants.length === 0) return null;
  variants.sort((a, b) => a.width - b.width);
  // smallest variant that is >= 640w, else the largest available
  const fit = variants.find((v) => v.width >= 640) ?? variants[variants.length - 1];
  return fit.source_url;
}

/** Map WP video to frontend shape. Real data only — missing fields become null. */
export function mapWpVideo(wp: WpVideo, author?: WpUser): BazzibaVideo {
  let title = cleanTitle(rendered(wp.title));
  const description = stripHtml(rendered(wp.excerpt)).slice(0, 300);

  const embeddedMedia = wp._embedded?.["wp:featuredmedia"]?.[0];
  const thumbnail = pickThumbSize(embeddedMedia) || embeddedMedia?.source_url || embeddedMedia?.guid?.rendered || null;

  const terms = embeddedTermsById(wp);
  const catId = wp.video_category?.[0] ?? null;
  const catTerm = catId != null ? terms.get(catId) : undefined;

  const tagSlugs = (wp.video_tag ?? [])
    .map((id) => terms.get(id)?.slug)
    .filter((s): s is string => Boolean(s));

  const avatarUrls = author?.avatar_urls ?? author?.avatarUrls;

  // Placeholder titles (UUID/filename/numeric from uploads without a title)
  // become "{author} — {category}" instead of leaking raw IDs into the UI.
  if (isPlaceholderTitle(title)) {
    const who = author?.name?.trim();
    title = who && who !== "Artista sconosciuto" ? `${who} — ${catTerm?.name || "Video"}` : `Video — ${catTerm?.name || "Bazziba"}`;
  }

  return {
    id: String(wp.id),
    slug: wp.slug,
    title,
    description,
    thumbnail,
    authorId: wp.author,
    authorName: author?.name || "Artista sconosciuto",
    authorSlug: author?.slug || "",
    authorAvatar: avatarUrls?.["96"] || avatarUrls?.["48"] || null,
    category: catTerm?.name || "Senza categoria",
    categorySlug: catTerm?.slug || "",
    categoryId: catId,
    date: wp.date,
    videoUrl: null,
    tags: tagSlugs,
    durationSec: null,
    resolution: null,
    portrait: false,
  };
}

/** Resolution label from media_details dimensions (landscape: height; portrait: width). */
function resolutionLabel(width?: number, height?: number): string | null {
  if (!height) return null;
  const h = width && width < height ? width : height;
  if (h >= 2160) return "4K";
  if (h >= 1440) return "1440p";
  if (h >= 1080) return "1080p";
  if (h >= 720) return "720p";
  if (h >= 480) return "480p";
  return `${h}p`;
}

export interface VideoMediaMeta {
  durationSec: number | null;
  resolution: string | null;
  portrait: boolean;
}

/**
 * Bulk map: video post ID → real duration + resolution from MP4 attachments.
 * ONE request per 100 recent attachments (media_details carries `length`
 * seconds and dimensions; the REST parent key is `post`).
 */
export async function fetchVideoMediaMap(pages = 3): Promise<Map<number, VideoMediaMeta>> {
  const map = new Map<number, VideoMediaMeta>();
  // N parallel pages of 100 attachments — covers ~300 recent videos' metadata
  const results = await Promise.all(
    Array.from({ length: pages }, (_, i) =>
      wpFetch<
        { post: number | null; media_details?: { length?: number; width?: number; height?: number } }[]
      >("/media", {
        media_type: "video",
        per_page: "100",
        page: String(i + 1),
        orderby: "date",
        order: "desc",
        _fields: "id,post,media_details",
      }).catch((err) => {
        console.error(`[wp] media map page ${i + 1} failed: ${err.message}`);
        return [] as never[];
      })
    )
  );
  for (const m of results.flat()) {
    if (!m.post) continue;
    const md = m.media_details ?? {};
    map.set(m.post, {
      durationSec: md.length && md.length > 0 ? Math.round(md.length) : null,
      resolution: resolutionLabel(md.width, md.height),
      portrait: Boolean(md.width && md.height && md.width < md.height),
    });
  }
  return map;
}

/** Merge bulk media metadata into mapped videos. */
function withMediaMeta(videos: BazzibaVideo[], map: Map<number, VideoMediaMeta>): BazzibaVideo[] {
  for (const v of videos) {
    const meta = map.get(Number(v.id));
    if (meta) {
      v.durationSec = meta.durationSec;
      v.resolution = meta.resolution;
      v.portrait = meta.portrait;
    }
  }
  return videos;
}

/* ------------------------------------------------------------------ */
/* Videos                                                              */
/* ------------------------------------------------------------------ */

export async function fetchWpVideos(perPage = 20, page = 1): Promise<WpVideo[]> {
  return wpFetch<WpVideo[]>("/video", {
    per_page: String(perPage),
    page: String(page),
    _embed: "true",
    orderby: "date",
    order: "desc",
  });
}

/** Fetch authors by ID and index them (parallel batches of 10 — WP include limit). */
export async function fetchWpAuthors(ids: number[]): Promise<Record<number, WpUser>> {
  if (ids.length === 0) return {};
  const map: Record<number, WpUser> = {};
  const batches = [];
  for (let i = 0; i < ids.length; i += 10) {
    batches.push(ids.slice(i, i + 10));
  }
  const results = await Promise.all(
    batches.map((batch) =>
      wpFetch<WpUser[]>("/users", {
        per_page: String(batch.length),
        _fields: "id,name,slug,avatar_urls,description",
        include: batch.join(","),
      }).catch((err) => {
        console.error(`[wp] author batch failed: ${err.message}`);
        return [] as WpUser[];
      })
    )
  );
  for (const users of results) {
    for (const u of users) map[u.id] = u;
  }
  return map;
}

/** Map a raw WP page with authors resolved. Throws when WP returned data but nothing mapped. */
function mapVideoPage(wpVideos: WpVideo[], wpUsers: Record<number, WpUser>): BazzibaVideo[] {
  const results: BazzibaVideo[] = [];
  let skipped = 0;
  for (const wp of wpVideos) {
    if (wp.status !== "publish") {
      skipped++;
      continue;
    }
    try {
      results.push(mapWpVideo(wp, wpUsers[wp.author]));
    } catch (err) {
      skipped++;
      console.error(`[wp] mapWpVideo failed for #${wp.id}:`, err);
    }
  }
  if (wpVideos.length > 0 && results.length === 0) {
    throw new Error(`[wp] mapping produced 0/${wpVideos.length} videos (skipped ${skipped}) — data shape regression`);
  }
  if (skipped > 0) console.warn(`[wp] skipped ${skipped}/${wpVideos.length} videos during mapping`);
  return results;
}

/** Map a WP page of videos with authors + bulk media metadata resolved in parallel. */
async function withAuthors(wpVideos: WpVideo[]): Promise<BazzibaVideo[]> {
  const authorIds = [...new Set(wpVideos.map((v) => v.author).filter(Boolean))];
  const [wpUsers, mediaMap] = await Promise.all([
    fetchWpAuthors(authorIds),
    fetchVideoMediaMap(),
  ]);
  return withMediaMeta(mapVideoPage(wpVideos, wpUsers), mediaMap);
}

/** Latest videos, mapped with authors. */
export async function fetchBazzibaVideos(perPage = 30, page = 1): Promise<BazzibaVideo[]> {
  return withAuthors(await fetchWpVideos(perPage, page));
}

/** Single video by slug (watch page). */
export async function fetchVideoBySlug(slug: string): Promise<BazzibaVideo | null> {
  const rows = await wpFetch<WpVideo[]>("/video", { slug, _embed: "true" });
  const wp = rows[0];
  if (!wp) return null;
  const users = await fetchWpAuthors([wp.author]);
  return mapVideoPage([wp], users)[0] ?? null;
}

/** Single video by numeric ID (watch page). */
export async function fetchVideoById(id: number | string): Promise<BazzibaVideo | null> {
  const wp = await wpFetch<WpVideo>(`/video/${id}`, { _embed: "true" }).catch((err) => {
    console.error(`[wp] video ${id} fetch failed: ${err.message}`);
    return null;
  });
  if (!wp || wp.status !== "publish") return null;
  const users = await fetchWpAuthors([wp.author]);
  return mapVideoPage([wp], users)[0] ?? null;
}

/** Resolve a watch-page param that may be a numeric ID or a slug. */
export async function fetchVideoByIdOrSlug(param: string): Promise<BazzibaVideo | null> {
  return /^\d+$/.test(param) ? fetchVideoById(param) : fetchVideoBySlug(param);
}

/** Latest blog posts (boxed home "Latest Posts" section). */
export interface WpPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
}

export async function fetchLatestPosts(perPage = 3): Promise<WpPost[]> {
  const posts = await wpFetch<
    { id: number; slug: string; date: string; title: { rendered: string } | string; excerpt: { rendered: string } | string }[]
  >("/posts", {
    per_page: String(perPage),
    orderby: "date",
    order: "desc",
    _fields: "id,slug,date,title,excerpt",
  }).catch((err) => {
    console.error(`[wp] posts fetch failed: ${err.message}`);
    return [] as never[];
  });
  return posts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: stripHtml(rendered(p.title)),
    excerpt: stripHtml(rendered(p.excerpt)).slice(0, 140),
    date: p.date,
  }));
}

/** Search public users by name (search page / autocomplete). */
export async function searchUsers(query: string, perPage = 10): Promise<WpUser[]> {
  const q = query.trim();
  if (!q) return [];
  const users = await wpFetch<WpUser[]>("/users", {
    search: q,
    per_page: String(perPage),
    _fields: "id,name,slug,avatar_urls,description",
  }).catch((err) => {
    console.error(`[wp] user search failed: ${err.message}`);
    return [] as WpUser[];
  });
  return users.map(cleanUser);
}

/** Real MP4 + poster + duration + resolution for a video post (watch page player). */
export async function fetchVideoMedia(postId: number | string): Promise<WpVideoMedia> {
  const media = await wpFetch<
    { source_url: string; mime_type: string; media_details?: { length?: number; width?: number; height?: number } }[]
  >("/media", { parent: String(postId), per_page: "50" });
  const video = media.find((m) => m.mime_type.startsWith("video/"));
  const md = video?.media_details ?? {};
  return {
    mp4: video?.source_url ?? null,
    poster: media.find((m) => m.mime_type.startsWith("image/"))?.source_url ?? null,
    durationSec: md.length && md.length > 0 ? Math.round(md.length) : null,
    resolution: resolutionLabel(md.width, md.height),
  };
}

/** Videos in a video_category term. */
export async function fetchVideosByCategory(categoryId: number, perPage = 24, page = 1): Promise<BazzibaVideo[]> {
  const rows = await wpFetch<WpVideo[]>("/video", {
    video_category: String(categoryId),
    per_page: String(perPage),
    page: String(page),
    _embed: "true",
    orderby: "date",
    order: "desc",
  });
  return withAuthors(rows);
}

/** Videos by author (profile page). */
export async function fetchVideosByAuthor(authorId: number, perPage = 24): Promise<BazzibaVideo[]> {
  const rows = await wpFetch<WpVideo[]>("/video", {
    author: String(authorId),
    per_page: String(perPage),
    _embed: "true",
    orderby: "date",
    order: "desc",
  });
  return withAuthors(rows);
}

/** Videos carrying a video_tag slug ("in-evidenza" hero, "vincitori-contest" winners). */
export async function fetchVideosByTagSlug(tagSlug: string, perPage = 12): Promise<BazzibaVideo[]> {
  const terms = await wpFetch<{ id: number }[]>("/video_tag", { slug: tagSlug, _fields: "id" });
  const termId = terms[0]?.id;
  if (!termId) return [];
  const rows = await wpFetch<WpVideo[]>("/video", {
    video_tag: String(termId),
    per_page: String(perPage),
    _embed: "true",
    orderby: "date",
    order: "desc",
  });
  return withAuthors(rows);
}

/** Videos entered in a contest (contest_taxonomy term id). */
export async function fetchVideosByContestTerm(termId: number, perPage = 24): Promise<BazzibaVideo[]> {
  const rows = await wpFetch<WpVideo[]>("/video", {
    contest_taxonomy: String(termId),
    per_page: String(perPage),
    _embed: "true",
    orderby: "date",
    order: "desc",
  });
  return withAuthors(rows);
}

/** Full-text video search. */
export async function searchVideos(query: string, perPage = 24, page = 1): Promise<BazzibaVideo[]> {
  const q = query.trim();
  if (!q) return [];
  const rows = await wpFetch<WpVideo[]>("/video", {
    search: q,
    per_page: String(perPage),
    page: String(page),
    _embed: "true",
  });
  return withAuthors(rows);
}

/* ------------------------------------------------------------------ */
/* Taxonomies                                                          */
/* ------------------------------------------------------------------ */

/** The 9 real video categories (Cantanti, Musicisti, ...). */
export async function fetchVideoCategories(): Promise<WpTerm[]> {
  return wpFetch<WpTerm[]>("/video_category", {
    per_page: "100",
    _fields: "id,name,slug,count",
    orderby: "count",
    order: "desc",
  });
}

/** video_tag terms (in-evidenza, vincitori-contest). */
export async function fetchVideoTags(): Promise<WpTerm[]> {
  return wpFetch<WpTerm[]>("/video_tag", {
    per_page: "100",
    _fields: "id,name,slug,count",
  });
}

/** Contest edition terms (giugno2025, settembre2025, ...). */
export async function fetchContestTerms(): Promise<WpTerm[]> {
  return wpFetch<WpTerm[]>("/contest_taxonomy", {
    per_page: "100",
    _fields: "id,name,slug,count",
    orderby: "count",
    order: "desc",
  });
}

/* ------------------------------------------------------------------ */
/* View counts (scraped — StreamTube renders them, REST hides them)    */
/* ------------------------------------------------------------------ */

/**
 * Real view count for a video, scraped from its bazziba.it page:
 * StreamTube server-renders `<div class="post-meta__views">…N visualizzazioni`
 * (first occurrence = the main video, right after its category link).
 * The WP REST API does not expose this meta. Cached; null on any failure.
 */
export async function fetchVideoViews(slug: string): Promise<number | null> {
  const key = `views:${slug}`;
  const cached = getCached<number | null>(key);
  if (cached !== null) return cached;
  try {
    const res = await fetch(`https://bazziba.it/video/${slug}/`, {
      headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36" },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(12000),
    } as RequestInit);
    if (!res.ok) return null;
    const html = await res.text();
    const m = html.match(/post-meta__views[^]*?(\d[\d.,]*)\s*visualizzazioni/);
    const views = m ? parseInt(m[1].replace(/[.,]/g, ""), 10) : null;
    setCache(key, views);
    return views;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Artist directory stats                                              */
/* ------------------------------------------------------------------ */

export interface WpArtistStat {
  count: number;
  dominantCategory: string;
  dominantCategorySlug: string;
}

/**
 * Per-author activity from the ~300 most recent videos: video count and
 * dominant category per artist (used by the /u artists directory).
 * Honest metric — artists quiet in the recent window show no stat.
 */
export async function fetchArtistStats(): Promise<Map<number, WpArtistStat>> {
  const map = new Map<number, { count: number; cats: Map<string, { name: string; slug: string; n: number }> }>();
  // Sequential + lighter pages: 3 parallel per_page=100 _embed requests choke
  // the WP server (all timeout); 2 sequential pages of 50 succeed.
  const pages: WpVideo[][] = [];
  for (const page of [1, 2]) {
    const rows = await wpFetch<WpVideo[]>("/video", {
      per_page: "50",
      page: String(page),
      _embed: "true",
      orderby: "date",
      order: "desc",
    }, 20000).catch((err) => {
      console.error(`[wp] artist stats page ${page} failed:`, err?.message ?? err);
      return [] as WpVideo[];
    });
    pages.push(rows);
  }

  // term id -> name/slug from one embedded sample per id
  const termNames = new Map<number, { name: string; slug: string }>();
  for (const v of pages.flat()) {
    for (const group of v._embedded?.["wp:term"] ?? []) {
      for (const t of group) if (!termNames.has(t.id)) termNames.set(t.id, { name: t.name, slug: t.slug });
    }
  }

  for (const v of pages.flat()) {
    if (!v.author) continue;
    const entry = map.get(v.author) ?? { count: 0, cats: new Map() };
    entry.count++;
    const catId = v.video_category?.[0];
    if (catId != null) {
      const t = termNames.get(catId);
      const key = t?.name ?? String(catId);
      const cur = entry.cats.get(key) ?? { name: t?.name ?? "", slug: t?.slug ?? "", n: 0 };
      cur.n++;
      entry.cats.set(key, cur);
    }
    map.set(v.author, entry);
  }

  const out = new Map<number, WpArtistStat>();
  for (const [author, e] of map) {
    const dom = [...e.cats.values()].sort((a, b) => b.n - a.n)[0];
    out.set(author, {
      count: e.count,
      dominantCategory: dom?.name ?? "",
      dominantCategorySlug: dom?.slug ?? "",
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Explore (filtered / sorted browsing)                                */
/* ------------------------------------------------------------------ */

export interface ExploreQuery {
  categoryId?: number;
  orderby?: "date" | "title" | "rand";
  order?: "asc" | "desc";
  perPage?: number;
  page?: number;
}

/** Filtered + sorted video browse for the trending/explore page. */
export async function fetchVideosExplore(q: ExploreQuery = {}): Promise<BazzibaVideo[]> {
  const params: Record<string, string> = {
    per_page: String(q.perPage ?? 24),
    page: String(q.page ?? 1),
    _embed: "true",
    orderby: q.orderby ?? "date",
    order: q.order ?? (q.orderby === "title" ? "asc" : "desc"),
  };
  if (q.categoryId) params.video_category = String(q.categoryId);
  const rows = await wpFetch<WpVideo[]>("/video", params);
  return withAuthors(rows);
}

/** Total published videos by an author (X-WP-Total — one tiny call). */
export async function fetchAuthorVideoCount(authorId: number): Promise<number> {
  try {
    const res = await fetch(`${WP_BASE}/video?author=${authorId}&per_page=1`, {
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(8000),
    } as RequestInit);
    if (!res.ok) return 0;
    return parseInt(res.headers.get("X-WP-Total") ?? "0", 10) || 0;
  } catch {
    return 0;
  }
}

/* ------------------------------------------------------------------ */
/* Site pulse (latest comments + their videos)                         */
/* ------------------------------------------------------------------ */

export interface WpPulseItem {
  id: number;
  authorName: string;
  authorAvatar: string | null;
  text: string;
  date: string;
  videoId: string;
  videoTitle: string;
}

/** Latest site-wide comments, each linked to its video (home "live pulse" strip). */
export async function fetchSitePulse(perPage = 6): Promise<WpPulseItem[]> {
  const comments = await wpFetch<WpComment[]>("/comments", {
    per_page: String(perPage),
    orderby: "date",
    order: "desc",
  }).catch((err) => {
    console.error(`[wp] pulse fetch failed: ${err.message}`);
    return [] as WpComment[];
  });
  if (comments.length === 0) return [];

  // Resolve each comment's video title in parallel (unique post IDs)
  const postIds = [...new Set(comments.map((cm) => cm.post))];
  const titles = new Map<number, string>();
  await Promise.all(
    postIds.map(async (id) => {
      const v = await wpFetch<{ title: { rendered: string } | string }>(`/video/${id}`, {
        _fields: "id,title",
      }).catch(() => null);
      if (v) titles.set(id, cleanTitle(rendered(v.title)));
    })
  );

  return comments.map((cm) => ({
    id: cm.id,
    authorName: cm.author_name || "Utente",
    authorAvatar: cm.author_avatar_urls?.["48"] ?? null,
    text: stripHtml(rendered(cm.content)).slice(0, 140),
    date: cm.date,
    videoId: String(cm.post),
    videoTitle: titles.get(cm.post) ?? "Video",
  }));
}

/* ------------------------------------------------------------------ */
/* Site stats (real X-WP-Total counts)                                 */
/* ------------------------------------------------------------------ */

export interface WpSiteStats {
  videos: number;
  artists: number;
  comments: number;
}

/** Real totals from WP's X-WP-Total headers (per_page=1 — one tiny call each). */
export async function fetchSiteStats(): Promise<WpSiteStats> {
  const cached = getCached<WpSiteStats>("__site_stats");
  if (cached) return cached;

  async function totalOf(path: string): Promise<number> {
    try {
      const res = await fetch(`${WP_BASE}${path}?per_page=1`, {
        next: { revalidate: 600 },
        signal: AbortSignal.timeout(8000),
      } as RequestInit);
      if (!res.ok) return 0;
      return parseInt(res.headers.get("X-WP-Total") ?? "0", 10) || 0;
    } catch {
      return 0;
    }
  }

  const [videos, artists, comments] = await Promise.all([
    totalOf("/video"),
    totalOf("/users"),
    totalOf("/comments"),
  ]);
  const stats = { videos, artists, comments };
  setCache("__site_stats", stats);
  return stats;
}

/* ------------------------------------------------------------------ */
/* Users, comments, contest, pages                                     */
/* ------------------------------------------------------------------ */

/**
 * Sanitize a user's public description: artists can paste raw embed HTML
 * into their WP bio (observed: a full YouTube engagement-panel markup in
 * Xandrot's description) — strip tags so it never renders as raw code.
 */
function cleanUser(u: WpUser): WpUser {
  if (!u.description) return u;
  let bio = stripHtml(u.description);
  // YouTube transcript timestamp junk ("00:00.", " 12:34.") pasted into bios
  bio = bio.replace(/(?:^|[\s"'\u201c\u201d])\d{1,2}:\d{2}(?::\d{2})?\./g, " ");
  bio = bio.replace(/"Aggiungi dettagli"\s*/g, "").replace(/\s{2,}/g, " ").trim();
  return { ...u, description: bio };
}

/** Public user profile by slug (u/[username]). */
export async function fetchUserBySlug(slug: string): Promise<WpUser | null> {
  const users = await wpFetch<WpUser[]>("/users", { slug });
  return users[0] ? cleanUser(users[0]) : null;
}

/** Public user profile by numeric ID (author links / u/[id] redirects). */
export async function fetchUserById(id: number | string): Promise<WpUser | null> {
  const u = await wpFetch<WpUser>(`/users/${id}`).catch((err) => {
    console.error(`[wp] user ${id} fetch failed: ${err.message}`);
    return null;
  });
  return u ? cleanUser(u) : null;
}

/** Public users, one page (directory is paged at 100). */
export async function fetchUsers(perPage = 100, page = 1): Promise<WpUser[]> {
  const users = await wpFetch<WpUser[]>("/users", {
    per_page: String(perPage),
    page: String(page),
    _fields: "id,name,slug,avatar_urls,description",
  });
  return users.map(cleanUser);
}

/** Every public user — pages through /users until a short page. */
export async function fetchAllWpUsers(): Promise<WpUser[]> {
  const all: WpUser[] = [];
  for (let page = 1; page <= 5; page++) {
    const batch = await fetchUsers(100, page).catch(() => [] as WpUser[]);
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all;
}

/** Real comments for a video post. */
export async function fetchComments(postId: number | string, perPage = 50): Promise<WpComment[]> {
  return wpFetch<WpComment[]>("/comments", {
    post: String(postId),
    per_page: String(perPage),
    order: "asc",
  }).catch((err) => {
    console.error(`[wp] comments fetch failed for post ${postId}: ${err.message}`);
    return [] as WpComment[];
  });
}

/** Contest CPT entries (monthly editions). */
export async function fetchContests(perPage = 20): Promise<WpContest[]> {
  return wpFetch<WpContest[]>("/contest", {
    per_page: String(perPage),
    _embed: "true",
    orderby: "date",
    order: "desc",
  });
}

/** Static page content by slug. */
export async function fetchPageBySlug(slug: string): Promise<WpPageData | null> {
  const pages = await wpFetch<
    { id: number; slug: string; title: { rendered: string } | string; content: { rendered: string } | string }[]
  >("/pages", { slug });
  const p = pages[0];
  if (!p) return null;
  return {
    id: p.id,
    slug: p.slug,
    title: stripHtml(rendered(p.title)),
    content: rendered(p.content),
  };
}

/** All page slugs (for mapping app routes to WP pages). */
export async function fetchPageSlugs(): Promise<{ id: number; slug: string; title: string }[]> {
  const pages = await wpFetch<{ id: number; slug: string; title: { rendered: string } | string }[]>(
    "/pages",
    { per_page: "100", _fields: "id,slug,title" }
  );
  return pages.map((p) => ({ id: p.id, slug: p.slug, title: stripHtml(rendered(p.title)) }));
}
