# ADR-0001 — Liquid Glass 2026: material tokens, motion language, glass primitives

- **Status:** Accepted (normative for bazziba-next)
- **Date:** 2026-11-05
- **Author:** architect
- **Supersedes:** DESIGN.md v2.0 section "2026 Liquid Glass Design Language" (that section is kept as
  history; where the two disagree, this ADR wins)
- **Implements:** kanban `t_a7ebdb8f` (this spec), feeds `t_0a7667ed` (glass primitives) and
  `t_26fc7a21` (home + feed migration)
- **Scope:** `src/app/globals.css`, `tailwind.config.js`, `src/components/ui/**`.
  No page markup is changed by this ADR itself.

---

## 1. Context — verified current state

Everything in this section was measured against the working tree on 2026-11-05, not assumed.
Numbers are reproducible with the recipe in §11.

| # | Finding | Evidence | Consequence |
|---|---|---|---|
| C1 | Tailwind **v4.3.3** is installed (`tailwindcss` + `@tailwindcss/postcss`) but `src/app/globals.css` has **no `@config`, no `@theme`, no `@custom-variant`** | `src/app/globals.css:1-18`, `postcss.config.cjs` | the legacy `tailwind.config.js` is **silently ignored** |
| C2 | Compiling `globals.css` through the project's own PostCSS plugin emits **zero** `brand-yellow` / `brand-cyan` / `card` / `muted-foreground` / `border` rules | compile probe (see §11) | every themed class below resolves to nothing |
| C3 | `brand-cyan` **is not defined anywhere** — not in `tailwind.config.js`, not in `globals.css` | `tailwind.config.js:10-28` (`brand.*` has no `cyan`) | 22 call sites of `bg-/text-/ring-/shadow-brand-cyan*` render unaccented — the brand accent is currently invisible |
| C4 | Adding `@config "../../tailwind.config.js"` restores the config palette (`bg-brand-yellow` then compiles) | compile probe with `@config` | the v3→v4 break is a one-line fix, not a migration |
| C5 | `@custom-variant dark (&:where(.dark, .dark *))` works and emits `.dark\:…:where(.dark, .dark *)` | compile probe | class-based dark mode must be declared explicitly; `darkMode:"class"` in a legacy config is not the v4 mechanism |
| C6 | `.liquid-glass` and `.glass-card` are **referenced 13× across 8 files but defined nowhere** | `src/components/ui/index.tsx:72`, `src/app/upload/page.tsx:69,100`, `src/app/contest/page.tsx:134,144,152,160,198,249`, `src/app/contattaci/page.tsx:21`, `src/app/contattaci/contact-form.tsx:11`, `src/app/watch/[id]/page.tsx:295`, `src/components/homepage/featured-hero.tsx:179` | all "glass" surfaces today are flat and border-less |
| C7 | `container-max`, `hero-ambient`, `text-headline-lg` are used in `src/components/homepage/featured-hero.tsx` and defined nowhere | grep over `src/` and `public/` | hero layout is silently un-sized/un-styled |
| C8 | **No** raw `backdrop-filter`, `will-change`, `prefers-reduced-motion`, `prefers-reduced-transparency` anywhere in `src/` — but Tailwind `backdrop-blur*` utilities are live at 10 sites (sticky headers on `feed`, `feed/[type]`, `search`, `c/[slug]`, `u/[username]`, plus `navigation.tsx:8`, `mobile-bottom-nav.tsx:26`, `featured-hero.tsx:19`, `wp-homepage-content.tsx:122,129`) | grep over `src/` | no authored glass, no motion policy, no a11y fallbacks exist today; the live ad-hoc blurs are unbudgeted — they spend the §8 viewport budget before any glass is built |
| C9 | `framer-motion@13.4.0`, `class-variance-authority@0.7.1` are installed with **zero** usage | grep over `src/` | the motion + variant tooling is already on the bundle manifest; use it, add nothing |
| C10 | `Card`, `CardHeader`, `CardContent` from `src/components/ui/index.tsx` have **no call sites** | grep over `src/` | `Card` is dead weight — it is the migration lever, not a risk |

**Reading:** the app is mid-way through a v2→v3 migration that stopped at markup. Every glass
class name and every themed colour was written against tokens that were never actually emitted.
Nothing below is aesthetic preference — it is the completion of C3–C7.

