# ADR-0003: Full bazziba.it WP REST connection + rich motion pass

Status: accepted (2026-11-06) — supersedes all mock-data scaffolding decisions.

## Context

The app still carries picsum/pravatar/sample-MP4 mocks in 9 files, wp.ts fabricates
views/likes/duration, and thumbnails fall back to an ID-derived CDN URL (invalid —
filenames are hashed). The live WP REST API exposes everything needed for a
fully data-driven app. User decisions (Q&A 2026-11-06): wire EVERYTHING, remove
ALL mocks (real data or explicit empty state), RICH motion everywhere, deploy
manual by user.

## Verified API facts (live probes 2026-11-06)

- `GET /wp/v2/video` — 939 videos. `_embed=true` required (never with `_fields` — it strips `_embedded`).
- Playable file: `GET /wp/v2/media?parent={videoId}` — attachment with `mime_type` `video/*` is the MP4 (`source_url`). 1014 video attachments exist. No ACF/meta exposes it.
- Poster: `_embedded["wp:featuredmedia"][0].source_url` (or `/media/{id}`).
- Taxonomies on video object: `video_category` (the real 9 site categories: Cantanti 601, Musicisti 487, Arti varie 193, Artisti di strada 148, Poeti 131, DJ 50, Ballerini 26, Cinema 20, Pittori 17), `generi` (genre mirror), `video_tag` (`in-evidenza` = 25 featured, `vincitori-contest` = 20 contest winners), `contest_taxonomy` (monthly: giugno2025 28, maggio2025 32, settembre2025 23, marzo, maggio), `video_collection` (per-user story lists — skip), `report_category` (skip).
- `_embedded["wp:term"]` reports the video category taxonomy under the internal name `categories` — resolve terms by **term ID**, never by taxonomy string.
- Contest CPT: `GET /wp/v2/contest` — monthly contests (e.g. "Settembre 2025"), title/content/featured_media. Participation = videos carrying the matching `contest_taxonomy` term; winners = videos with `video_tag` `vincitori-contest`.
- Users: `GET /wp/v2/users` — 254; public shape: id, name, slug, avatar_urls (gravatar), description, url.
- Comments: `GET /wp/v2/comments?post={videoId}` — 173 total; author_name, author_avatar_urls, content.rendered.
- Pages: `GET /wp/v2/pages?slug=...` — 35 (about/faq/privacy/terms/contattaci equivalents must be slug-mapped).
- Search: `GET /wp/v2/video?search={q}`.
- Views/likes/duration are NOT in the API. Never fabricate: omit counts; duration comes from real MP4 metadata client-side (watch page only).

## Data architecture

- Single module `src/data/wp.ts`; keep `wpFetch` (in-memory 5-min cache, 8s `AbortSignal.timeout`, 1 retry).
- Pages are Server Components with `export const revalidate = 300`; client fetching only where interactivity requires it (search autocomplete, comments load-more).
- Resolve video categories by matching post's `video_category` IDs against `_embedded["wp:term"]` flattened by ID; fallback chain for names: embedded → `/wp/v2/video_category/{id}`.
- Shape guards mandatory: `title`/`excerpt`/`content` are `{rendered}` objects; guard `typeof t === "string" ? t : t?.rendered ?? ""`.
- No silent per-item try/catch: mapping counts skips and `console.error`s them; an empty result from a non-empty API response must throw in dev.
- Missing avatar → local initials component (gravatar URLs are real data; pravatar banned).
- Missing thumbnail → local glass placeholder (play icon + category color), never picsum, never ID-derived URL.

## Endpoint → surface map

| Surface | Data |
|---|---|
| home/feed/boxed | `/video?_embed` + `/video_category` filter chips; hero = `video_tag=in-evidenza` |
| watch/[id] | `/video?slug=` + `/media?parent=` (MP4) + `/comments?post=` + related by same `video_category` |
| u/[username] | `/users?slug=` + `/video?author=` |
| c/[slug] | `/video_category` list + `/video?video_category={id}` |
| contest | `/contest` list + `/contest_taxonomy`; entries `/video?contest_taxonomy={id}`; winners `video_tag=vincitori-contest` |
| search | `/video?search=` autocomplete (debounced, client) + results page |
| static pages | `/pages?slug=` render `content.rendered` |
| comments section | `/comments?post=` (real; empty state "Nessun commento") |

## Motion system (RICH — per user decision)

- Source of truth: `MOTION` export in `src/components/ui/glass.tsx`. NO ad-hoc springs.
- Page transitions: `template.tsx` per route group, fade+slide via MOTION spring; `AnimatePresence` mode "wait".
- Staggers capped: 45ms (grids) / 30ms (lists), max 8 / 6 items; `whileInView` + `viewport={{ once: true, margin: "-80px" }}`.
- Hero FX: `useScroll`-driven parallax on featured-hero, cyan (#00f2ff) glow pulse, headline letter-stagger.
- Cards: hover lift (−4px) + glass sheen sweep + thumbnail scale 1.05; `whileTap={{ scale: 0.97 }}`.
- Nav: active indicator with `layoutId` slide (desktop top nav + mobile bottom nav).
- Micro-interactions: like heart pop, skeleton→content crossfade, animated search expand.
- Animate transform/opacity only (60fps Android); `prefers-reduced-motion` via `MotionConfig reducedMotion="user"`.
- No animation that delays LCP image or SSR data display.

## Acceptance criteria

1. `grep -rn "picsum\|pravatar\|commondatastorage" src/` → 0 hits.
2. No fabricated views/likes/duration anywhere; real comment counts only.
3. Every data page renders bazziba.it content or an explicit empty state; data-layer node repro prints real counts.
4. Build passes with `--webpack`; 12-route smoke test 200s with real content.
5. Motion rules above verified in review (shared springs, caps, reduced-motion).
