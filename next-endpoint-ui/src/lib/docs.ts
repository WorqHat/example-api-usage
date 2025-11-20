import fs from "fs";
import path from "path";

export type DocItem = {
  id: string;
  title: string;
  href: string;
  segment?: string;
};

// Client-safe: can be imported in client components
export const docSections: DocItem[] = [
  { id: "getting-started", title: "Getting Started", href: "/docs/getting-started", segment: "Get started" },
  { id: "authentication", title: "Authentication", href: "/docs/authentication", segment: "Get started" },
  { id: "database", title: "Database Operations", href: "/docs/database", segment: "Core concepts" },
  { id: "workflows", title: "Workflows", href: "/docs/workflows", segment: "Core concepts" },
];

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

