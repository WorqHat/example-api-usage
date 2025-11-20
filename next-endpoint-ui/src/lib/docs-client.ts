// Client-safe exports for docs (no Node.js dependencies)

export type DocItem = {
  id: string;
  title: string;
  href: string;
  segment?: string;
};

export const docSections: DocItem[] = [
  { id: "getting-started", title: "Getting Started", href: "/docs/getting-started", segment: "Get started" },
  { id: "authentication", title: "Authentication", href: "/docs/authentication", segment: "Get started" },
  { id: "database", title: "Database Operations", href: "/docs/database", segment: "Core concepts" },
  { id: "workflows", title: "Workflows", href: "/docs/workflows", segment: "Core concepts" },
];

