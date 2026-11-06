# ADR-0002 — Migrate the Tailwind v3 JS config to v4-native `@theme`

- **Status:** Accepted (normative for bazziba-next)
- **Date:** 2026-11-06
- **Author:** architect
- **Amends:** ADR-0001 decision **D1** (the `@config` bridge). The rest of ADR-0001 stands;
  where the two disagree, this ADR wins on the *mechanism* only — every token value is unchanged.
- **Implements:** kanban `t_95ee40b9` (this spec). The cutover itself is a separate developer card.
- **Scope:** `src/app/globals.css`, `tailwind.config.js` (deleted), and a fixed list of call-site
  spelling sweeps (§6). No visual change is permitted: this is a same-output migration.

---

## 1. Context — verified current state (HEAD `83f3a07`)

ADR-0001 D1 chose the `@config "../../tailwind.config.js"` bridge because a probe showed it
registers the legacy theme. That probe told half the story. The full, re-verified truth:

| # | Finding | Evidence | Consequence |
|---|---------|----------|-------------|
| A1 | The bridge **works for candidate-detected classes**: every config token used in `src/**` compiles (`bg-brand-cyan`, `text-muted-foreground`, `backdrop-blur-glass-md`, …) | probe: compile `globals.css` through `@tailwindcss/postcss`, cwd = repo root | the site works today — nothing here is an emergency fix |
| A2 | The bridge **fails for `@apply`**: `@apply bg-brand-yellow` → `Cannot apply unknown utility class` | probe B in the t_0a7667ed handoff, reproduced | any future `@apply` of a theme token is a silent trap |
| A3 | camelCase config keys produce **camelCase class names** (`brand.cyanHover` → `bg-brand-cyanHover`), while pre-ADR call sites use the kebab spelling (`bg-brand-cyan-hover`, `shadow-brand-cyan-glow`) which is **inert today** — 22+ call sites carry dead accent classes (ADR-0001 C3) | grep `brand-cyan-hover` / `brand-cyan-glow` in `src/` | two spellings exist for one token; exactly what §12.2 bans |
| A4 | `tailwind.config.js` and `globals.css` are **two theme sources**: JS keys for utilities, `:root` custom properties for the glass recipe | both files | drift risk on every token edit |
| A5 | `@theme` natively registers everything the bridge registers, **including `@apply` support** | probe D in the t_0a7667ed handoff | the native path has no functional downside |
| A6 | `darkMode: "class"` in the JS config is already superseded by `@custom-variant dark (&:where(.dark, .dark *))` in `globals.css` (ADR-0001 D1) | `globals.css:2` | deleting the config loses nothing |
| A7 | `content: [...]` globs in the JS config are redundant — v4 automatic source detection scans the repo from the CSS root | ADR-0001 §11 probe runs with no `content` config | deleting the config loses nothing |
| A8 | `.animate-fade-in` is defined **twice by hand** in `globals.css` (lines ~16 and ~325, with two different keyframes `fade-in` vs `fadeIn`) while the config also defines `animation.fade-in` | `globals.css` | triple spelling of one animation; the cutover dedupes it |
| A9 | `next/font` sets `--font-sans` / `--font-display` on `<body>` (`layout.tsx:10,14,76`); `globals.css` `@layer base` consumes them | `layout.tsx`, `globals.css:29,41` | `@theme` font entries must reference the same variable names (§3.4) |

## 2. Decision

**D1 — Single source of truth: `@theme` in `globals.css`.** Every token in
`tailwind.config.js` moves to one `@theme` block in `src/app/globals.css`. Then
`tailwind.config.js` is **deleted** and the `@config` line is removed from `globals.css`.
The `@custom-variant dark` line stays (A6).

**D2 — Canonical spelling is kebab-case.** The 9 camelCase keys
(`yellowHover`, `cyanHover`, `cyanSoft`, `cyanGlow`, `goldHover`,
`darkCard`, `darkBorder`, `darkText`, `darkTextMuted`) are renamed to kebab CSS variables
(`--color-brand-cyan-hover`, …). The kebab spelling is the one most call sites already use
(A3), so the rename *activates* dead classes rather than breaking live ones. The call-site
sweep for the few camelCase spellings that ARE live today is enumerated exhaustively in §6 —
no other rename is allowed anywhere (§12.2 of ADR-0001).

