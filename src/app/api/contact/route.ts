import { NextResponse } from "next/server";
import { apiSuccess, apiError, asyncHandler } from "@/lib/api";

export const POST = asyncHandler(async (req: Request) => {
  const body = await req.json();
  const { firstName, lastName, email, subject, message } = body;

  if (!firstName || !lastName || !email || !subject || !message) {
    return apiError("All fields are required", 400);
  }

  // In production, send email via Resend/Brevo
  // For now just return success
  return apiSuccess({ message: "Message sent successfully" }, 200);
});
