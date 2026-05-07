import samplePrMetadata from "@/fixtures/github/sample-pr-metadata.json";
import sampleRiskyPrFiles from "@/fixtures/github/sample-risky-pr-files.json";
import type { GitHubPrFile, GitHubPrMetadata } from "@/lib/github/types";

export function getDemoPullRequestFixture() {
  return samplePrMetadata as GitHubPrMetadata;
}

export function getDemoChangedFilesFixture() {
  return sampleRiskyPrFiles as GitHubPrFile[];
}
