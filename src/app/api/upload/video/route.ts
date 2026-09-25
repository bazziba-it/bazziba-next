import { NextResponse } from "next/server";
import { prisma } from "@/lib/server";
import { apiSuccess, apiError, asyncHandler, rateLimit } from "@/lib/api";

export const POST = asyncHandler(async (req: Request) => {
  // Rate limit
  const rateCheck = rateLimit(req, 5, 60000); // 5 uploads per minute
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, error: "Rate limit exceeded. Try again later." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const { filename, size, contentType } = body;

  if (!filename || !size || !contentType) {
    return apiError("Missing required fields: filename, size, contentType");
  }

  // Validate file size (500MB max)
  if (size > 500 * 1024 * 1024) {
    return apiError("File too large. Maximum 500MB.");
  }

  // Validate content type
  const allowedTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
  if (!allowedTypes.includes(contentType)) {
    return apiError("Unsupported video format. Use MP4, WebM, or MOV.");
  }

  // Create Cloudflare Stream direct upload
  const cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const cloudflareApiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!cloudflareAccountId || !cloudflareApiToken) {
    return apiError("Cloudflare configuration missing");
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/stream/direct_upload`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${cloudflareApiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        maxDurationSeconds: 86400, // 24 hours
        requireSignedURLs: false,
        thumbnailTimestampPct: 0.0,
        allowedOrigins: ["bazziba.it", "www.bazziba.it"],
        thumbnailTimestampPct: 0.5,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    return apiError(`Cloudflare upload error: ${error}`);
  }

  const data = await response.json();

  return apiSuccess({
    uploadUrl: data.result.uploadURL,
    videoId: data.result.uid,
  });
});

export const GET = asyncHandler(async (req: Request) => {
  // Get upload status for a video
  const url = new URL(req.url);
  const videoId = url.searchParams.get("id");

  if (videoId) {
    const cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const cloudflareApiToken = process.env.CLOUDFLARE_API_TOKEN;

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/stream/${videoId}`,
      {
        headers: {
          "Authorization": `Bearer ${cloudflareApiToken}`,
        },
      }
    );

    if (!response.ok) {
      return apiError("Failed to fetch video status");
    }

    const data = await response.json();
    return apiSuccess({
      status: data.result.status,
      duration: data.result.duration,
      preview: data.result.preview,
      thumbnail: data.result.thumbnail,
    });
  }

  return apiSuccess({ message: "Upload API ready" });
});
