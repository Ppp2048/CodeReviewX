import type { AnalyzerResult } from "@/lib/analyzer/types";

export type ParsedPrUrl = {
  owner: string;
  repo: string;
  pullNumber: number;
  normalizedUrl: string;
};

export type GitHubPrMetadata = {
  id: number;
  number: number;
  title: string;
  state: string;
  draft: boolean;
  html_url: string;
  user: {
    login: string;
  };
  additions: number;
  deletions: number;
  changed_files: number;
  commits: number;
  created_at: string;
  updated_at: string;
  body: string | null;
  head: {
    ref: string;
    sha: string;
  };
  base: {
    ref: string;
    sha: string;
  };
};

export type GitHubPrFile = {
  sha: string;
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
  blob_url: string;
  raw_url: string;
  contents_url: string;
  patch?: string;
};

export type AnalyzeGitHubPrResult = {
  source: "github_pr";
  parsed: ParsedPrUrl;
  pullRequest: GitHubPrMetadata;
  files: GitHubPrFile[];
  analysis: AnalyzerResult;
};
