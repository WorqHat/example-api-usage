import fs from "fs";
import path from "path";

export type ChangelogEntry = {
  id: string;
  title: string;
  date: string;
  content: string;
};

export function getChangelogContent(): string | null {
  try {
    const filePath = path.join(process.cwd(), "src", "content", "changelog", "index.mdx");
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf-8");
    }
    return null;
  } catch {
    return null;
  }
}

export function parseChangelogArticles(content: string): ChangelogEntry[] {
  const articles: ChangelogEntry[] = [];
  
  // Split by horizontal rules (---)
  const sections = content.split(/^---$/m).map(s => s.trim()).filter(s => s);
  
  for (const section of sections) {
    // Extract h2 with date - match can be anywhere in the section
    const h2Match = section.match(/##\s+(.+?)\{\{ date:\s*['"](.+?)['"]\s*\}\}/);
    if (h2Match) {
      const title = h2Match[1].trim();
      const date = h2Match[2].trim();
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      
      articles.push({
        id,
        title,
        date,
        content: section,
      });
    }
  }
  
  return articles;
}

