import { NextResponse } from "next/server";

import { buildReviewMarkdownReport } from "@/lib/export/markdown";
import { getCurrentUser, getReviewDetailForUser } from "@/lib/reviews/queries";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return new NextResponse("Supabase is not configured.", { status: 500 });
  }

  const user = await getCurrentUser(supabase);

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const detail = await getReviewDetailForUser(supabase, user, id);

  if (!detail) {
    return new NextResponse("Review not found.", { status: 404 });
  }

  const body = buildReviewMarkdownReport(detail);
  const safeTitle = (detail.review.title ?? "review-report")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${safeTitle || "review-report"}.md"`,
    },
  });
}