**D3 — Same-output guarantee.** Acceptance is a compiled-CSS diff, not vibes: every utility
that compiles before the cutover must compile after it, with the same declarations (§7).

**D4 — The glass recipe in `:root` / `@layer components` is untouched.** `--glass-fill-*`,
`--glass-blur-*` (the recipe's own vars), z-tokens, duration/easing CSS vars are deliberately
NOT theme tokens (ADR-0001 D2) and stay exactly as they are.

## 3. Complete token mapping

Every entry in `tailwind.config.js` maps to exactly one `@theme` entry. `−` = unchanged
spelling; `→` = D2 kebab rename.

### 3.1 Colors → `--color-*`

| JS key (v3) | `@theme` variable | Value |
|---|---|---|
| `primary.50…950` (11 keys) | `--color-primary-50 … --color-primary-950` | `#f0f9ff #e0f2fe #bae6fd #7dd3fc #38bdf8 #0ea5e9 #0284c7 #0369a1 #075985 #0c4a64 #082f49` (same order) |
| `brand.yellow` | `--color-brand-yellow` | `#FFD700` |
| `brand.yellowHover` | → `--color-brand-yellow-hover` | `#FFC107` |
| `brand.dark` | `--color-brand-dark` | `#0f0f11` |
| `brand.darkCard` | → `--color-brand-dark-card` | `#1a1a1e` |
| `brand.darkBorder` | → `--color-brand-dark-border` | `#2a2a32` |
| `brand.darkText` | → `--color-brand-dark-text` | `#e0e0e5` |
| `brand.darkTextMuted` | → `--color-brand-dark-text-muted` | `#a0a0a8` |
| `brand.cyan` | `--color-brand-cyan` | `#00f2ff` |
| `brand.cyanHover` | → `--color-brand-cyan-hover` | `#00d4e6` |
| `brand.cyanSoft` | → `--color-brand-cyan-soft` | `rgba(0, 242, 255, 0.12)` |
| `brand.cyanGlow` | → `--color-brand-cyan-glow` | `rgba(0, 242, 255, 0.40)` |
| `brand.gold` | `--color-brand-gold` | `#FFD700` |
| `brand.goldHover` | → `--color-brand-gold-hover` | `#E6C200` |
| `brand.navy.950…600` (5 keys) | `--color-brand-navy-950 … --color-brand-navy-600` | `#050a14 #080e1a #0c1220 #111827 #1e2a3a` (same order) |
| `background` | `--color-background` | `#050a14` |
| `foreground` | `--color-foreground` | `#f0f0f0` |
| `card` | `--color-card` | `#0c1220` |
| `card-foreground` | `--color-card-foreground` | `#e8e8e8` |
| `muted` | `--color-muted` | `#111827` |
| `muted-foreground` | `--color-muted-foreground` | `#9aa7b8` |
| `border` | `--color-border` | `#1e2a3a` |
| `input` | `--color-input` | `#1e2a3a` |
| `ring` | `--color-ring` | `#00f2ff` |
| `accent` | `--color-accent` | `rgba(0, 242, 255, 0.10)` |
| `accent-foreground` | `--color-accent-foreground` | `#00f2ff` |
| `secondary` | `--color-secondary` | `#111827` |
| `secondary-foreground` | `--color-secondary-foreground` | `#e8e8e8` |
| `destructive` | `--color-destructive` | `#ef4444` |
| `destructive-foreground` | `--color-destructive-foreground` | `#ffffff` |
| `primary-foreground` | `--color-primary-foreground` | `#050a14` |

### 3.2 Typography

| JS key | `@theme` variable | Value |
|---|---|---|
| `fontFamily.sans` | `--font-sans` | `"Inter", system-ui, sans-serif` (see §3.4) |
| `fontFamily.display` | `--font-display` | `"Poppins", "Inter", system-ui, sans-serif` (see §3.4) |
| `fontSize.headline-lg` | `--text-headline-lg` | `2.5rem` |
| 〃 line-height | `--text-headline-lg--line-height` | `3rem` |
| 〃 letter-spacing | `--text-headline-lg--letter-spacing` | `-0.02em` |
| 〃 font-weight | `--text-headline-lg--font-weight` | `600` |

### 3.3 Elevation, blur, radii, motion

| JS key | `@theme` variable | Value |
|---|---|---|
| `boxShadow.video-card` | `--shadow-video-card` | `0 4px 12px rgba(0, 0, 0, 0.15)` |
| `boxShadow.video-card-dark` | `--shadow-video-card-dark` | `0 4px 12px rgba(0, 0, 0, 0.4)` |
| `boxShadow.player-shadow` | `--shadow-player-shadow` | `0 8px 32px rgba(0, 0, 0, 0.3)` |
| `boxShadow.glass-1…4` | `--shadow-glass-1 … --shadow-glass-4` | exact ADR-0001 §3 values, unchanged |
| `boxShadow.cyan-glow-1/2` | `--shadow-cyan-glow-1`, `--shadow-cyan-glow-2` | exact ADR-0001 §3 values, unchanged |
| `blur.glass-xs…xl` | `--blur-glass-xs … --blur-glass-xl` | `8px 12px 16px 24px 32px` |
| `borderRadius.glass-card` | `--radius-glass-card` | `1.25rem` |
| `borderRadius.glass-panel` | `--radius-glass-panel` | `1.5rem` |
| `transitionTimingFunction.glass-*` | `--ease-glass-out`, `--ease-glass-in-out`, `--ease-glass-spring` | exact ADR-0001 §5.2 values |
| `transitionDuration.glass-*` | `--transition-duration-glass-instant … --transition-duration-glass-exit` | `100ms 180ms 260ms 420ms 200ms` |

### 3.4 Aspect + animation

| JS key | `@theme` variable | Value |
|---|---|---|
| `aspectRatio.16-9 / 4-3 / 1-1` | `--aspect-16-9`, `--aspect-4-3`, `--aspect-1-1` | `16 / 9`, `4 / 3`, `1 / 1` (currently unused — kept for parity) |
| `animation.fade-in` | `--animate-fade-in` | `fadeIn 0.3s ease-in-out` |
| `animation.slide-up` | `--animate-slide-up` | `slideUp 0.3s ease-out` |
| `animation.pulse-slow` | `--animate-pulse-slow` | `pulse 3s ease-in-out infinite` |

`@keyframes fadeIn` and `@keyframes slideUp` move **inside the `@theme` block** (v4 emits
keyframes referenced by `--animate-*` with the utility). The two hand-written
`.animate-fade-in` rules and their duplicate keyframes in `globals.css` (A8) are **deleted**
in the same commit — the token version becomes the single spelling. Note the duration changes
from the hand-written `0.4s` to the config's `0.3s`: the config value is canonical (it is the
one the design system registered), and the visual difference is one frame at 60fps.

