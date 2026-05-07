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

export type DashboardOverview = {
  totalReviews: number;
  highRiskReviews: number;
  averageRiskScore: number;
  reviewsNeedingAttention: number;
  commonIssueCategories: Array<{ category: string; count: number }>;
  reviewVolume: Array<{ date: string; reviews: number; avgRisk: number }>;
  riskDistribution: Array<{ name: string; value: number; color: string }>;
  recentReviews: ReviewListItem[];
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

export async function getDashboardOverview(
  supabase: SupabaseClient<Database>,
  user: User,
): Promise<DashboardOverview> {
  const reviews = await listReviewsForUser(supabase, user);

  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      highRiskReviews: 0,
      averageRiskScore: 0,
      reviewsNeedingAttention: 0,
      commonIssueCategories: [],
      reviewVolume: [],
      riskDistribution: [
        { name: "Low", value: 0, color: "#34d399" },
        { name: "Medium", value: 0, color: "#fbbf24" },
        { name: "High", value: 0, color: "#fb923c" },
        { name: "Critical", value: 0, color: "#fb7185" },
      ],
      recentReviews: [],
    };
  }

  const reviewIds = reviews.map((review) => review.id);
  const { data: issues, error: issuesError } = await supabase
    .from("review_issues")
    .select("category, review_id")
    .in("review_id", reviewIds);

  if (issuesError) {
    throw new Error(issuesError.message);
  }

  const averageRiskScore = Math.round(
    reviews.reduce((sum, review) => sum + review.overall_risk_score, 0) / reviews.length,
  );
  const highRiskReviews = reviews.filter((review) =>
    review.risk_level === "high" || review.risk_level === "critical",
  ).length;
  const reviewsNeedingAttention = reviews.filter((review) => review.issueCount > 0).length;

  const issueCategoryCounts = new Map<string, number>();
  for (const issue of issues ?? []) {
    issueCategoryCounts.set(issue.category, (issueCategoryCounts.get(issue.category) ?? 0) + 1);
  }

  const commonIssueCategories = Array.from(issueCategoryCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, count]) => ({ category, count }));

  const reviewVolumeMap = new Map<string, { reviews: number; totalRisk: number }>();
  for (const review of reviews) {
    const dateKey = new Intl.DateTimeFormat("en-CA").format(new Date(review.created_at));
    const existing = reviewVolumeMap.get(dateKey) ?? { reviews: 0, totalRisk: 0 };
    reviewVolumeMap.set(dateKey, {
      reviews: existing.reviews + 1,
      totalRisk: existing.totalRisk + review.overall_risk_score,
    });
  }

  const reviewVolume = Array.from(reviewVolumeMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([date, value]) => ({
      date: date.slice(5),
      reviews: value.reviews,
      avgRisk: Math.round(value.totalRisk / value.reviews),
    }));

  const riskDistribution = [
    {
      name: "Low",
      value: reviews.filter((review) => review.risk_level === "low").length,
      color: "#34d399",
    },
    {
      name: "Medium",
      value: reviews.filter((review) => review.risk_level === "medium").length,
      color: "#fbbf24",
    },
    {
      name: "High",
      value: reviews.filter((review) => review.risk_level === "high").length,
      color: "#fb923c",
    },
    {
      name: "Critical",
      value: reviews.filter((review) => review.risk_level === "critical").length,
      color: "#fb7185",
    },
  ];

  return {
    totalReviews: reviews.length,
    highRiskReviews,
    averageRiskScore,
    reviewsNeedingAttention,
    commonIssueCategories,
    reviewVolume,
    riskDistribution,
    recentReviews: reviews.slice(0, 5),
  };
}
