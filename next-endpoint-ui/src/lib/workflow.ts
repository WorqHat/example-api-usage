import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type WorkflowItem = {
  id: string;
  title: string;
  href: string;
  segment: string;
};

const workflowDir = path.join(process.cwd(), "src", "content", "workflow");

let cachedSections: WorkflowItem[] | null = null;

function toTitleCase(value: string) {
  return value
    .replace(/-/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      if (word.toUpperCase() === word) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function formatSegmentName(dirName: string) {
  return toTitleCase(dirName.replace(/_/g, " "));
}

function loadSections(): WorkflowItem[] {
  if (cachedSections) {
    return cachedSections;
  }

  const sections: WorkflowItem[] = [];

  const segmentDirs = fs.readdirSync(workflowDir, { withFileTypes: true });
  for (const segmentDir of segmentDirs) {
    if (!segmentDir.isDirectory()) continue;
    const segmentName = segmentDir.name;
    const segmentLabel = formatSegmentName(segmentName);
    const segmentPath = path.join(workflowDir, segmentName);

    const files = fs.readdirSync(segmentPath, { withFileTypes: true });
    for (const file of files) {
      if (!file.isFile() || !file.name.endsWith(".mdx")) continue;
      const slug = file.name.replace(/\.mdx$/, "");
      sections.push({
        id: `${segmentName}/${slug}`,
        title: toTitleCase(slug),
        href: `/workflow/${segmentName}/${slug}`,
        segment: segmentLabel,
      });
    }
  }

  cachedSections = sections;
  return sections;
}

export function getWorkflowSections(): WorkflowItem[] {
  return loadSections();
}

export function getWorkflowById(id: string) {
  return loadSections().find((item) => item.id === id);
}

export function getWorkflowContent(id: string): string | null {
  try {
    const filePath = path.join(workflowDir, `${id}.mdx`);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { content } = matter(raw);
    return content.trim();
  } catch {
    return null;
  }
}

