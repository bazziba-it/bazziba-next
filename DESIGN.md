# BAZZIBA! Design System v2.0

> A vibrant, community-driven contest and video platform celebrating Italian entertainment, music, and creative talent with an energetic, playful brand voice.

**Version:** 2.0 (2026)  
**Status:** Production  
**Last Updated:** September 2026

---

## Brand Identity

### Logo
- **Source:** `https://bazziba.it/wp-content/uploads/2025/01/logo2.png`
- **Fallback:** Gold rounded square with geometric "B" shape (inline SVG)
- **Display:** 40x40px in header, 32x32px in mobile nav, 28x28px in footer

### Color Palette

| Token | Hex | HSL | Usage |
|-------|-----|-----|-------|
| `--brand-gold` | `#FFD700` | 42 91% 50% | Primary accent, CTAs, active states, branding |
| `--brand-gold-hover` | `#E6C200` | 42 85% 48% | Hover state for gold elements |
| `--brand-gold-dark` | `#FFA700` | 42 100% 50% | Pressed/active state |
| `--background` | `#0A0A0A` | 220 20% 6% | Page background (dark default) |
| `--card` | `#121212` | 220 20% 10% | Card surfaces |
| `--card-foreground` | `#E8E8E8` | 0 0% 93% | Card text |
| `--muted` | `#1A1A1A` | 220 10% 15% | Secondary surfaces |
| `--muted-foreground` | `#888888` | 0 0% 55% | Secondary text |
| `--border` | `#2A2A2A` | 220 10% 20% | Borders, dividers |
| `--input` | `#2A2A2A` | 220 10% 20% | Input borders |

### Light Mode Overrides
When `.light` or `[data-theme="light"]` is active:
- `--background`: `#FAFAFA` (0 0% 98%)
- `--foreground`: `#1F2937` (220 20% 12%)
- `--card`: `#FFFFFF` (0 0% 100%)
- `--border`: `#E5E7EB` (220 20% 88%)

### Background Gradient
Subtle radial gradient on body:
```css
background-image: radial-gradient(circle at 22% 17%, hsl(var(--muted) / 0.3) 0%, transparent 50%);
```

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
Gold-to-orange-to-red gradient for hero headlines:
```css
.gradient-text {
  background: linear-gradient(135deg, #FFD700 0%, #FF8C00 50%, #FF6B6B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

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
| `container-max` | 1280px | Max content width |

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 0.25rem | Small elements, badges |
| `DEFAULT` | 0.5rem | Inputs, buttons |
| `md` | 0.75rem | Cards, modals |
| `lg` | 1rem | Panels, dropdowns |
| `xl` | 1.5rem | Hero sections, large cards |
| `2xl` | 20px | Liquid glass cards |
| `full` | 9999px | Pills, avatars, FAB |

### Responsive Breakpoints
| Breakpoint | Prefix | Usage |
|------------|--------|-------|
| `sm` | ≥640px | Tablet portrait |
| `md` | ≥768px | Tablet landscape, desktop nav |
| `lg` | ≥1024px | Desktop, sidebar layouts |
| `xl` | ≥1280px | Wide content |

---

## 2026 Liquid Glass Design Language

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

### Button — Primary (Gold)
```
background: #FFD700
text: #0A0A0A (black)
font: Poppins 600, 14px
rounded: full (9999px)
padding: 8px 24px
height: 40px
transition: all 0.15s ease-in-out
hover: background #E6C200, scale 1.02
```

### Button — Ghost
```
background: transparent
text: #FFD700 (gold)
border: 1px solid #FFD700
rounded: lg (1rem)
height: 48px
hover: bg-accent
```

### Button — Outline
```
background: transparent
text: foreground color
border: 1px solid var(--border)
rounded: md (0.75rem)
hover: border-brand-yellow
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
```
rounded-xl border bg-card text-card-foreground
p-4 or p-6 depending on context
hover: shadow-lg + translateY(-2px) + border-brand-yellow/20
transition: all 0.3s ease
```

### Input
```
w-full rounded-lg border border-input bg-background
px-4 py-2.5 text-sm
focus: ring-2 ring-brand-yellow
transition: all duration-200
placeholder: text-muted-foreground
```

### Textarea
```
w-full rounded-lg border border-input bg-background
px-4 py-2.5 text-sm resize-y
focus: ring-2 ring-brand-yellow
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
- **Hover:** scale 1.02, shadow-xl, glass overlay on image
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
- **Background:** bg-background/95 + backdrop-blur + border-t
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

| Animation | Class | Duration | Usage |
|-----------|-------|----------|-------|
| Fade in | `.animate-fade-in` | 0.4s ease-out | Page elements, cards on mount |
| Slide up | `.animate-slide-up` | 0.5s ease-out | Hero content |
| Liquid morph | `.animate-liquid-morph` | 12s infinite | Hero section border-radius pulse |
| Float | (custom) | 2s ease-in-out | Optional decorative elements |
| Pulse gold | (custom) | 2s ease-in-out | Shine effects |
| Card hover lift | `.glass-card:hover` | 0.3s ease | All glass cards |
| Video card hover | `.video-card-container:hover` | 0.2s ease | Scale + shadow |

### Stagger Delays
```
.stagger-1: 0.05s
.stagger-2: 0.10s
.stagger-3: 0.15s
.stagger-4: 0.20s
.stagger-5: 0.25s
.stagger-6: 0.30s
```

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
- Color contrast: brand gold (#FFD700) on dark background (#0A0A0A) = 10.5:1 ✓
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
- **Deployment:** https://bazziba-next.vercel.app
- **GitHub:** https://github.com/bazziba-it/bazziba-next
