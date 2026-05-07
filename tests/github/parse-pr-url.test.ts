import { describe, expect, it } from "vitest";

import { GitHubApiError } from "../../lib/github/errors";
import { parseGitHubPrUrl } from "../../lib/github/parse-pr-url";

describe("parseGitHubPrUrl", () => {
  it("parses a standard pull request URL", () => {
    expect(parseGitHubPrUrl("https://github.com/vercel/next.js/pull/123")).toEqual({
      owner: "vercel",
      repo: "next.js",
      pullNumber: 123,
      normalizedUrl: "https://github.com/vercel/next.js/pull/123",
    });
  });

  it("normalizes trailing slash, hash, and query string", () => {
    expect(
      parseGitHubPrUrl("https://github.com/openai/codex/pull/42/?utm_source=test#files"),
    ).toEqual({
      owner: "openai",
      repo: "codex",
      pullNumber: 42,
      normalizedUrl: "https://github.com/openai/codex/pull/42",
    });
  });

  it("rejects non-github hosts", () => {
    expect(() => parseGitHubPrUrl("https://gitlab.com/openai/codex/-/merge_requests/1")).toThrow(
      GitHubApiError,
    );
  });

  it("rejects URLs without a numeric pull request number", () => {
    expect(() => parseGitHubPrUrl("https://github.com/openai/codex/pull/not-a-number")).toThrow(
      GitHubApiError,
    );
  });

  it("rejects arbitrary text", () => {
    expect(() => parseGitHubPrUrl("not a url")).toThrow(GitHubApiError);
  });
});
