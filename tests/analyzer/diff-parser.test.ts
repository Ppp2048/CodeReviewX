import { describe, expect, it } from "vitest";

import { parseUnifiedDiff } from "@/lib/analyzer/diff-parser";

describe("parseUnifiedDiff", () => {
  it("parses a modified file from a unified diff", () => {
    const files = parseUnifiedDiff(`diff --git a/src/auth.ts b/src/auth.ts
index 1234567..89abcde 100644
--- a/src/auth.ts
+++ b/src/auth.ts
@@ -1,2 +1,3 @@
-const mode = "legacy";
+const mode = "strict";
+const enabled = true;
 export function login() {}
`);

    expect(files).toHaveLength(1);
    expect(files[0]).toMatchObject({
      filename: "src/auth.ts",
      status: "modified",
      additions: 2,
      deletions: 1,
      changes: 3,
    });
  });

  it("detects renamed files", () => {
    const files = parseUnifiedDiff(`diff --git a/src/old.ts b/src/new.ts
similarity index 100%
rename from src/old.ts
rename to src/new.ts
--- a/src/old.ts
+++ b/src/new.ts
@@ -1 +1 @@
-export const name = "old";
+export const name = "new";
`);

    expect(files).toHaveLength(1);
    expect(files[0]?.filename).toBe("src/new.ts");
    expect(files[0]?.status).toBe("renamed");
  });
});
