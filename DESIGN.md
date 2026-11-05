# BAZZIBA! Design System v3.0

> A vibrant, community-driven contest and video platform celebrating Italian entertainment, music, and creative talent with an energetic, playful brand voice.

**Version:** 3.0 (2026-11-05)
**Status:** Production
**Last Updated:** November 2026

---

## Normative Specs

Glass material, motion language, glass primitives and the layering model are owned by
**ADR-0001 — Liquid Glass 2026** (`docs/adr/0001-liquid-glass-2026.md`). Where this document and
ADR-0001 disagree, **ADR-0001 wins**. Outside the sections explicitly marked *superseded*, this
file never restates a token value that ADR-0001 owns — it points at the section instead.

| Domain | Authoritative source |
|---|---|
| Glass material tokens (blur, fill, specular, edge, refraction, elevation) | ADR-0001 §4 |
| Motion language (durations, easings, springs, stagger) | ADR-0001 §5 |
| Glass component architecture (`GlassSurface`, `GlassCard`, `GlassButton`, `GlassNav`) | ADR-0001 §6 |
| Layering over `#050a14`, z-scale, performance budget | ADR-0001 §7, §8 |
| Contrast floors, scrim rule, reduced-motion / reduced-transparency | ADR-0001 §9 |

---

## Brand Identity

### Logo
- **Source:** `https://bazziba.it/wp-content/uploads/2025/01/logo2.png`
- **Fallback:** Gold rounded square with geometric "B" shape (inline SVG)
- **Display:** 40x40px in header, 32x32px in mobile nav, 28x28px in footer

### Color Palette

| Token | Hex | HSL | Usage |
|-------|-----|-----|-------|
| `--brand-cyan` | `#00f2ff` | 189 100% 49% | Primary accent, CTAs, active states, branding |
| `--brand-cyan-hover` | `#00d4e6` | 189 100% 45% | Hover state for cyan elements |
| `--brand-cyan-glow` | `rgba(0, 242, 255, 0.4)` | - | Glow shadows |
| `--brand-gold` | `#FFD700` | 42 91% 50% | Secondary accent (contest prizes, premium CTAs) |
| `--brand-gold-hover` | `#E6C200` | 42 85% 48% | Hover state for gold elements |
| `--background` | `#050a14` | 225 65% 4% | Page background (deep navy, dark default) |
| `--background-alt` | `#080e1a` | 225 55% 6% | Card/section surfaces |
| `--card` | `#0c1220` | 225 45% 8% | Card surfaces |
| `--card-foreground` | `#E8E8E8` | 0 0% 93% | Card text |
| `--muted` | `#111827` | 225 30% 12% | Secondary surfaces |
| `--muted-foreground` | `#9aa7b8` | 214 17% 66% | Secondary text — contrast floor governed by ADR-0001 §9.1 |
| `--border` | `#1e2a3a` | 220 25% 20% | Borders, dividers |
| `--border-bright` | `rgba(0, 242, 255, 0.15)` | - | Cyan-tinted border on glass — v2 value retired; not defined in code. Glass edge tokens live in ADR-0001 §4.3 |
| `--input` | `#1e2a3a` | 220 25% 20% | Input borders |

**Governance:** the semantic rows above mirror the Phase 0 token set of ADR-0001 §3. Contrast
floors and the measured ratios are ADR-0001 §9.1 — `#6b7280` is banned there (it fails 4.5:1 as
small text) and must not be reintroduced. `--muted-foreground` must not be lightened past
`#9aa7b8`.

### Light Mode Overrides
When `.light` or `[data-theme="light"]` is active:
- `--background`: stays `#050a14` in **both** themes — the page base is not theme-switched (ADR-0001 §7)
- `--foreground`: `#1F2937` (220 20% 12%)
- `--card`: `#FFFFFF` (0 0% 100%)
- `--border`: `#E5E7EB` (220 20% 88%)

### Background Gradient
The body base is a layered radial gradient over `#050a14` (cyan + teal washes) with two ambient
`blur-3xl` cyan blobs as layer 1 — see the layering model in ADR-0001 §7 and the live `body`
rule in `src/app/globals.css`. Values are owned by ADR-0001 §7 and are not repeated here.

---

## Typography

### Font Stack
- **Display/Headlines:** Poppins (Google Fonts) — weights: 400, 600, 700, 800, 900
- **Body/UI:** Inter (Google Fonts) — weights: 400, 500, 600

