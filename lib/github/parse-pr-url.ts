import { GitHubApiError } from "@/lib/github/errors";
import type { ParsedPrUrl } from "@/lib/github/types";

export function parseGitHubPrUrl(input: string): ParsedPrUrl {
  const value = input.trim();

  if (!value) {
    throw new GitHubApiError(
      "invalid_pr_url",
      "Enter a GitHub pull request URL in the format https://github.com/owner/repo/pull/123.",
      400,
    );
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new GitHubApiError(
      "invalid_pr_url",
      "The pull request URL is not a valid URL.",
      400,
    );
  }

  if (url.hostname !== "github.com") {
    throw new GitHubApiError(
      "invalid_pr_url",
      "Only github.com pull request URLs are supported.",
      400,
    );
  }

  const segments = url.pathname.split("/").filter(Boolean);

  if (segments.length < 4 || segments[2] !== "pull") {
    throw new GitHubApiError(
      "invalid_pr_url",
      "The pull request URL must match https://github.com/{owner}/{repo}/pull/{number}.",
      400,
    );
  }

  const [owner, repo, , pullNumberSegment] = segments;
  const pullNumber = Number.parseInt(pullNumberSegment ?? "", 10);

  if (!owner || !repo || Number.isNaN(pullNumber) || pullNumber <= 0) {
    throw new GitHubApiError(
      "invalid_pr_url",
      "The pull request URL is missing a valid owner, repository, or pull request number.",
      400,
    );
  }

  return {
    owner,
    repo,
    pullNumber,
    normalizedUrl: `https://github.com/${owner}/${repo}/pull/${pullNumber}`,
  };
}
