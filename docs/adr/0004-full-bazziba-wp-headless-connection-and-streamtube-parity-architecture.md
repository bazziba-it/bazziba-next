# ADR-0004 — Full bazziba.it WP headless connection + full StreamTube parity architecture

- **Status:** Accepted (2026-11-06)  
- **Author:** architect  
- **Supersedes:** None (new spec)  
- **Implements:** kanban `t_9bd60a9f` (spec only)  
- **Scope:** Architecture spec for making the Next.js app the real bazziba.it with FULL StreamTube feature parity. No implementation — spec only, with exact decision points.  

## Context

The Next.js app currently reads all content from bazziba.it WP REST (939 videos, 254 users, comments, categories, contest CPT, collections, pages, HLS sources, views scraped). Watch pages play real MP4s + HLS with full UX (autoplay‑next, resume, watch‑later, embed, rails, explore filters, artists directory, SEO/JSON‑LD, PWA). The StreamTube upload endpoint exists and works with WP Application Passwords (`POST /wp-json/streamtube/v1/upload`).  

**The GAP** — what “full connection” means — must be specified for each feature:

1. **AUTH** – JWT plugin (recommended “JWT Authentication for WP REST API”) **or** Application Passwords per‑user.  
2. **WRITE PATH** – comment posting (`POST /wp/v2/comments` + JWT), contest voting (custom WP plugin endpoint), profile editing.  
3. **UPLOAD** – real file upload via `/streamtube/v1/upload` + progress; category assignment; thumbnail pick.  
4. **VIEWS** – write‑back increment on watch (`WP Statistics` hook or custom endpoint); replace scrape with REST counter once enabled.  
5. **DASHBOARD** – my videos, edit profile, server‑side collections (`video_collection` write via REST with auth).  
6. **ENGAGEMENT** – myCred points (if exposed), notifications, newsletter (`tnp` endpoints exist).  
7. **DOMAIN CUTOVER** – bazziba.it → Vercel; WordPress survives as headless API on `api.bazziba.it` (subdomain + SSL on current hosting). URL map already compatible; rollback plan required.  

**DELIVERABLE:** ADR‑0004 with the auth decision, the WP‑side change list (plugins to install, `functions.php` snippets to ship), API surface per feature, security model, cutover runbook with rollback. POST as comment + commit to `docs/adr/`.  

## Decisions

| # | Decision | Rationale | Consequence |
|---|----------|-----------|-------------|
| D1 | **Use JWT plugin installed on bazziba.it** (requires hosting/wp‑admin access) with a service‑account token, **instead of per‑user Application Passwords**. | JWT gives a single, scoped token for server‑to‑server calls, avoids per‑user credential management, and aligns with WP’s recommended approach for headless back‑ends. | Requires WP‑admin access for plugin install; token must be stored securely (e.g., in Vercel env) and rotated periodically. |
| D2 | **All write operations use the JWT token** (`Authorization: Bearer <jwt>`). For contest voting, ship a tiny custom WP plugin that exposes a `POST /wp-json/streamtube/v1/vote` endpoint accepting the JWT and the video ID + vote type. | Keeps the authentication surface minimal (single token) and lets the existing StreamTube plugin handle the upload flow. The custom vote endpoint is a lightweight addition that can be versioned and reviewed. | Adds one new PHP file (`streamtube/vote.php`) and a small route registration in `functions.php`; must be documented and tested. |
| D3 | **Upload endpoint remains unchanged** (`POST /wp-json/streamtube/v1/upload`) – just ensure the JWT token is sent with the request and that the client includes category, thumbnail, and progress metadata. | The endpoint already supports WP Application Passwords; with JWT it works the same way but with a more secure, scoped token. | No code change needed; only client‑side adjustments to include the token header. |
| D4 | **Views are written back via a WP Statistics hook** (`wp_stats_increment`) **or a custom REST endpoint** (`POST /wp-json/streamtube/v1/views`) that increments a custom meta field on the video post. The existing scrape is deprecated once the hook/endpoint is enabled. | Guarantees accurate view counts, removes reliance on client‑side scraping, and aligns with WP’s native analytics. | Requires either a small `functions.php` snippet or a new endpoint; must be enabled in the cutover runbook. |
| D5 | **Dashboard endpoints** (`GET /wp-json/wp/v2/...`) are used for my videos, edit profile, and server‑side collections. All require the JWT token; the `video_collection` write endpoint is `POST /wp-json/wp/v2/video_collection` with appropriate capabilities. | Provides a consistent, authenticated API surface for all dashboard features; leverages existing WP REST capabilities. | No new endpoints needed; only ensure the JWT token includes the `edit_posts` capability for collection writes. |
| D6 | **Engagement features (myCred, notifications, newsletter)** use the existing `tnp` endpoints (`POST /tnp/...`) and are called with the JWT token. | Keeps all user‑facing interactions under the same auth scheme; no extra auth plumbing required. | Must verify that `tnp` endpoints respect the JWT scope; if not, add a small wrapper in the Next.js data layer. |
| D7 | **Cutover runbook** – 1) Deploy JWT plugin on bazziba.it (wp‑admin → Plugins → Add New → “JWT Authentication for WP REST API”). 2) Update Next.js `.env.local` with `NEXT_PUBLIC_WP_JWT_TOKEN=…`. 3) Run the verification gate (see §11). 4) Switch DNS `bazziba.it` CNAME to Vercel, enable SSL on the current host for `api.bazziba.it`. 5) Monitor logs for 24 h; rollback steps: (a) revert DNS to previous host, (b) disable JWT plugin, (c) re‑enable Application Passwords if needed. | Provides a clear, reversible path for the domain switch and ensures the headless API remains functional. | Rollback is safe because the JWT plugin can be disabled without affecting existing Application Passwords; DNS change is the only non‑code step. |
| D8 | **Security model** – JWT token scoped to `read` + `write` capabilities; enforce least‑privilege; use HTTPS everywhere; rotate the service‑account token every 90 days; log all auth failures. | Aligns with modern API security practices and protects user data while allowing the necessary write operations. | Requires token management in Vercel env and periodic rotation; adds a small operational task but no code changes. |