### Type Scale

| Level | Font | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|------|--------|-------------|----------------|-------|
| Display | Poppins | 60px | 700 | 68px | -0.04em | Hero titles |
| Headline LG | Poppins | 40px | 600 | 48px | -0.02em | Section titles |
| Headline MD | Poppins | 28px | 600 | 36px | -0.01em | Card titles |
| Headline SM | Poppins | 20px | 600 | 28px | 0em | Card subtitles |
| Body LG | Inter | 18px | 400 | 28px | 0.02em | Paragraphs |
| Body MD | Inter | 15px | 400 | 24px | 0.01em | UI text |
| Label MD | Poppins | 14px | 600 | 20px | 0.01em | Button labels |
| Label SM | Poppins | 12px | 600 | 16px | 0.05em | Badges, captions |

### Gradient Text
Hero headlines use the cyan accent gradient — the exact stops live in the `.gradient-text` rule
in `src/app/globals.css`, drawn from the `brand.cyan` scale (ADR-0001 §3). The v2
gold→orange→red gradient is superseded by the 2026 cyan accent.

---

## Spacing & Layout

### Spacing Scale (8px grid)
| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight spacing, icon gaps |
| `sm` | 12px | Compact cards, tag gaps |
| `md` | 24px | Standard section padding |
| `lg` | 40px | Section gaps |
| `xl` | 64px | Hero sections |
| `gutter` | 24px | Container padding |
| `container-max` | 1280px | Max content width — canonical `max-w-7xl` per ADR-0001 §8 (D8) |

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 0.25rem | Small elements, badges |
| `DEFAULT` | 0.5rem | Inputs, buttons |
| `md` | 0.75rem | Cards, modals |
| `lg` | 1rem | Panels, dropdowns |
| `xl` | 1.5rem | Glass `raised`/`overlay` tier radius — ADR-0001 §4.5 |
| `2xl` | 20px | Glass `card` tier radius — ADR-0001 §4.5 |
| `full` | 9999px | Pills, avatars, FAB |

### Responsive Breakpoints
| Breakpoint | Prefix | Usage |
|------------|--------|-------|
| `sm` | ≥640px | Tablet portrait |
| `md` | ≥768px | Tablet landscape, desktop nav |
| `lg` | ≥1024px | Desktop, sidebar layouts |
| `xl` | ≥1280px | Wide content |

---

## 2026 Liquid Glass Design Language (v2 — SUPERSEDED)

> **SUPERSEDED — historical record only, not normative.**
> This is the DESIGN.md v2 glass spec, kept as history. The Liquid Glass material, motion,
> component and layering specs now live in **ADR-0001** (`docs/adr/0001-liquid-glass-2026.md`):
> material → §4, motion → §5, components → §6, layering → §7, budget → §8, a11y → §9.
> Every value below is superseded; where a recipe here disagrees with ADR-0001, ADR-0001 wins.
> Do not implement from this section — read the ADR instead.

### Core Concept
Frosted glass surfaces with specular edge lighting, refraction effects, and dynamic sheen overlays. Applied to hero sections, cards, modals, and nav bars over image/textured backgrounds.

### When to Use
- **Do:** Hero sections, modals, nav bars over busy backgrounds, key CTAs
- **Don't:** Data-dense elements, flat color backgrounds, stacked panels (>3 per viewport)

### Base Glass Recipe
```css
.liquid-glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px) saturate(180%) brightness(1.1);
  -webkit-backdrop-filter: blur(16px) saturate(180%) brightness(1.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 20px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.25),
    inset 0 1px 1px rgba(255, 255, 255, 0.55),
    inset 0 -1px 1px rgba(255, 255, 255, 0.30);
  isolation: isolate;
}
```

### Sheen Overlay
Diagonal gloss at 135deg with screen blend:
```css
.liquid-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg,
    rgba(255,255,255,0.45) 0%,
    rgba(255,255,255,0.08) 28%,
    transparent 58%);
  mix-blend-mode: screen;
  pointer-events: none;
  z-index: 1;
}
```

### Glass Variants

#### `.liquid-glass` — Primary glass (hero sections, modals)
- Radius: 20px
- Blur: 16px
- Border: rgba(255,255,255,0.18)
- Shadow: 0 8px 32px + inset highlights

#### `.glass-card` — Lighter card variant (content cards, sidebar)
- Radius: 16px
- Blur: 12px
- Border: rgba(255,255,255,0.12)
- Hover: lift + gold-tinted shadow
- Transition: 0.3s ease

