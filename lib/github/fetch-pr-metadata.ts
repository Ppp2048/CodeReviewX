import { fetchGitHubJson } from "@/lib/github/client";
import type { GitHubPrMetadata } from "@/lib/github/types";

type FetchPrMetadataInput = {
  owner: string;
  repo: string;
  pullNumber: number;
  token?: string;
};

export async function fetchPrMetadata({
  owner,
  repo,
  pullNumber,
  token,
}: FetchPrMetadataInput) {
  return fetchGitHubJson<GitHubPrMetadata>(`/repos/${owner}/${repo}/pulls/${pullNumber}`, {
    token,
    owner,
    repo,
    notFoundMessage: "Pull request not found.",
  });
}
