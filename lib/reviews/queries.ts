import type { SupabaseClient, User } from "@supabase/supabase-js";

import type { Database, ReviewFileRow, ReviewIssueRow, ReviewRow } from "@/lib/db/types";

export type ReviewListItem = ReviewRow & {
  fileCount: number;
  issueCount: number;
};

export type ReviewDetailRecord = {
  review: ReviewRow;
  files: ReviewFileRow[];
  issues: ReviewIssueRow[];
};

export async function getCurrentUser(
  supabase: SupabaseClient<Database>,
) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return user;
}

export async function listReviewsForUser(
  supabase: SupabaseClient<Database>,
  user: User,
): Promise<ReviewListItem[]> {
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  if (!reviews || reviews.length === 0) {
    return [];
  }

  const reviewIds = reviews.map((review) => review.id);
  const [{ data: files, error: filesError }, { data: issues, error: issuesError }] =
    await Promise.all([
      supabase.from("review_files").select("id, review_id").in("review_id", reviewIds),
      supabase.from("review_issues").select("id, review_id").in("review_id", reviewIds),
    ]);

  if (filesError) {
    throw new Error(filesError.message);
  }

  if (issuesError) {
    throw new Error(issuesError.message);
  }

  const fileCountByReview = new Map<string, number>();
  const issueCountByReview = new Map<string, number>();

  for (const file of files ?? []) {
    fileCountByReview.set(file.review_id, (fileCountByReview.get(file.review_id) ?? 0) + 1);
  }

  for (const issue of issues ?? []) {
    issueCountByReview.set(issue.review_id, (issueCountByReview.get(issue.review_id) ?? 0) + 1);
  }

  return reviews.map((review) => ({
    ...review,
    fileCount: fileCountByReview.get(review.id) ?? 0,
    issueCount: issueCountByReview.get(review.id) ?? 0,
  }));
}

export async function getReviewDetailForUser(
  supabase: SupabaseClient<Database>,
  user: User,
  reviewId: string,
): Promise<ReviewDetailRecord | null> {
  const { data: review, error: reviewError } = await supabase
    .from("reviews")
    .select("*")
    .eq("id", reviewId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (reviewError) {
    throw new Error(reviewError.message);
  }

  if (!review) {
    return null;
  }

  const [{ data: files, error: filesError }, { data: issues, error: issuesError }] =
    await Promise.all([
      supabase
        .from("review_files")
        .select("*")
        .eq("review_id", review.id)
        .order("risk_score", { ascending: false })
        .order("file_path", { ascending: true }),
      supabase
        .from("review_issues")
        .select("*")
        .eq("review_id", review.id)
        .order("created_at", { ascending: true }),
    ]);

  if (filesError) {
    throw new Error(filesError.message);
  }

  if (issuesError) {
    throw new Error(issuesError.message);
  }

  return {
    review,
    files: files ?? [],
    issues: issues ?? [],
  };
}
