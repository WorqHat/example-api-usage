// Client-safe exports for docs (no Node.js dependencies)

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

