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
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "Inter", "system-ui", "sans-serif"],
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
      },
    },
  },
  plugins: [],
};

// Note: Use @tailwindcss/animate or keep animations defined above