#### `.liquid-glass-nav` — Ultra-light navbar
- Background: rgba(10,10,10,0.70)
- Blur: 20px
- Border: rgba(255,255,255,0.08)
- No sheen overlay (performance)

#### `.liquid-glass-dark` — Dark variant (contrast on dark sections)
- Background: rgba(0,0,0,0.30)
- Border: rgba(255,255,255,0.08)
- Shadow: 0 8px 32px rgba(0,0,0,0.40)

### Performance Budget
- Max 3 glass surfaces per viewport
- Blur radius capped at 24px for large surfaces
- Never animate blur-radius (animate opacity/transform instead)
- Use `will-change: transform` only during active animations

### Accessibility
```css
@media (prefers-reduced-transparency: reduce) {
  .liquid-glass,
  .glass-card {
    background: rgba(10, 10, 10, 0.92);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  .liquid-glass::before,
  .liquid-glass::after,
  .glass-card::before,
  .glass-card::after {
    display: none;
  }
}
```

---

## Components

Motion values (durations, easings, springs) and glass surface behaviour are governed by
ADR-0001 §5 and §6 and are not restated below — where a value in this section disagrees with
those sections, the ADR wins. Palette, sizes, radii from the scale above and focus behaviour
remain this document's domain.

### Button — Primary (Gold)
```
background: #FFD700
text: #0A0A0A (black)
font: Poppins 600, 14px
rounded: full (9999px)
padding: 8px 24px
height: 40px
transition: ADR-0001 §5 tokens (hover `--dur-fast`, press `--dur-instant`)
hover: background #E6C200, scale per ADR-0001 §5.3 (MOTION.hover)
```

### Button — Ghost
```
background: transparent
text: #FFD700 (gold)
border: 1px solid #FFD700
rounded: lg (1rem)
height: 48px
hover: bg-accent (ADR-0001 §5 timing)
```

### Button — Outline
```
background: transparent
text: foreground color
border: 1px solid var(--border)
rounded: md (0.75rem)
hover: border-brand-yellow (ADR-0001 §5 timing)
```

### Badge
```
inline-flex items-center rounded-full
px-2.5 py-0.5 text-xs font-medium
variants: default (gold bg), secondary (muted bg), outline (no bg)
```

### Avatar
```
relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full
img: h-full w-full object-cover
fallback: bg-muted with UserIcon SVG
size variants: h-8/w-8 (small), h-10/w-10 (medium), h-12/w-12 (large)
```

### Card (Glass)
Superseded as a recipe — new work uses `GlassSurface` / `GlassCard` (ADR-0001 §6.1–§6.2). Radius,
fill, shadow and the hover lift come from the elevation scale (ADR-0001 §4.5) and the motion
language (ADR-0001 §5 — hover lift is `--dur-fast` at `--ease-glass-out`, **not** the v2
`0.3s ease`). Only padding stays a call-site choice: `p-4` dense, `p-6` roomy.

### Input
```
w-full rounded-lg border border-input bg-background
px-4 py-2.5 text-sm
focus: ring-2 ring-brand-yellow
transition: ADR-0001 §5 tokens
placeholder: text-muted-foreground
```

### Textarea
```
w-full rounded-lg border border-input bg-background
px-4 py-2.5 text-sm resize-y
focus: ring-2 ring-brand-yellow
transition: ADR-0001 §5 tokens
```

### Separator
```
shrink-0 bg-border
horizontal: h-px w-full
vertical: h-full w-px
```

### Skeleton
```
animate-pulse rounded-md bg-muted
```

---

## Component Specifications

### Video Card
- **Thumbnail:** 16:9 aspect ratio, rounded-xl, object-cover
- **Play overlay:** Centered play icon, appears on hover, scale from 0 to 1 opacity
- **Duration badge:** Bottom-right, black/70 bg, white text, font-mono, rounded-md
- **Category badge:** Top-left, black/60 bg, white text
- **Author:** 32x32 avatar (left), name + view count (right)
- **Title:** 2-line clamp, font-medium
- **Hover:** lift/scale per ADR-0001 §4.5 + §5.3; any glass over the thumbnail applies the scrim (ADR-0001 §9.2)
- **Sizes:** sm (200px), md (280px), lg (320px), compact (160px)

