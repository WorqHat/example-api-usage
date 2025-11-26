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
  { id: "quickstart", title: "Quickstart", href: "/docs/quickstart", segment: "Get started" },
  { id: "get-started", title: "Get Started Guide", href: "/docs/get-started", segment: "Get started" },
  { id: "worqhat-wizard", title: "WorqHat Wizard", href: "/docs/worqhat-wizard", segment: "Get started" },
  { id: "rate-limit", title: "Rate Limits", href: "/docs/rate-limit", segment: "Get started" },

  // Database
  { id: "database", title: "Overview", href: "/docs/database", segment: "Database" },
  { id: "database/cluster", title: "Cluster", href: "/docs/database/cluster", segment: "Database" },
  { id: "database/delete", title: "Delete", href: "/docs/database/delete", segment: "Database" },
  { id: "database/detect-anomalies", title: "Detect Anomalies", href: "/docs/database/detect-anomalies", segment: "Database" },
  { id: "database/find-similar", title: "Find Similar", href: "/docs/database/find-similar", segment: "Database" },
  { id: "database/hybrid-search", title: "Hybrid Search", href: "/docs/database/hybrid-search", segment: "Database" },
  { id: "database/insert", title: "Insert", href: "/docs/database/insert", segment: "Database" },
  { id: "database/natural-language-query", title: "Natural Language Query", href: "/docs/database/natural-language-query", segment: "Database" },
  { id: "database/query", title: "Query", href: "/docs/database/query", segment: "Database" },
  { id: "database/recommend", title: "Recommend", href: "/docs/database/recommend", segment: "Database" },
  { id: "database/semantic-search", title: "Semantic Search", href: "/docs/database/semantic-search", segment: "Database" },
  { id: "database/update", title: "Update", href: "/docs/database/update", segment: "Database" },

  // Policies
  { id: "policies/acceptable-use-policy", title: "Acceptable Use Policy", href: "/docs/policies/acceptable-use-policy", segment: "Policies" },
  { id: "policies/bugs-disclosure-policy", title: "Bugs Disclosure Policy", href: "/docs/policies/bugs-disclosure-policy", segment: "Policies" },
  { id: "policies/data-usage-policy", title: "Data Usage Policy", href: "/docs/policies/data-usage-policy", segment: "Policies" },
  { id: "policies/privacy-policy", title: "Privacy Policy", href: "/docs/policies/privacy-policy", segment: "Policies" },
  { id: "policies/terms-of-services", title: "Terms of Services", href: "/docs/policies/terms-of-services", segment: "Policies" },

  // Storage
  { id: "storage/delete", title: "Delete File", href: "/docs/storage/delete", segment: "Storage" },
  { id: "storage/fetch-by-id", title: "Fetch by ID", href: "/docs/storage/fetch-by-id", segment: "Storage" },
  { id: "storage/fetch-by-path", title: "Fetch by Path", href: "/docs/storage/fetch-by-path", segment: "Storage" },
  { id: "storage/upload", title: "Upload File", href: "/docs/storage/upload", segment: "Storage" },

  // System
  { id: "system/health", title: "Health Check", href: "/docs/system/health", segment: "System" },
  { id: "system/info", title: "System Info", href: "/docs/system/info", segment: "System" },

  // Workflows
  { id: "workflows", title: "Overview", href: "/docs/workflows", segment: "Workflows" },
  { id: "workflows/metrics", title: "Metrics", href: "/docs/workflows/metrics", segment: "Workflows" },
  { id: "workflows/trigger-a-workflow-with-file-upload-or-url", title: "Trigger with File", href: "/docs/workflows/trigger-a-workflow-with-file-upload-or-url", segment: "Workflows" },
  { id: "workflows/trigger-a-workflow-with-json-payload", title: "Trigger with JSON", href: "/docs/workflows/trigger-a-workflow-with-json-payload", segment: "Workflows" },
];

