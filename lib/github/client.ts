import { GitHubApiError } from "@/lib/github/errors";

const GITHUB_API_BASE_URL = "https://api.github.com";

function createHeaders(token?: string) {
  const headers = new Headers({
    Accept: "application/vnd.github+json",
    "User-Agent": "CodeReviewX",
    "X-GitHub-Api-Version": "2022-11-28",
  });

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

function isRateLimited(response: Response) {
  const remaining = response.headers.get("x-ratelimit-remaining");
  return remaining === "0" || response.status === 429;
}

async function repoExists(owner: string, repo: string, token?: string) {
  const response = await fetch(`${GITHUB_API_BASE_URL}/repos/${owner}/${repo}`, {
    headers: createHeaders(token),
    cache: "no-store",
  });

  return response.ok;
}

export async function fetchGitHubJson<T>(
  path: string,
  options: {
    token?: string;
    owner: string;
    repo: string;
    notFoundMessage: string;
  },
): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE_URL}${path}`, {
    headers: createHeaders(options.token),
    cache: "no-store",
  });

  if (response.ok) {
    return (await response.json()) as T;
  }

  if (response.status === 401) {
    throw new GitHubApiError(
      "unauthorized",
      "The provided GitHub token is invalid or expired.",
      401,
    );
  }

  if (response.status === 403 && isRateLimited(response)) {
    throw new GitHubApiError(
      "rate_limit",
      "GitHub API rate limit reached. Add a token or try again later.",
      429,
    );
  }

  if (response.status === 404) {
    const repoAccessible = await repoExists(options.owner, options.repo, options.token);

    if (!repoAccessible) {
      throw new GitHubApiError(
        "private_repo",
        "This repository is private or inaccessible. Provide a GitHub token with access to continue.",
        403,
      );
    }

    throw new GitHubApiError("pr_not_found", options.notFoundMessage, 404);
  }

  const message = await response.text();

  throw new GitHubApiError(
    "github_request_failed",
    `GitHub request failed with status ${response.status}. ${message}`.trim(),
    response.status,
  );
}
