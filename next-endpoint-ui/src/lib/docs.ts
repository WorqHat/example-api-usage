import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { docSections, type DocItem } from "./docs-client";

export type { DocItem };

// Client-safe: can be imported in client components
export { docSections };

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
    const raw = fs.readFileSync(filePath, "utf-8");
    const { content } = matter(raw);
    return content.trim();
  } catch {
    return null;
  }
}

// Client-safe: only uses the docSections array
export function getDocById(docId: string): DocItem | undefined {
  return docSections.find((doc) => doc.id === docId);
}

