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
    "wp:featuredmedia"?: { source_url?: string; guid?: { rendered: string } }[];
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
  // "&" as Italian "e" when glued to a lowercase word ("Perche& fai" → "Perche e fai"; "R&B" untouched)
  t = t.replace(/(\p{Ll})&\s+/gu, "$1 e ").replace(/\s+&(\p{Ll})/gu, " e $1");
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

/** Map WP video to frontend shape. Real data only — missing fields become null. */
export function mapWpVideo(wp: WpVideo, author?: WpUser): BazzibaVideo {
  let title = cleanTitle(rendered(wp.title));
  const description = stripHtml(rendered(wp.excerpt)).slice(0, 300);

  const embeddedMedia = wp._embedded?.["wp:featuredmedia"]?.[0];
  const thumbnail = embeddedMedia?.source_url || embeddedMedia?.guid?.rendered || null;

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
}

/**
 * Bulk map: video post ID → real duration + resolution from MP4 attachments.
 * ONE request per 100 recent attachments (media_details carries `length`
 * seconds and dimensions; the REST parent key is `post`).
 */
export async function fetchVideoMediaMap(perPage = 100): Promise<Map<number, VideoMediaMeta>> {
  const map = new Map<number, VideoMediaMeta>();
  const rows = await wpFetch<
    { post: number | null; media_details?: { length?: number; width?: number; height?: number } }[]
  >("/media", {
    media_type: "video",
    per_page: String(perPage),
    orderby: "date",
    order: "desc",
    _fields: "id,post,media_details",
  }).catch((err) => {
    console.error(`[wp] media map failed: ${err.message}`);
    return [] as never[];
  });
  for (const m of rows) {
    if (!m.post) continue;
    const md = m.media_details ?? {};
    map.set(m.post, {
      durationSec: md.length && md.length > 0 ? Math.round(md.length) : null,
      resolution: resolutionLabel(md.width, md.height),
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
  return wpFetch<WpUser[]>("/users", {
    search: q,
    per_page: String(perPage),
    _fields: "id,name,slug,avatar_urls,description",
  }).catch((err) => {
    console.error(`[wp] user search failed: ${err.message}`);
    return [] as WpUser[];
  });
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
/* Users, comments, contest, pages                                     */
/* ------------------------------------------------------------------ */

/** Public user profile by slug (u/[username]). */
export async function fetchUserBySlug(slug: string): Promise<WpUser | null> {
  const users = await wpFetch<WpUser[]>("/users", { slug });
  return users[0] ?? null;
}

/** Public user profile by numeric ID (author links / u/[id] redirects). */
export async function fetchUserById(id: number | string): Promise<WpUser | null> {
  return wpFetch<WpUser>(`/users/${id}`).catch((err) => {
    console.error(`[wp] user ${id} fetch failed: ${err.message}`);
    return null;
  });
}

/** All public users (directory). */
export async function fetchUsers(perPage = 100): Promise<WpUser[]> {
  return wpFetch<WpUser[]>("/users", {
    per_page: String(perPage),
    _fields: "id,name,slug,avatar_urls,description",
  });
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