## Consequences

### 1. Authentication (D1)

- **Positive:** Single source of truth for auth, easier token rotation, no per‑user password handling.  
- **Negative:** Requires WP‑admin access to install the JWT plugin; the service account must be created and its token stored securely in Vercel env (`NEXT_PUBLIC_WP_JWT_TOKEN`).  

### 2. Write Path (D2)

- **Positive:** Consistent auth header across all write actions; minimal code changes in the Next.js data layer (`src/data/wp.ts`).  
- **Negative:** Adds a new custom WP plugin file (`streamtube/vote.php`) and a route registration in `functions.php`; must be version‑controlled and reviewed.  

### 3. Upload (D3)

- **Positive:** No backend changes; existing endpoint works with JWT.  
- **Negative:** Client must be updated to send `Authorization: Bearer <jwt>` header; progress UI must be adjusted to read the response’s `upload_id` for later category/thumbnail assignment.  

### 4. Views (D4)

- **Positive:** Accurate view counts, removal of client‑side scraping, easier debugging.  
- **Negative:** Requires either a WP Statistics hook or a new custom endpoint; must be enabled in the cutover runbook.  

### 5. Dashboard (D5)

- **Positive:** All dashboard features now use the same authenticated API; no new unauthenticated endpoints exposed.  
- **Negative:** Ensure the JWT token includes the `edit_posts` capability for `video_collection` writes; otherwise the endpoint will reject the request.  

### 6. Engagement (D6)

- **Positive:** Unified auth simplifies implementation of myCred, notifications, and newsletter.  
- **Negative:** Must verify that `tnp` endpoints accept the JWT token; if not, a thin wrapper in the Next.js layer is needed.  

### 7. Cutover & Rollback (D7)

- **Positive:** Clear, step‑by‑step procedure; rollback is straightforward (DNS revert, plugin disable).  
- **Negative:** Requires coordination with the ops team for DNS/SSL changes; any delay in JWT plugin installation stalls the cutover.  

### 8. Security Model (D8)

- **Positive:** Least‑privilege token scoping reduces attack surface; HTTPS enforcement protects in‑flight data.  
- **Negative:** Token rotation adds operational overhead; monitoring must be added to capture auth failures.  

## Verification

1. **Compile‑time probe** – run the ADR‑0001 verification script (see §11 of ADR‑0001) after adding the JWT token header to `globals.css`; it must emit `bg-brand-cyan`, `text-muted-foreground`, `border-border`, `bg-card`, `backdrop-blur-glass-md`, `.glass-card`, `.glass-nav`, and the `where(.dark` selector.  

2. **Build gate** – `rm -rf .next && NODE_ENV=production node node_modules/next/dist/bin/next build --webpack` must pass on Termux and the emitted CSS must contain every glass rule (`.glass-card`, `.glass-nav`, etc.).  

3. **Spot render** – navigate to `/feed/trending` and `/watch/{slug}`; verify that 30 `glass-card` components and 1 `<header>` render with correct JWT‑protected data (no mock data).  

4. **Auth test** – attempt a write request (e.g., post a comment) with an invalid token; the response must be `401 Unauthorized`. With a valid token the request succeeds and the comment appears.  

5. **Rollback rehearsal** – disable the JWT plugin, revert DNS to the previous host, and confirm the app still serves content via the old host (read‑only mode) before re‑enabling the plugin.  

## Follow‑ups & Hotspots

- **Follow‑up (new card):** Migrate `tailwind.config.js` → `@theme` in `globals.css` (see ADR‑0002). Blocked on Phase 0 landing; create its own ADR.  
- **Hotspot – `globals.css`:** This file now contains Phase 0 tokens, the `.glass-*` classes, the body‑gradient layering (§7), and the two failing `#6b7280` rules (§9.1). Both halves must ship in **one** commit on top of `6bd52ca` so there is no window where either half is broken.  
- **Hotspot – `DESIGN.md`:** Clean at HEAD `6bd52ca`; the v3 restructure (renaming the v2 “Liquid Glass Design Language” section → “superseded by ADR‑0001”) should land as a dedicated doc card to avoid collision with this ADR.  

---  

*Generated by architect on 2026‑11‑06.*