### 3.5 Font variables and `next/font` (A9)

`@theme` declares `--font-sans` / `--font-display` with the *family-name stacks* above. v4
emits `.font-sans { font-family: var(--font-sans) }` (by reference, not inlined). On `<body>`,
`next/font`'s `inter.variable`/`poppins.variable` classes re-declare the **same** variable
names to the loaded font metrics — the body-scoped declaration wins for all descendants,
which is exactly the current behaviour. No conflict, no change.

## 4. The `@theme` block (deliverable — the developer copies this verbatim)

```css
@theme {
  /* brand + primary */
  --color-primary-50: #f0f9ff;  --color-primary-100: #e0f2fe; --color-primary-200: #bae6fd;
  --color-primary-300: #7dd3fc; --color-primary-400: #38bdf8; --color-primary-500: #0ea5e9;
  --color-primary-600: #0284c7; --color-primary-700: #0369a1; --color-primary-800: #075985;
  --color-primary-900: #0c4a64; --color-primary-950: #082f49;
  --color-brand-yellow: #FFD700; --color-brand-yellow-hover: #FFC107;
  --color-brand-dark: #0f0f11; --color-brand-dark-card: #1a1a1e;
  --color-brand-dark-border: #2a2a32; --color-brand-dark-text: #e0e0e5;
  --color-brand-dark-text-muted: #a0a0a8;
  --color-brand-cyan: #00f2ff; --color-brand-cyan-hover: #00d4e6;
  --color-brand-cyan-soft: rgba(0, 242, 255, 0.12); --color-brand-cyan-glow: rgba(0, 242, 255, 0.40);
  --color-brand-gold: #FFD700; --color-brand-gold-hover: #E6C200;
  --color-brand-navy-950: #050a14; --color-brand-navy-900: #080e1a;
  --color-brand-navy-800: #0c1220; --color-brand-navy-700: #111827;
  --color-brand-navy-600: #1e2a3a;
  /* semantic */
  --color-background: #050a14; --color-foreground: #f0f0f0;
  --color-card: #0c1220; --color-card-foreground: #e8e8e8;
  --color-muted: #111827; --color-muted-foreground: #9aa7b8;
  --color-border: #1e2a3a; --color-input: #1e2a3a; --color-ring: #00f2ff;
  --color-accent: rgba(0, 242, 255, 0.10); --color-accent-foreground: #00f2ff;
  --color-secondary: #111827; --color-secondary-foreground: #e8e8e8;
  --color-destructive: #ef4444; --color-destructive-foreground: #ffffff;
  --color-primary-foreground: #050a14;
  /* typography */
  --font-sans: "Inter", system-ui, sans-serif;
  --font-display: "Poppins", "Inter", system-ui, sans-serif;
  --text-headline-lg: 2.5rem;
  --text-headline-lg--line-height: 3rem;
  --text-headline-lg--letter-spacing: -0.02em;
  --text-headline-lg--font-weight: 600;
  /* elevation / blur / radii / motion */
  --shadow-video-card: 0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-video-card-dark: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-player-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  --shadow-glass-1: 0 2px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.35);
  --shadow-glass-2: 0 8px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(255,255,255,0.12);
  --shadow-glass-3: 0 16px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(255,255,255,0.18);
  --shadow-glass-4: 0 32px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.55);
  --shadow-cyan-glow-1: 0 0 16px -2px rgba(0,242,255,0.40);
  --shadow-cyan-glow-2: 0 0 28px -4px rgba(0,242,255,0.55);
  --blur-glass-xs: 8px; --blur-glass-sm: 12px; --blur-glass-md: 16px;
  --blur-glass-lg: 24px; --blur-glass-xl: 32px;
  --radius-glass-card: 1.25rem; --radius-glass-panel: 1.5rem;
  --ease-glass-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-glass-in-out: cubic-bezier(0.76, 0, 0.24, 1);
  --ease-glass-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --transition-duration-glass-instant: 100ms; --transition-duration-glass-fast: 180ms;
  --transition-duration-glass-base: 260ms; --transition-duration-glass-slow: 420ms;
  --transition-duration-glass-exit: 200ms;
  /* aspect + animation */
  --aspect-16-9: 16 / 9; --aspect-4-3: 4 / 3; --aspect-1-1: 1 / 1;
  --animate-fade-in: fadeIn 0.3s ease-in-out;
  --animate-slide-up: slideUp 0.3s ease-out;
  --animate-pulse-slow: pulse 3s ease-in-out infinite;
  @keyframes fadeIn { 0% { opacity: 0 } 100% { opacity: 1 } }
  @keyframes slideUp { 0% { opacity: 0; transform: translateY(20px) } 100% { opacity: 1; transform: translateY(0) } }
}
```

