/**
 * Bazziba Next.js - OG Image Generator API Route
 * Generates dynamic OG images for videos using Cloudflare Workers or canvas
 */

import { ImageResponse } from "next/og";

export const config = {
  runtime: "edge",
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "BAZZIBA! - La Nuova Piattaforma delle Arti";
    const author = searchParams.get("author") || "Bazziba";
    const thumbnail = searchParams.get("thumbnail") || "";

    const bg = {
      dark: { primary: "#0f0f11", secondary: "#1a1a1e", text: "#e0e0e5", accent: "#FFD700" },
      light: { primary: "#ffffff", secondary: "#f5f5f5", text: "#1a1a1a", accent: "#FFD700" },
    };

    const theme = "dark";
    const colors = bg[theme];

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.primary,
            fontFamily: "system-ui",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "8px",
              backgroundColor: colors.accent,
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "70%",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                color: colors.text,
                fontSize: 52,
                fontWeight: 800,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {title.length > 60 ? title.substring(0, 60) + "..." : title}
            </h1>
            <p
              style={{
                color: colors.text,
                fontSize: 24,
                fontWeight: 400,
                margin: 0,
                marginTop: 20,
                opacity: 0.8,
              }}
            >
              di {author}
            </p>
            <div
              style={{
                marginTop: 40,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" rx="20" fill={colors.accent} />
                <path d="M30 30 L30 70 L70 50 L30 30 Z" fill={colors.primary} />
              </svg>
              <span style={{ color: colors.text, fontSize: 24, fontWeight: 700 }}>BAZZIBA!</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    return new Response("Error generating image", { status: 500 });
  }
}
