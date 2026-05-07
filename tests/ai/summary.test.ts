import { describe, expect, it } from "vitest";

import {
  parseStoredGeneratedSummary,
  serializeGeneratedSummary,
} from "@/lib/ai/summary";

describe("AI summary serialization", () => {
  it("round-trips structured AI output", () => {
    const serialized = serializeGeneratedSummary({
      provider: "openai",
      prSummary: "This pull request changes authentication middleware and session handling.",
      keyRisks: ["Middleware logic now touches a sensitive login path."],
      suggestedTests: ["Add regression coverage for expired sessions."],
      reviewerChecklist: ["Verify auth redirects still work for anonymous users."],
    });

    const parsed = parseStoredGeneratedSummary(serialized);

    expect(parsed).toEqual({
      provider: "openai",
      prSummary:
        "This pull request changes authentication middleware and session handling.",
      keyRisks: ["Middleware logic now touches a sensitive login path."],
      reviewerChecklist: ["Verify auth redirects still work for anonymous users."],
    });
  });

  it("supports legacy plain-text summaries", () => {
    const parsed = parseStoredGeneratedSummary(
      "Rule-based analysis found 2 issues and recommends extra regression coverage.",
    );

    expect(parsed).toEqual({
      provider: "rule-based",
      prSummary:
        "Rule-based analysis found 2 issues and recommends extra regression coverage.",
      keyRisks: [],
      reviewerChecklist: [],
    });
  });
});
