import fs from "fs";
import path from "path";
import type { DocItem } from "./docs-client";
import { docSections } from "./docs-client";

// Re-export type for convenience
export type { DocItem } from "./docs-client";

// Server-only: uses Node.js fs module
export function getDocContent(docId: string): string | null {
  try {
    const filePath = path.join(
      process.cwd(),
      "src",
      "content",
      "docs",
      `${docId}.mdx`
    );
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

// Client-safe: only uses the docSections array
export function getDocById(docId: string): DocItem | undefined {
  return docSections.find((doc) => doc.id === docId);
}

