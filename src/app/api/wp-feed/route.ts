import { NextRequest, NextResponse } from "next/server";
import { fetchBazzibaVideos, fetchVideosByCategory, searchVideos } from "@/data/wp";

/**
 * Client-side pagination proxy for "Carica altri" grids.
 * GET /api/wp-feed?scope=latest|category|search&page=2&categoryId=202&q=cover
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const scope = sp.get("scope") ?? "latest";
  const page = Math.max(1, parseInt(sp.get("page") ?? "1", 10) || 1);
  const perPage = Math.min(50, Math.max(1, parseInt(sp.get("perPage") ?? "24", 10) || 24));

  try {
    let videos;
    if (scope === "category") {
      const categoryId = parseInt(sp.get("categoryId") ?? "", 10);
      if (!Number.isFinite(categoryId)) {
        return NextResponse.json({ error: "categoryId required" }, { status: 400 });
      }
      videos = await fetchVideosByCategory(categoryId, perPage, page);
    } else if (scope === "search") {
      const q = sp.get("q") ?? "";
      videos = await searchVideos(q, perPage, page);
    } else {
      videos = await fetchBazzibaVideos(perPage, page);
    }
    return NextResponse.json(
      { videos, page, hasMore: videos.length === perPage },
      { headers: { "Cache-Control": "public, max-age=60, s-maxage=300" } }
    );
  } catch (err) {
    console.error("[wp-feed]", err);
    return NextResponse.json({ error: "WP upstream error" }, { status: 502 });
  }
}