### Video Player (Watch Page)
- **Container:** aspect-video, bg-black, rounded-xl
- **Controls:** Auto-hide during playback (5s timeout), show on hover/mouse move
- **Progress bar:** Gold (#FFD700), rounded-full, clickable to seek
- **Big play/pause:** Centered overlay, fades in when paused
- **Bottom controls dock:** Gradient from black/80 to transparent, 32px tall
  - Play/Pause toggle
  - Volume mute toggle + slider (20px wide)
  - Current time / Total time (font-mono, text-xs)
  - Settings gear (right) + Fullscreen toggle (far right)
- **Chapters:** Overlay on progress bar (gold markers)

### Watch Page Layout (2-column desktop)
- **Left (2/3):** Player → Actions → Title/Meta → Quality selector → Chapters → Description → Tags → Channel → Comments
- **Right (1/3, sticky):** "Video Suggeriti" header + 3-4 recommended video rows

### Mobile Bottom Navigation
- **Position:** fixed bottom-0, z-50, hidden on md+
- **Height:** 64px (h-16)
- **Background:** docked glass tier via `GlassNav` — blur/fill owned by ADR-0001 §4.1–§4.2, scroll response §6.4, z-layer §7
- **Items:** 5 tabs (Home, Trending, Search, Contest, Profile) + Upload FAB
- **FAB:** w-14 h-14, bg-brand-yellow, rounded-full, shadow-lg, Upload icon
- **Active state:** text-brand-yellow + bg-brand-yellow/10

### Search Autocomplete
- **Trigger:** Input focus or typing
- **Position:** absolute, top-full, mt-1, z-50
- **Max width:** 100% of parent
- **Sections:**
  1. Popular searches (when query empty) — 10 items with Clock icon
  2. Results (when query > 1 char) — video/channel/category rows with type icon
  3. "Nessun risultato" empty state
  4. "Cerca '{query}'" full-search button at bottom
- **Keyboard:** onMouseDown (not onClick) to prevent blur-before-click

### Contest Page
- **Hero:** Gradient hero with gold accent, contest title, description
- **Stats grid (4 cols):** Start date, days remaining, participants, prize pool
- **Leaderboard:** Rank (🥇🥈🥉 or number), thumbnail (w-24 h-16), title, author, vote count, vote button
- **Instructions:** Numbered list with "Come partecipare" header

---

## Page Inventory

| Page | Route | Type | Key Features |
|------|-------|------|--------------|
| Home | `/` | Server | Hero, trending, categories, contest banner, latest videos |
| Feed | `/feed/[type]` | Client | Tabs (Latest/Trending), infinite scroll, category grid, load-more |
| Watch | `/watch/[id]` | Client | Player, actions, chapters, quality, description, comments, sidebar |
| Search | `/search` | Client | Search input, tabs, results grid, popular tags, empty state |
| Contest | `/contest` | Server | Hero, stats, leaderboard, instructions |
| About | `/about` | Server | Brand story, values, category showcase |
| FAQ | `/faq` | Server | Accordion details, 6 Q&A pairs |
| Contact | `/contattaci` | Client | Info sidebar, form with success state |
| Profile | `/u/[username]` | Server | Avatar, bio, stats, video grid |
| Upload | `/upload` | Client | Drag-drop, form fields, category pills, privacy toggles |
| Sign In | `/auth/signin` | Client | Login form |
| Sign Up | `/auth/signup` | Client | Registration form |

---

## Animations

Durations and easings are owned by ADR-0001 §5. The v2 table below is kept as history; its
`0.4s` / `0.5s` / `0.3s ease` values are **not** current tokens and are not repeated here.

| Animation | Class | Timing | Usage |
|-----------|-------|--------|-------|
| Fade in | `.animate-fade-in` | ADR-0001 §5.1 (`--dur-base` / `--dur-slow`) | Page elements, cards on mount |
| Slide up | `.animate-slide-up` | ADR-0001 §5.1 | Hero content |
| Liquid morph | `.animate-liquid-morph` | **Superseded** — ADR-0001 §8 restricts animated properties to `transform`/`opacity`; a border-radius pulse is not permitted | (v2 hero effect) |
| Float | (custom) | ADR-0001 §5.2 | Optional decorative elements |
| Pulse gold | (custom) | ADR-0001 §5.2 | Shine effects |
| Card hover lift | `.glass-card:hover` | ADR-0001 §6.2 (`--dur-fast`, `--ease-glass-out`) | All glass cards |
| Video card hover | `.video-card-container:hover` | ADR-0001 §5.1 | Scale + shadow |

### Stagger
Stagger is index-based, computed in JS and capped in code — ADR-0001 §5.4. The v2 CSS
`.stagger-1`…`.stagger-6` `animation-delay` chain (`globals.css:333-338`) is superseded: CSS
delays cannot be capped or cancelled by reduced-motion at runtime.

---

## Dark Mode

### Default: Dark
HTML tag has `class="dark"` and `data-theme="dark"` for SSR consistency.

### Theme Script (in `<head>`)
```js
(function() {
  try {
    var theme = localStorage.getItem('theme');
    var useDark = theme === 'dark' || (!theme);
    var html = document.documentElement;
    if (useDark) {
      html.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
    }
  } catch(e) {}
})();
```

### ThemeProvider
`next-themes` with `attribute="class"`, `defaultTheme="dark"`, `enableSystem`, `disableTransitionOnChange`.

### Theme Toggle
- Sun icon (light mode), Moon icon (dark mode)
- Toggle via `useTheme().setTheme()`

---

## Accessibility

### WCAG 2.1 AA Compliance
- Contrast floors and measured ratios: ADR-0001 §9.1 (body text ≥ 4.5:1, muted text ≥ 4.5:1 — `#6b7280` is banned there, it fails as small text)
- Glass over media requires the `--glass-scrim-media` scrim before text: ADR-0001 §9.2
- Reduced motion: ADR-0001 §9.3 — reduced transparency: ADR-0001 §9.4
- Focus-visible rings on all interactive elements
- Reduced motion support (`prefers-reduced-motion`)
- Reduced transparency support (`prefers-reduced-transparency`)
- Semantic HTML: `<nav>`, `<main>`, `<header>`, `<footer>`, `<section>`
- ARIA labels on icon-only buttons
- Keyboard navigable dropdowns and autocomplete

### Custom Scrollbar
- Width: 8px
- Track: transparent
- Thumb: hsl(var(--muted-foreground) / 0.4), rounded 4px
- Hover: hsl(var(--muted-foreground) / 0.6)

---

## Brand Reference: bazziba.it

### Visual Identity (from live site)
- **Brand name:** "BAZZIBA!" (all caps)
- **Language:** Italian throughout UI
- **Content focus:** Italian artists — singers, musicians, street artists, poets, DJs, dancers, painters, cinema
- **Video metadata shown:** Thumbnail, title, duration, view count ("visualizzazioni"), author avatar + name, category tag, "fa" (follow) button
- **Layout:** Card-based grid, simple and clean
- **Categories:** 9 categories with Italian names
- **P.IVA:** 17497291009
- **REA:** RM-1722388
- **Address:** Via Gaspero Barbera 103, 00173 Roma RM

### Key Brand Elements to Preserve
1. Gold accent as primary brand color (#FFD700)
2. Dark theme as default
3. Italian language for all UI text
4. 9 artistic categories
5. Community + contest focus
6. Clean, accessible card layout
7. Play button overlay on video hover
8. Duration badge on thumbnails
9. Author avatar + name on video cards
10. View count display

---

## StreamTube Feature Coverage

### Implemented ✓
- [x] Dark/Light mode toggle (persistent via localStorage)
- [x] Video card: play overlay, duration badge, category badge, hover animation, author info
- [x] Search autocomplete with popular searches
- [x] Mobile bottom navigation bar (5 items + upload FAB)
- [x] Watch page: chapters, like/dislike, share, quality selector, description, recommended sidebar
- [x] Comments section with likes, replies
- [x] Upload page: drag-drop, title, description, category, tags, thumbnail, privacy
- [x] Infinite scroll / load more on feed
- [x] Sticky header
- [x] Responsive grid (auto-fill, minmax 260px)
- [x] 8 video categories with emoji icons
- [x] User profile page with stats and video grid
- [x] Contest page with leaderboard (🥇🥈🥉)
- [x] FAQ with accordion
- [x] About page with team and values

### Partial / To Improve
- [ ] Video chapters on timeline (watch page has chapter list but not timeline markers)
- [ ] Quality selector functional (currently UI only, needs backend HLS/DASH integration)
- [ ] Subscribe button functional (UI state only)
- [ ] Upload progress bar (UI placeholder, needs backend integration)
- [ ] Social login buttons (UI only)
- [ ] Notification bell with badge (UI only, no real notification system)
- [ ] Dark/Light toggle in mobile menu (in header, not in mobile drawer)
- [ ] View as Grid/List toggle on feed
- [ ] Save to Watch Later (heart icon on cards)
- [ ] Video preview on hover (currently only play overlay)

### Not Yet Implemented
- [ ] Video advertising (pre-roll, mid-roll, post-roll)
- [ ] Video collections / playlists
- [ ] Post review/rating system
- [ ] Analytics dashboard for creators
- [ ] Notification system (real-time)
- [ ] Subscription feed
- [ ] Channel banner on profile pages
- [ ] Content tabs on channel page (Videos, Playlists, About)
- [ ] Featured channels section
- [ ] Search filters (duration, upload date, features)
- [ ] Sort by (upload date, views, rating, duration)
- [ ] Report video/comment flow
- [ ] Emoji picker in comments
- [ ] @mentions in comments
- [ ] Inline comment editing

---

## File Manifest

```
bazziba-next/
├── DESIGN.md                    # This file
├── STREAMTUBE_ANALYSIS.md       # StreamTube feature gap analysis
├── docs/
│   └── adr/
│       └── 0001-liquid-glass-2026.md  # Liquid Glass 2026 normative spec (material/motion/components/layering)
├── src/
│   ├── app/
│   │   ├── globals.css          # Design system CSS (tokens, glass, animations)
│   │   ├── layout.tsx           # Root layout (ThemeProvider, nav, footer, mobile nav)
│   │   ├── page.tsx             # Homepage
│   │   ├── not-found.tsx        # 404 page
│   │   ├── feed/
│   │   │   └── [type]/page.tsx # Feed with tabs + infinite scroll
│   │   ├── watch/
│   │   │   └── [id]/page.tsx   # Watch page (player, actions, comments, sidebar)
│   │   ├── search/
│   │   │   └── page.tsx         # Search page
│   │   ├── contest/
│   │   │   └── page.tsx         # Contest page (leaderboard, stats)
│   │   ├── about/
│   │   │   └── page.tsx         # About page
│   │   ├── faq/
│   │   │   └── page.tsx         # FAQ accordion
│   │   ├── contattaci/
│   │   │   └── page.tsx         # Contact page with form
│   │   ├── privacy-policy/      # Privacy policy
│   │   ├── terms/               # Terms of service
│   │   ├── upload/
│   │   │   └── page.tsx         # Upload form
│   │   ├── auth/
│   │   │   ├── signin/          # Sign in page
│   │   │   └── signup/          # Sign up page
│   │   └── u/
│   │       └── [username]/      # User profile page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── navigation.tsx   # Header + Footer (desktop nav, mobile drawer)
│   │   │   ├── header.tsx       # Simple header for non-main layouts
│   │   │   ├── mobile-bottom-nav.tsx  # Mobile bottom nav (5 tabs + FAB)
│   │   │   ├── search-autocomplete.tsx # Search dropdown with popular/recent
│   │   │   └── footer.tsx       # Footer (imported by layout)
│   │   ├── video/
│   │   │   ├── video-card.tsx   # Video card (thumbnail, play overlay, badges, author)
│   │   │   ├── video-player.tsx # Custom video player (controls, progress, chapters)
│   │   │   └── comments-section.tsx # Comments (likes, replies, time-ago)
│   │   └── ui/
│   │       ├── index.tsx        # Button, Card, Badge, Avatar, Input, Separator, etc.
│   │       └── logo.tsx         # Logo (Image + SVG fallback) + ThemeToggle
│   ├── lib/
│   │   ├── utils.ts             # cn(), formatDate, timeAgo, formatViews
│   │   └── server.ts            # getThumbnailUrl, getAvatarUrl (mock data helpers)
│   ├── types/
│   │   └── index.ts             # User, Video, Category, Comment, Contest, etc.
│   └── app/api/                 # API routes (auth, videos, users, search, etc.)
└── public/
    ├── favicon.ico
    ├── apple-touch-icon.png
    └── logo.png                 # Brand logo (falls back to SVG)
```

---

## References

- **Live site (brand reference):** https://bazziba.it
- **StreamTube documentation:** https://phpface.gitbook.io/streamtube
- **StreamTube analysis:** STREAMTUBE_ANALYSIS.md
- **ADR-0001 — Liquid Glass 2026 (normative):** docs/adr/0001-liquid-glass-2026.md
- **Deployment:** https://bazziba-next.vercel.app
- **GitHub:** https://github.com/bazziba-it/bazziba-next
