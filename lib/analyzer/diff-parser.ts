import type { GitHubPrFile } from "@/lib/github/types";

function normalizeFilePath(filePath: string) {
  return filePath.replace(/^a\//, "").replace(/^b\//, "");
}

function deriveStatus(section: string, filePath: string) {
  if (section.includes("new file mode")) {
    return "added";
  }

  if (section.includes("deleted file mode")) {
    return "removed";
  }

  const renameMatch = section.match(/^rename to (.+)$/m);
  if (renameMatch?.[1]) {
    return "renamed";
  }

  if (filePath === "/dev/null") {
    return "removed";
  }

  return "modified";
}

export function parseUnifiedDiff(diffText: string): GitHubPrFile[] {
  const normalized = diffText.replace(/\r\n/g, "\n").trim();

  if (!normalized) {
    return [];
  }

  const sections = normalized
    .split(/^diff --git /m)
    .map((section, index) => (index === 0 ? section : `diff --git ${section}`))
    .filter((section) => section.trim().length > 0);

  return sections.flatMap((section, index) => {
    const plusLineMatch = section.match(/^\+\+\+ (.+)$/m);
    const renameMatch = section.match(/^rename to (.+)$/m);
    const fallbackHeaderMatch = section.match(/^diff --git a\/(.+?) b\/(.+)$/m);

    const rawPath =
      renameMatch?.[1] ??
      plusLineMatch?.[1] ??
      fallbackHeaderMatch?.[2];

    if (!rawPath || rawPath === "/dev/null") {
      return [];
    }

    const filename = normalizeFilePath(rawPath.trim());
    const patch = section.trim();
    const additions = patch
      .split("\n")
      .filter((line) => line.startsWith("+") && !line.startsWith("+++")).length;
    const deletions = patch
      .split("\n")
      .filter((line) => line.startsWith("-") && !line.startsWith("---")).length;

    return [
      {
        sha: `diff-${index + 1}`,
        filename,
        status: deriveStatus(patch, rawPath),
        additions,
        deletions,
        changes: additions + deletions,
        blob_url: "",
        raw_url: "",
        contents_url: "",
        patch,
      } satisfies GitHubPrFile,
    ];
  });
}
