import { fetchGitHubJson } from "@/lib/github/client";
import type { GitHubPrFile } from "@/lib/github/types";

type FetchPrFilesInput = {
  owner: string;
  repo: string;
  pullNumber: number;
  token?: string;
};

export async function fetchPrFiles({
  owner,
  repo,
  pullNumber,
  token,
}: FetchPrFilesInput) {
  const files: GitHubPrFile[] = [];
  let page = 1;

  while (true) {
    const batch = await fetchGitHubJson<GitHubPrFile[]>(
      `/repos/${owner}/${repo}/pulls/${pullNumber}/files?per_page=100&page=${page}`,
      {
        token,
        owner,
        repo,
        notFoundMessage: "Pull request files not found.",
      },
    );

    files.push(...batch);

    if (batch.length < 100) {
      break;
    }

    page += 1;
  }

  return files;
}