## 5. Cutover steps (for the developer card)

1. Insert the §4 `@theme` block into `globals.css` immediately after the `@import "tailwindcss";` line.
2. Delete the `@config "../../tailwind.config.js";` line (keep `@custom-variant dark`).
3. Delete the two hand-written `.animate-fade-in` rules and both `@keyframes fade-in` / `@keyframes fadeIn` blocks in `globals.css` (A8). `.animate-slide-up` is not duplicated by hand — leave it.
4. Apply the §6 call-site sweep.
5. Delete `tailwind.config.js`.
6. Run the §7 verification gate.

## 6. Call-site sweep for the D2 kebab rename (exhaustive)

Live camelCase spellings that must be rewritten to kebab **in the same commit** (each is a
grep-verified, complete list as of HEAD `83f3a07`):

| From | To | Sites |
|---|---|---|
| `hover:bg-brand-cyanHover` | `hover:bg-brand-cyan-hover` | `src/components/homepage/featured-hero.tsx:201`, `src/components/homepage/wp-homepage-content.tsx:361` |

(both live camelCase sites are the `hover:`-prefixed form; no plain `bg-brand-cyanHover` exists)

The inverse direction — kebab spellings that are **inert today and become live** after the
cutover — needs no edit: `bg-brand-cyan-hover` (`src/components/ui/index.tsx:37`),
`shadow-brand-cyan-glow` (`featured-hero.tsx` VOTA button is already on `shadow-cyan-glow-1/2`,
but `hover:bg-brand-cyan-hover` inside the `cyan` Button variant at `index.tsx:37` activates
automatically). Nothing else uses the camel spellings (grep `yellowHover|goldHover|cyanSoft|cyanGlow|darkCard|darkBorder|darkText` → config only).

