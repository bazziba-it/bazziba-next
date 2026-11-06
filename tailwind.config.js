/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a64",
          950: "#082f49",
        },
        brand: {
          yellow: "#FFD700",
          yellowHover: "#FFC107",
          dark: "#0f0f11",
          darkCard: "#1a1a1e",
          darkBorder: "#2a2a32",
          darkText: "#e0e0e5",
          darkTextMuted: "#a0a0a8",
          // ADR-0001 Phase 0 — Liquid Glass 2026 accent scale (additive, C3 fix)
          cyan: "#00f2ff",
          cyanHover: "#00d4e6",
          cyanSoft: "rgba(0, 242, 255, 0.12)",
          cyanGlow: "rgba(0, 242, 255, 0.40)",
          gold: "#FFD700",
          goldHover: "#E6C200",
          navy: {
            950: "#050a14",
            900: "#080e1a",
            800: "#0c1220",
            700: "#111827",
            600: "#1e2a3a",
          },
        },
        // semantic palette the app already assumes (ADR-0001 C2 fix)
        background: "#050a14",
        foreground: "#f0f0f0",
        card: "#0c1220",
        "card-foreground": "#e8e8e8",
        muted: "#111827",
        "muted-foreground": "#9aa7b8", // 8.0:1 on glass — ADR-0001 §9.1; #6b7280 fails AA
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
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        // ADR-0001 §10 (C7) — DESIGN.md v2 Headline LG: Poppins 600 / 40px / 48px lh / -0.02em
        "headline-lg": ["2.5rem", { lineHeight: "3rem", letterSpacing: "-0.02em", fontWeight: "600" }],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      aspectRatio: {
        "16-9": "16 / 9",
        "4-3": "4 / 3",
        "1-1": "1 / 1",
      },
      boxShadow: {
        "video-card": "0 4px 12px rgba(0, 0, 0, 0.15)",
        "video-card-dark": "0 4px 12px rgba(0, 0, 0, 0.4)",
        "player-shadow": "0 8px 32px rgba(0, 0, 0, 0.3)",
        // ADR-0001 §4.5 elevation scale + §4.3 accent glow
        "glass-1": "0 2px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.35)",
        "glass-2": "0 8px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(255,255,255,0.12)",
        "glass-3": "0 16px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(255,255,255,0.18)",
        "glass-4": "0 32px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.55)",
        "cyan-glow-1": "0 0 16px -2px rgba(0,242,255,0.40)",
        "cyan-glow-2": "0 0 28px -4px rgba(0,242,255,0.55)",
      },
      // ADR-0001 §4.1 blur scale (docked sm .. overlay xl)
      blur: {
        "glass-xs": "8px",
        "glass-sm": "12px",
        "glass-md": "16px",
        "glass-lg": "24px",
        "glass-xl": "32px",
      },
      // ADR-0001 §4.5 tier radii
      borderRadius: {
        "glass-card": "1.25rem",
        "glass-panel": "1.5rem",
      },
      // ADR-0001 §5.2 easings
      transitionTimingFunction: {
        "glass-out": "cubic-bezier(0.22, 1, 0.36, 1)",
        "glass-in-out": "cubic-bezier(0.76, 0, 0.24, 1)",
        "glass-spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      // ADR-0001 §5.1 durations
      transitionDuration: {
        "glass-instant": "100ms",
        "glass-fast": "180ms",
        "glass-base": "260ms",
        "glass-slow": "420ms",
        "glass-exit": "200ms",
      },
    },
  },
  plugins: [],
};

// Note: Use @tailwindcss/animate or keep animations defined above