**Re-verified 2026-11-05 against HEAD `6bd52ca`** ("FEAT: 2026 Liquid Glass migration + fix
Termux/Vercel production build", devops): C1–C10 were re-checked after that commit and all still
hold — it landed markup (hero/feed/search/watch/profile/footer/nav) without defining a single
token, glass class or primitive. It made C3 worse: `src/components/ui/index.tsx` gained 8 Button
variants whose `bg-brand-cyan` / `hover:bg-brand-cyan-hover` / cyan-glow shadow classes cannot
compile until Phase 0 lands. C5 is demonstrated with an `@apply` probe rather than a live class —
the only `dark:` call site (`about/page.tsx:19`) uses `prose-invert`, which needs the uninstalled
`@tailwindcss/typography`, so no `dark:` utility compiles today. §9.1 ratios were recomputed from
the WCAG 2.1 relative-luminance formula and match to two decimals.

---

## 2. Decisions

- **D1 — Token wiring.** Keep `tailwind.config.js` (v3 format) as the single theme source and wire it
  with `@config` in `globals.css`. Add `@custom-variant dark (&:where(.dark, .dark *))`.
  *Why:* C4/C5 prove both work under v4; a full `@theme` rewrite of 30+ call sites is a separate,
  larger change and is deferred to a follow-up ADR (§13).
- **D2 — Two token layers, deliberately.** Values that map 1:1 onto a Tailwind namespace live in
  `tailwind.config.js` (`colors`, `blur`, `borderRadius`, `boxShadow`, `transitionTimingFunction`,
  `animation`). The composite material recipe (tint + specular + edge light + sheen + scrim) lives
  as CSS custom properties and `.glass-*` classes in `globals.css`, because a multi-layer
  `box-shadow`/`::before` stack is not expressible as one utility class.
- **D3 — One primitive family.** New file `src/components/ui/glass.tsx` exports `GlassSurface`,
  `GlassCard`, `GlassButton`, `GlassNav` and `glassVariants` (CVA). `src/components/ui/index.tsx`
  re-exports them so `@/components/ui` stays the single import path (8 files import from it today).
- **D4 — Elevation, not "glass strength".** Four named tiers + overlay. Tier is picked by *role*
  (docked / card / hero / modal), never by per-call-site blur values.
- **D5 — Motion split.** CSS transitions for hover/press (no JS, no library), `framer-motion`
  springs for mount/unmount/gesture. Nothing animates on the server.
- **D6 — Performance budget is a rule, not advice.** ≤3 live `backdrop-filter` surfaces per viewport
  (§8), with nav and dock each counting as one.
- **D7 — Contrast floors with a scrim rule.** Light text on glass over a *photo* fails AA unless a
  scrim of α ≥ 0.75 is present (measured in §9).
- **D8 — Container.** `max-w-7xl` (1280px) is canonical; `container-max` becomes a real 1280px token.
  `navigation.tsx:9` keeps its 1600px — flagged as a hotspot (§13), not silently changed.

---

## 3. Phase 0 — token foundation repair (blocking, lands before any glass)

This is prerequisite work for `t_0a7667ed`, sequenced first. It is what makes every later step
visible.

**`src/app/globals.css` (head of file):**

```css
@config "../../tailwind.config.js";      /* v4: makes the legacy config actually load (C1/C4) */
@custom-variant dark (&:where(.dark, .dark *)); /* class-based dark mode (C5) */
@import "tailwindcss";
```

Drop the redundant `@reference "tailwindcss";` on line 1 (harmless either way; cosmetic).

**`tailwind.config.js` — add the `brand.cyan` scale (C3) and the semantic palette the app already
assumes (C2). These are additive; nothing existing is renamed.**

```js
colors: {
  // ...existing primary + brand.yellow untouched...
  brand: {
    cyan: "#00f2ff",
    cyanHover: "#00d4e6",
    cyanSoft: "rgba(0, 242, 255, 0.12)",
    cyanGlow: "rgba(0, 242, 255, 0.40)",
    gold: "#FFD700",
    goldHover: "#E6C200",
    navy: { 950: "#050a14", 900: "#080e1a", 800: "#0c1220", 700: "#111827", 600: "#1e2a3a" },
  },
  // semantic — enables the ~90 existing text-muted-foreground / border-border / bg-card usages
  background: "#050a14",
  foreground: "#f0f0f0",
  card: "#0c1220",
  "card-foreground": "#e8e8e8",
  muted: "#111827",
  "muted-foreground": "#9aa7b8",   /* 8.0:1 on glass — see §9; #6b7280 is 4.05:1 and FAILS */
  border: "#1e2a3a",
  input: "#1e2a3a",
  ring: "#00f2ff",
  accent: "rgba(0, 242, 255, 0.10)",
  "accent-foreground": "#00f2ff",
  secondary: "#111827",
  "secondary-foreground": "#e8e8e8",
  destructive: "#ef4444",
  "destructive-foreground": "#ffffff",
  "primary-foreground": "#050a14",
},
```

Also add the blur scale and radii used by D4 (§4) and the timing/easing scale (§5) to the same
config, so every primitive value is reachable as a utility:

```js
blur: { "glass-xs": "8px", "glass-sm": "12px", "glass-md": "16px", "glass-lg": "24px", "glass-xl": "32px" },
borderRadius: { "glass-card": "1.25rem", "glass-panel": "1.5rem" },
boxShadow: {
  "glass-1": "0 2px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.35)",
  "glass-2": "0 8px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(255,255,255,0.12)",
  "glass-3": "0 16px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(255,255,255,0.18)",
  "glass-4": "0 32px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.55)",
  "cyan-glow-1": "0 0 16px -2px rgba(0,242,255,0.40)",
  "cyan-glow-2": "0 0 28px -4px rgba(0,242,255,0.55)",
},
transitionTimingFunction: {
  "glass-out": "cubic-bezier(0.22, 1, 0.36, 1)",
  "glass-in-out": "cubic-bezier(0.76, 0, 0.24, 1)",
  "glass-spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
},
transitionDuration: { "glass-instant": "100ms", "glass-fast": "180ms", "glass-base": "260ms", "glass-slow": "420ms", "glass-exit": "200ms" },
```

**Acceptance for Phase 0:** compiling `globals.css` emits `bg-brand-cyan`,
`text-muted-foreground`, `border-border`, `bg-card` and `backdrop-blur-glass-md` (see §11).
`NODE_ENV=production node node_modules/next/dist/bin/next build --webpack` passes on Termux.

---

## 4. Deliverable 1 — Material tokens

Material tokens are CSS custom properties on `:root` in `globals.css`. They are consumed by the
`.glass-*` classes; primitives never hardcode them.

### 4.1 Blur radius (content-adaptive, capped)

| Token | Value | Used by |
|---|---|---|
| `--glass-blur-xs` | `8px` | chips, badges, in-card overlays |
| `--glass-blur-sm` | `12px` | docked nav, mobile bottom bar, sticky rails |
| `--glass-blur-md` | `16px` | default cards (`GlassCard`) |
| `--glass-blur-lg` | `24px` | hero panel, large feature card — **hard cap for repeated surfaces** |
| `--glass-blur-xl` | `32px` | full-screen modal scrim only |

Content adaptation is a *step*, not an interpolation: `[data-glass-context="media"]` (surface sits
over a video thumbnail) uses the next tier up once; nothing animates blur.

### 4.2 Translucency / fill

| Token | Value | Used by |
|---|---|---|
| `--glass-fill-docked` | `rgba(5, 10, 20, 0.55)` | nav, dock — always ≥ 0.55, they are always legible |
| `--glass-fill-card` | `rgba(8, 14, 26, 0.45)` | default card |
| `--glass-fill-raised` | `rgba(11, 20, 34, 0.62)` | hero panel, bento feature tile |
| `--glass-fill-overlay` | `rgba(5, 10, 20, 0.75)` | modal, sheet, popover |
| `--glass-fill-accent` | `rgba(0, 242, 255, 0.10)` | active/selected/featured tint |
| `--glass-scrim-media` | `linear-gradient(to top, rgba(5,10,20,0.88), rgba(5,10,20,0.75))` | mandatory under text on image-backed glass (§9) |

### 4.3 Specular highlight + edge light

| Token | Value | Notes |
|---|---|---|
| `--glass-specular-top` | `rgba(255, 255, 255, 0.55)` | `inset 0 1px 0` — the "wet edge" |
| `--glass-specular-bottom` | `rgba(255, 255, 255, 0.12)` | `inset 0 -1px 0` — never stronger than the top |
| `--glass-edge-hairline` | `1px solid rgba(255, 255, 255, 0.10)` | default border |
| `--glass-edge-light` | `1px solid rgba(0, 242, 255, 0.35)` | accent rim — focus/active/featured only |
| `--glass-sheen` | `linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 28%, transparent 58%)` | `::before`, `mix-blend-mode: screen`, `pointer-events: none` |

### 4.4 Refraction layers (count, not pixels)

`--glass-refraction-layers: 2` — exactly two: the **tint fill** and the **specular/sheen film**.
Hero/modal surfaces may take a third (`--glass-refraction-layers: 3`, adding the cyan rim light as a
separate `::after` ring so it can be toggled independently by focus state). No surface takes 4+;
nested glass compounds cost linearly (§8).

### 4.5 Elevation scale

| Tier | Radius | Blur | Fill | Shadow | Role |
|---|---|---|---|---|---|
| `docked` | 0 (full-bleed) | `sm` | `--glass-fill-docked` | `glass-1` + bottom hairline | header, mobile bottom nav |
| `card` | `1.25rem` | `md` | `--glass-fill-card` | `glass-2` | default `GlassCard` |
| `raised` | `1.5rem` | `lg` | `--glass-fill-raised` | `glass-3` | hero panel, bento hero tile |
| `overlay` | `1.5rem` | `xl` | `--glass-fill-overlay` | `glass-4` | modal, sheet, command palette |

Hover lift: `raised`/`card` translate `-2px` and step one shadow up; `docked` never lifts.
Accent glow (`cyan-glow-1/2`) is reserved for primary CTA and active state — it is not decoration.

---

## 5. Deliverable 2 — Motion language

Base currency: **CSS transitions** for anything hover/press-driven; `framer-motion` for
mount/unmount/gesture. Under `prefers-reduced-motion: reduce` every duration below collapses to
`0ms`/opacity-only (§9.3) — one global switch, no per-component work.

### 5.1 Durations

| Token | Value | Role |
|---|---|---|
| `--dur-instant` | `100ms` | press feedback, active pill swap |
| `--dur-fast` | `180ms` | hover, chip, icon |
| `--dur-base` | `260ms` | default enter/state change |
| `--dur-slow` | `420ms` | panel/sheet/overlay enter |
| `--dur-exit` | `200ms` | exit is always faster than enter |

### 5.2 Easings

| Token | Value | Role |
|---|---|---|
| `--ease-glass-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | default: hard decelerate, settles "wet" |
| `--ease-glass-in-out` | `cubic-bezier(0.76, 0, 0.24, 1)` | symmetric moves, drawer, reorder |
| `--ease-glass-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | overshoot for micro-interactions (toggle, FAB) |

### 5.3 Spring configs (framer-motion, `type: "spring"`)

```ts
export const MOTION = {
  enter:   { type: "spring", stiffness: 260, damping: 30, mass: 0.9 }, // cards/panels: y 8 -> 0, opacity 0 -> 1
  hover:   { type: "spring", stiffness: 420, damping: 28 },            // scale 1 -> 1.015, y 0 -> -2
  press:   { type: "spring", stiffness: 600, damping: 32 },            // scale -> 0.97
  page:    { type: "spring", stiffness: 180, damping: 26 },            // route/sheet transitions
} as const;
```

One shared `MOTION` object, exported from `src/components/ui/glass.tsx`. No ad-hoc springs per page.

### 5.4 Stagger rules

| Rule | Value |
|---|---|
| Grid/card step | `45ms` |
| Row/list step | `30ms` |
| Max visible stagger | `8` items (grid) / `6` items (list) — cap ≈ `360ms` / `180ms` |
| Behaviour after cap | remaining items appear instantly (never a long tail) |
| First paint | hero content animates; cards below the fold wait for `whileInView` (`viewport={{ once: true, margin: "-10%" }}`) |

Stagger is index-based (`delay: i * STEP`) and capped in code, not CSS `nth-child` chains — CSS
animation-delay cannot be capped or cancelled by reduced-motion at runtime.

---

## 6. Deliverable 3 — Component architecture

```
src/components/ui/glass.tsx        (new — GlassSurface, GlassCard, GlassButton, GlassNav, glassVariants, MOTION)
src/components/ui/index.tsx        (re-export glass.tsx; existing Button/Card/Badge/... untouched)
src/app/globals.css                (material tokens + .glass-* classes)
tailwind.config.js                 (Phase 0 palette + blur/radius/shadow/easing scales)
```

### 6.1 `GlassSurface` — the only place the recipe lives

```tsx
type GlassTier = "docked" | "card" | "raised" | "overlay";
interface GlassSurfaceProps extends HTMLAttributes<HTMLDivElement> {
  tier?: GlassTier;                 // default "card"
  accent?: boolean;                 // cyan edge-light + accent tint (active/featured)
  media?: boolean;                  // backdrop is an image -> forces the scrim layer (§9.2)
  as?: "div" | "section" | "article" | "aside" | "header";
}
```

Implementation contract: `isolation: isolate`; fill from `--glass-fill-*`; `box-shadow` from the
elevation scale; `::before` sheen (suppressed on `docked` for cost, per DESIGN.md v2's nav note);
`::after` cyan rim only when `accent`; scrim gradient when `media`; `pointer-events` untouched;
`className` merged last via `cn()` so call sites can still add utilities.

### 6.2 `GlassCard` = `GlassSurface` + hover/press behaviour

`GlassCard({ tier = "card", interactive = true, media, accent, delay })` — wraps `GlassSurface`,
adds the hover lift (`translateY(-2px)` + one shadow step, `--dur-fast`, `--ease-glass-out`) and
optional stagger entrance. `interactive={false}` for static panels (contest stats, FAQ) — no hover,
no lift, no motion. Forwarded ref.

### 6.3 `GlassButton` — extends the existing `Button`, does not replace it

Add `variant="glass"` (and `size="icon"` reuse) to the variant map in `src/components/ui/index.tsx`.
`variant="cyan"` stays the primary CTA and gains nothing — it is already the loudest element on the
page. `GlassButton` is a thin alias: `Button` with `variant="glass"` and the new token classes.
Existing 12 variants and their 30+ call sites are **not** touched.

### 6.4 `GlassNav` — docked surface + scroll response

`GlassNav({ brand, links, actions, condensed })`: `GlassSurface tier="docked"`, `backdrop-blur`
`sm`, `border-b` hairline; on `scrollY > 8` adds `--glass-fill-docked` → `rgba(5,10,20,0.78)` and
drops height 4px. Scroll listener is a single passive `useEffect` in one component — never one per
page. Mobile drawer keeps its current markup; it gains the docked tier only.

### 6.5 Rules

- Every primitive is typed, forwards `ref`, and merges `className` via `cn(` from
  `src/lib/utils.ts` — no new utilities.
- Every primitive carries a one-line usage comment (acceptance criterion for `t_0a7667ed`).
- No data logic in `src/components/ui/**`. All data paths stay on the WP REST API
  (`https://bazziba.it/wp-json`, as in `src/data/wp.ts` and `src/lib/api.ts`) — **zero mock data**.
- Server components keep motion out: `GlassSurface`/`GlassCard`/`GlassNav` render server-side; only
  `GlassCard interactive` and `GlassNav` scroll behaviour need `"use client"` (framer-motion hook).

---

## 7. Deliverable 4 — Layering model over `#050a14`

| Layer | z-token | Contents | Treatment |
|---|---|---|---|
| 0 base | `--z-base: 0` | `#050a14` | body radial gradient already in `globals.css` (cyan `0.04` @ 20%/30%, teal `0.02` @ 80%/70%) |
| 1 ambient | `--z-ambient: 1` | two `blur-3xl` cyan blobs, `pointer-events-none` | `bg-brand-cyan/5` + `/3`, `animate-pulse` — never blocks input, never blur-filtered itself |
| 2 content | `--z-content: 10` | page rows, grids, prose | flat, `#0a0e1a` — deliberately not glass |
| 3 glass | `--z-glass: 20` | hero panel, `GlassCard` | tier `raised`/`card` |
| 4 docked | `--z-docked: 30` | `GlassNav` header | tier `docked` |
| 5 overlay | `--z-overlay: 40` | mobile bottom nav, player control dock | `docked` + scrim-free, no sheen |
| 6 modal | `--z-modal: 50` | sheets, dialogs, command palette | `overlay` + `xl` blur scrim behind |
| 7 toast | `--z-toast: 60` | `sonner` Toaster (already in `src/app/layout.tsx`) | untouched |

Rules: glass never sits directly on glass (max 2 deep); the base stays `#050a14` in **both** themes
(the app is dark-first and `html[class=dark]` is set server-side in `src/app/layout.tsx:72`); every
`GlassCard` gets its own ambient separation from the layer below via shadow, not via a second fill.

---

## 8. Deliverable 5 — Performance budget

**Why it is a rule:** `backdrop-filter` re-rasterises the backdrop on every paint of the scrolling
container. On the feed (`/feed/[type]`, `/`) with N glass cards the cost is N blurs per frame, and
`backdrop-filter` cannot be cheaply shared by sibling elements.

| Rule | Limit | Enforcement |
|---|---|---|
| Live `backdrop-filter` surfaces per viewport | **3** (nav + dock count as 1 each, so usually 1 free slot) | review-time DOM count per route; recorded in the migration PR |
| Blur radius | `≤ 24px` on repeated surfaces; `32px` only for a full-screen modal scrim | `--glass-blur-lg` cap |
| Nesting depth | ≤ 2 glass surfaces | structural review |
| Animated properties | `transform`, `opacity` **only** — never `backdrop-filter`, `filter`, `box-shadow`, `width`, `height` | lint + review |
| `will-change` | `transform, opacity`, applied **only for the duration of a gesture** (framer-motion lifecycle), removed on complete; never in a CSS class | no CSS `will-change` anywhere |
| Sheen `::before` | suppressed on `docked` and on any surface inside a scrolling list | `[data-tier="docked"]::before { display: none }` |
| Mobile | `≤ 8px` blur below `640px` | `@media (max-width: 640px)` override |

**Long lists (this is the real budget):** a route with a list of N cards must pick one of:

1. **N ≤ 12** — `GlassCard` tier `card` per item, blur `md`, no sheen. This is the default.
2. **N > 12** (feed grid, search results, category pages) — **one** `GlassSurface` panel per group
   (tier `card`, blur `sm`, `--glass-refraction-layers: 1`, no inner shadows) containing flat items;
   individual rows use `bg-brand-navy-800/60` + hairline, not glass.
3. **N > 40** — flat cards with `content-visibility: auto` and `contain-intrinsic-size`, no glass at
   all; glass is reserved for the framing panel.

Current state after `6bd52ca`: `.streamtube-card` — still defined at `globals.css:65-77` with the
spec-matching `0.3s` / `translateY(-2px)` transition — survives only in `globals.css` and
`src/components/homepage/wp-homepage-content.tsx`. `video-card.tsx` and the feed pages were
rewritten with ad-hoc arbitrary values (`bg-[#0a0e1a] border-white/5 rounded-xl`, no transition
token); rule 1 applies to them and the migration card replaces those values with `GlassCard`. Note
that the 10 live `backdrop-blur*` surfaces from C8 are already spending this budget before any
glass exists.

---

## 9. Deliverable 6 — Accessibility

### 9.1 Contrast floors (measured, not estimated)

Ratios computed with the WCAG 2.1 relative-luminance formula against each glass fill composited over
the `#050a14` page base:

| Text | on `docked` (α .55) | on `card` (α .45) | on `overlay` (α .75) | Verdict |
|---|---|---|---|---|
| body `#f0f0f0` | 17.38 | 17.18 | 17.38 | AA ✓ |
| muted `#9aa7b8` | 8.11 | 8.01 | 8.11 | AA ✓ |
| muted `#6b7280` (gray-500 — still live at `globals.css:189,288`) | 4.10 | 4.05 | 4.10 | **fails 4.5:1** |
| accent `#00f2ff` | 14.29 | 14.12 | 14.29 | AA ✓ |
| `#050a14` on `#00f2ff` (button label) | 14.29 | — | — | AA ✓ |
| focus ring `#00f2ff` vs surface | — | 14.12 | 14.29 | AA ✓ |

**Floors:** body text ≥ 4.5:1 (use `#f0f0f0`, 17:1); secondary/muted ≥ 4.5:1 (use `#9aa7b8`,
8.0:1 — **`#6b7280` is banned**); large text and UI components ≥ 3:1; non-text (focus ring, accent
border) ≥ 3:1. Do not lighten `--muted-foreground` further than `#9aa7b8` — the margin to 4.5:1 is
already the safety net for the bright-backdrop case below. `#6b7280` is not a hypothetical: it is
live today at `globals.css:189` (`.streamtube-card .meta .author`, 12px) and `globals.css:288`
(`.section-header .count`, ~13px) — both are small-text AA failures that the token commit must
delete, not merely avoid in new work.

### 9.2 The scrim rule (glass over media)

Measured against a blown-out thumbnail behind glass (`#c9d6e2` photo, 45% tint over it):

| scrim α | body `#f0f0f0` | muted `#9aa7b8` | accent `#00f2ff` |
|---|---|---|---|
| 0.00 | 2.18 | 1.02 | 1.79 |
| 0.55 | 7.17 | 3.34 | 5.89 |
| **0.75** | **11.50** | **5.36** | **9.45** |
| 0.88 | 14.84 | 6.92 | 12.20 |

So: **any `GlassSurface media` (or any glass whose backdrop contains an image) must apply
`--glass-scrim-media` before text is placed on it.** α 0.75 is the floor; 0.88 for small text
(< 14px). This applies directly to the hero in
`src/components/homepage/featured-hero.tsx` (title, stats, CTA sit over a thumbnail) and to any
thumbnail overlay.

### 9.3 `prefers-reduced-motion: reduce`

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

plus, in JS: `useReducedMotion()` from framer-motion drives `MOTION` to
`{ duration: 0 }` and stagger delays to `0`; entrance becomes opacity-only; sheen/pointer tracking
never starts. (There is currently **no** `prefers-reduced-motion` handling anywhere in `src/` — C8.)

### 9.4 `prefers-reduced-transparency: reduce`

```css
@media (prefers-reduced-transparency: reduce) {
  .glass, [data-glass-tier] {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    background: rgba(5, 10, 20, 0.94);   /* solid navy */
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  }
  .glass::before, .glass::after { display: none; }
}
```

### 9.5 Other

- Focus: `:focus-visible` only, 2px `--glass-edge-light` ring + 2px offset, never removed.
- Targets ≥ 44×44px (mobile bottom nav already 64px tall; FAB 56px).
- Keyboard: mobile drawer is a labelled `nav` with `aria-expanded`; Escape closes.
- Icon-only controls keep `aria-label` (existing convention in `navigation.tsx`).
- Sheen and specular are purely decorative — `pointer-events: none`, `aria-hidden`.

---

## 10. Migration map (what `t_0a7667ed` then `t_26fc7a21` swap)

| Current (file:line) | Becomes |
|---|---|
| `liquid-glass` — `src/components/ui/index.tsx:72` (`Card`), `src/app/upload/page.tsx:69` | `<GlassSurface tier="raised">` |
| `glass-card` — `src/app/contest/page.tsx` ×6, `src/app/contattaci/page.tsx:21`, `contact-form.tsx:11`, `src/app/upload/page.tsx:100`, `src/app/watch/[id]/page.tsx:295`, `src/components/homepage/featured-hero.tsx:179` | `<GlassCard>` (or `interactive={false}` for static panels) |
| `container-max` — `featured-hero.tsx:82` | `.container-max { max-width: 80rem; padding-inline: 1.5rem }` |
| `text-headline-lg` / `hero-ambient` — `featured-hero.tsx:112,75` | Headline LG = `Poppins 600 / 36-40px / -0.02em` per DESIGN.md v2 typography; ambient = the layer-1 blob block, promoted into a real `@keyframes`-free CSS class |
| per-surface `bg-white/5`/`border-white/10` on new work | `GlassSurface` tiers — no new ad-hoc glass |

In scope for the migration card: home hero + video cards on `GlassSurface`/`GlassButton`/`GlassNav`,
spring entrances with capped stagger, reduced-motion honoured. Out of scope: any change to data
fetching, any new route, any rename of existing utilities.

---

## 11. Verification recipe (cheap, no build)

The token claims in §1 and the acceptance criteria in §3 are checkable without a full Next build —
compile the real stylesheet through the project's own PostCSS plugin and assert on the output:

```js
// one-off probe; runs in seconds on Termux. cwd MUST be the repo root
// (v4 source detection follows the process CWD — elsewhere it emits preflight only).
const fs = require("fs"), path = require("path");
const REPO = process.cwd();                       // ~/projects/bazziba-next
const postcss = require(path.join(REPO, "node_modules/postcss/lib/postcss"));
const tw = require(path.join(REPO, "node_modules/@tailwindcss/postcss/dist/index.js"));
const css = fs.readFileSync(path.join(REPO, "src/app/globals.css"), "utf8");

async function compile(label, source) {
  const r = await postcss([tw()]).process(source, { from: path.join(REPO, "src/app/globals.css") });
  const has = (s) => r.css.includes(s);
  console.log(label, {
    "bg-brand-cyan": has("bg-brand-cyan"),
    "text-muted-foreground": has("text-muted-foreground"),
    "border-border": has(".border-border"),
    "bg-card": has(".bg-card"),
    "backdrop-blur-glass-md": has("backdrop-blur-glass-md"),
    ".glass-card": has(".glass-card"),
    "dark-variant-selector": has("where(.dark"),
  });
}
(async () => {
  await compile("A as-is:            ", css);
  await compile("B +@config:         ", '@config "../../tailwind.config.js";\n' + css);
  await compile("C +@config+darkvar: ", '@config "../../tailwind.config.js";\n@custom-variant dark (&:where(.dark, .dark *));\n' + css);
})();
```

**Executed 2026-11-05 against HEAD `6bd52ca`** — actual output (every acceptance token ✗ before
Phase 0, which is the point of the probe):

| Probe | bg-brand-cyan | text-muted-foreground | border-border | bg-card | backdrop-blur-glass-md | .glass-card | dark selector |
|---|---|---|---|---|---|---|---|
| A (as-is) | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| B (+`@config`) | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| C (+`@config` + dark variant) | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |

B additionally compiles `bg-brand-yellow` — that is C4, proven. The dark-variant selector in C is
demonstrated via `@apply dark:bg-white` (no live `dark:` utility exists today — §1 re-verification
note). After Phase 0 lands, the same probe must show ✓ on every acceptance column. Then the real
build gate:

```
cd ~/projects/bazziba-next && rm -rf .next && NODE_ENV=production node node_modules/next/dist/bin/next build --webpack
```

Pass criteria: build clean, and the compiled CSS contains `.glass-card`, `bg-brand-cyan`,
`text-muted-foreground`.

---

## 12. Acceptance criteria for this ADR

1. `globals.css` loads `tailwind.config.js` via `@config` and declares the `dark` variant.
2. All material/motion tokens in §4–§5 exist in `tailwind.config.js` + `globals.css`, with the exact
   names used above (no synonyms, no second spelling).
3. `src/components/ui/glass.tsx` exports `GlassSurface`, `GlassCard`, `GlassButton`, `GlassNav`,
   `glassVariants`, `MOTION`; re-exported from `src/components/ui/index.tsx`.
4. `.glass-card` / `.glass-nav` exist as classes (raw-class call sites in §10 keep working during the
   incremental migration).
5. Build passes; verification recipe in §11 passes.
6. Zero mock data introduced; all data paths remain the WP REST API.

---

## 13. Follow-ups and hotspots

- **Follow-up (new card):** migrate `tailwind.config.js` → `@theme` in `globals.css` (v4-native),
  delete the JS config. Blocked on Phase 0 landing; do it as its own ADR so the diff stays reviewable.
- **Follow-up (new card):** unify the container — `navigation.tsx:9` uses `max-w-[1600px]`, six pages
  use `max-w-7xl`. Decide 1280 vs 1440 as a single `container-max`.
- **Hotspot — `src/app/globals.css`:** clean at HEAD `6bd52ca`, and it is the single file where
  Phase 0 tokens, the `.glass-*` classes, the body-gradient layering (§7) and the two failing
  `#6b7280` rules (§9.1) all land. Both halves must ship in **one** commit on top of `6bd52ca` so
  there is no window where either half is broken.
- **Hotspot — `DESIGN.md`:** clean at HEAD `6bd52ca` (its v2 edits landed in that commit). This ADR
  deliberately does **not** edit it; the v3 restructure (renaming the v2 "Liquid Glass Design
  Language" section → "superseded by ADR-0001") should land as a dedicated doc card so the two do
  not collide.
- **Note:** `dark:` variant support is only needed by `src/app/about/page.tsx:19`
  (`prose dark:prose-invert`, which also needs `@tailwindcss/typography` — not installed, so that
  class is currently inert regardless). Not blocking for this ADR.