## 7. Verification gate (acceptance for the cutover commit)

All four must pass; #4 is the one the ADR-0001 probe alone would have missed (the
`*/`-in-comment failure, see commit `8540cff` message).

1. **ADR-0001 §11 probe** (unminified): compiling `globals.css` through
   `@tailwindcss/postcss` (cwd = repo root) emits `bg-brand-cyan`, `text-muted-foreground`,
   `border-border`, `bg-card`, `backdrop-blur-glass-md`, `.glass-card`, `.glass-nav`,
   `.liquid-glass`, `text-headline-lg`, `.container-max`, `.hero-ambient`, and the
   `where(.dark` selector.
2. **NEW `@apply` probe** (the point of this ADR): `@apply bg-brand-yellow bg-brand-cyan
   text-muted-foreground backdrop-blur-glass-md font-display;` inside an `@layer utilities`
   test class **compiles without error** — it fails before the cutover (A2).
3. **Same-output diff (D3):** capture the sorted list of emitted class selectors from the
   probe before the cutover and after; the after-list must be a **superset** (the kebab
   additions), with no removals other than intentionally renamed camelCase utilities.
4. **Build gate + built-CSS check:** `rm -rf .next && NODE_ENV=production node
   node_modules/next/dist/bin/next build --webpack` passes on Termux, and the emitted
   `.next/static/css/*.css` is grep-verified to contain every glass rule (the minified path
   is the only one that counts for `@layer components` survival).
5. **Spot render:** `/feed/trending` serves 30 `glass-card` cards and exactly 1 `<header>`.

## 8. Consequences

- One theme source (`globals.css`); the dual-source drift risk (A4) and the `@apply` trap (A2)
  are gone. `tailwindcss` upgrades no longer depend on legacy-bridge behaviour.
- The kebab rename makes ~22 dead accent call sites live (A3). Reviewers should expect a
  *visible* change on exactly those spots (cyan hovers/glows that were silently off) — that is
  the intended activation, not a regression.
- v4 default `content` detection must keep seeing every source file: no `@source` directives
  are introduced; if a future route directory falls outside auto-detection, add an explicit
  `@source` line rather than restoring the JS config.
- Follow-up (not in this ADR): `@tailwindcss/typography` for `about/page.tsx:19`
  (`prose dark:prose-invert` — still inert, per ADR-0001 §13 note); the now-unused
  `.streamtube-card` block in `globals.css` is deleted separately.
