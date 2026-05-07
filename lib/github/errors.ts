export type GitHubErrorCode =
  | "invalid_pr_url"
  | "private_repo"
  | "rate_limit"
  | "pr_not_found"
  | "unauthorized"
  | "github_request_failed";

export class GitHubApiError extends Error {
  code: GitHubErrorCode;
  status: number;

  constructor(code: GitHubErrorCode, message: string, status: number) {
    super(message);
    this.name = "GitHubApiError";
    this.code = code;
    this.status = status;
  }
}
