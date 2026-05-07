export type AiProvider = "none" | "openai" | "gemini";

export type GeneratedReviewSummary = {
  provider: "rule-based" | "openai" | "gemini";
  prSummary: string;
  keyRisks: string[];
  suggestedTests: string[];
  reviewerChecklist: string[];
};
