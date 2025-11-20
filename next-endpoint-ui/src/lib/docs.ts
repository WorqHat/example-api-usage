import fs from "fs";
import path from "path";

export type DocItem = {
  id: string;
  title: string;
  href: string;
};

export const docSections: DocItem[] = [
  { id: "getting-started", title: "Getting Started", href: "/docs/getting-started" },
  { id: "authentication", title: "Authentication", href: "/docs/authentication" },
  { id: "database", title: "Database Operations", href: "/docs/database" },
  { id: "workflows", title: "Workflows", href: "/docs/workflows" },
];

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

export function getDocById(docId: string): DocItem | undefined {
  return docSections.find((doc) => doc.id === docId);
}

