---
version: beta
name: BAZZIBA!
description: >-
  A vibrant, community-driven contest and video platform celebrating Italian entertainment, music, and creative talent
  with an energetic, playful brand voice.
logo:
  src: https://bazziba.it/wp-content/uploads/2025/01/logo2.png
colors:
  primary: '#FFD700'
  primary-hover: '#E6C200'
  primary-dark: '#FFA700'
  surface: '#0A0A0A'
  surface-container: '#121212'
  surface-container-high: '#1A1A1A'
  surface-container-highest: '#222222'
  on-surface: '#F5F5F5'
  on-surface-variant: '#B3B3B3'
  background: '#0A0A0A'
  card: '#121212'
  card-foreground: '#E8E8E8'
  muted: '#1A1A1A'
  muted-foreground: '#888888'
  accent: '#FFD700'
  border: '#2A2A2A'
  border-variant: '#3A3A3A'
typography:
  display:
    fontFamily: Poppins
    fontSize: 60px
    fontWeight: '700'
    lineHeight: 68px
    letterSpacing: '-0.04em'
  headline-lg:
    fontFamily: Poppins
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: '-0.02em'
  headline-md:
    fontFamily: Poppins
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: '-0.01em'
  headline-sm:
    fontFamily: Poppins
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0em
  body-lg:
    fontFamily: Lato
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0.02em
  body-md:
    fontFamily: Lato
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Poppins
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Poppins
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  container-max: 1280px

# 2026 Liquid Glass Design Language
liquid-glass:
  # Base frosted glass recipe (2026 standard)
  base:
    background: 'rgba(255, 255, 255, 0.08)'
    backdropFilter: 'blur(16px) saturate(180%) brightness(1.1)'
    webkitBackdropFilter: 'blur(16px) saturate(180%) brightness(1.1)'
    border: '1px solid rgba(255, 255, 255, 0.18)'
    borderRadius: 20px
    isolation: isolate

  # Specular edge highlight — the lit top-left edge
  specular:
    boxShadow: |
      0 8px 32px rgba(0, 0, 0, 0.25),
      inset 0 1px 1px rgba(255, 255, 255, 0.55),
      inset 0 -1px 1px rgba(255, 255, 255, 0.30)

  # Sheen overlay — diagonal gloss for wet look
  sheen:
    background: 'linear-gradient(135deg, rgba(255,255,255,0.45), rgba(255,255,255,0.08) 28%, transparent 58%)'
    mixBlendMode: screen

  # Performance budget
  performance:
    maxGlassSurfacesPerViewport: 3
    maxBlurRadiusPx: 24
    willChange: 'transform, opacity'

  # CSS recipe
  css:
    base: |
      .liquid-glass {
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(16px) saturate(180%) brightness(1.1);
        -webkit-backdrop-filter: blur(16px) saturate(180%) brightness(1.1);
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.55);
        isolation: isolate;
      }
    sheen: |
      .liquid-glass::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.08) 28%, transparent 58%);
        mix-blend-mode: screen;
        pointer-events: none;
        z-index: 1;
      }
    accessibility: |
      @media (prefers-reduced-transparency: reduce) {
        .liquid-glass {
          background: rgba(10, 10, 10, 0.92);
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
        }
      }

components:
  button-primary:
    backgroundColor: '#FFD700'
    textColor: '#0A0A0A'
    typography: label-md
    rounded: full
    padding: 8px 24px
    height: 40px
    transition: all 0.15s ease-in-out
    backdropFilter: 'blur(8px) saturate(170%)'
  button-primary-hover:
    backgroundColor: '#E6C200'
    transform: scale(1.02)
  button-ghost:
    backgroundColor: transparent
    textColor: '#FFD700'
    typography: label-md
    rounded: lg
    padding: 24px
    height: 48px
    border: '1px solid #FFD700'
  glass-card:
    backgroundColor: 'rgba(255, 255, 255, 0.08)'
    backdropFilter: 'blur(16px) saturate(180%) brightness(1.1)'
    borderRadius: 20px
    border: '1px solid rgba(255, 255, 255, 0.18)'
    isolation: isolate
    position: relative
    overflow: hidden
  glass-card-dark:
    backgroundColor: 'rgba(0, 0, 0, 0.30)'
    border: '1px solid rgba(255, 255, 255, 0.08)'
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12)'
  input-field:
    backgroundColor: 'rgba(255, 255, 255, 0.08)'
    typography: body-md
    rounded: full
    padding: '12px 20px'
    height: 48px
    border: '1px solid #2A2A2A'
    backdropFilter: 'blur(8px)'
---

## Overview

BAZZIBA! is a vibrant, community-powered contest and video platform celebrating Italian
entertainment, music, and creative talent. The brand embodies a playful, energetic aesthetic
rooted in "Vibrant Minimalism" -- where a bold, saturated gold accent (#FFD700) cuts through
a clean, dark neutral canvas, creating an immediate sense of excitement and energy.

This design system (v2.0) integrates the **Liquid Glass** design language trend from 2026,
applying frosted glass surfaces with specular edge lighting, refraction effects, and dynamic
sheen overlays on hero sections, cards, and interactive elements.

## 2026 Liquid Glass Design Language

### Five CSS Properties Behind Liquid Glass
1. `backdrop-filter: blur(16px) saturate(180%)` -- frost + saturation push
2. `background: rgba(255,255,255, 0.08)` -- semi-transparent fill never exceeds 0.18 opacity
3. `1px solid rgba(255,255,255, 0.18)` -- brighter edge border (lit rim)
4. `inset box-shadow` -- top highlight + bottom shade for depth
5. `::after` sheen gradient -- diagonal gloss at 135deg, mix-blend-mode: screen

### Recipe (2026 Standard)
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
.liquid-glass::after {
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

### Performance Budget (2026)
- Max 3 glass surfaces per viewport
- Blur radius capped at 24px for large surfaces
- Never animate blur-radius (kills FPS), animate opacity instead
- Use `will-change: transform` only during animations
- Don't stack glass panels (quadratic compositing cost)

### Accessibility (2026 Standard)
```css
@media (prefers-reduced-transparency: reduce) {
  .liquid-glass {
    background: rgba(10, 10, 10, 0.92);
    backdrop-filter: none;
  }
}
```

### Do's and Don'ts
**Do**
- Use gold #FFD700 on CTAs, active states, and brand-critical elements
- Pair Poppins headlines with Lato body text
- Apply liquid glass to hero sections, modals, nav bars over busy/image backgrounds
- Animate opacity for fade, never blur-radius
- Cap at 3 glass surfaces, keep blur under 24px

**Don't**
- Don't use heavy shadows (box-shadow: 0 16px 40px)
- Don't apply glass to data-dense elements
- Don't use over flat color backgrounds (needs texture/photo to frost)
- Don't stack glass panels
- Don't reduce padding below accessibility minimums
