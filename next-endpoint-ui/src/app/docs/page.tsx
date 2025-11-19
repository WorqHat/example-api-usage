import PageLayout from "@/components/PageLayout";

export default function DocsPage() {
  return (
    <PageLayout>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="mb-8 text-4xl font-bold text-white">Documentation</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Workflows-style cards */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10">
            <h2 className="mb-2 text-xl font-semibold text-white">Getting Started</h2>
            <p className="text-sm text-white/70">
              Learn the basics of WorqHat API and how to make your first request.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10">
            <h2 className="mb-2 text-xl font-semibold text-white">Authentication</h2>
            <p className="text-sm text-white/70">
              Understand how to authenticate your requests with API keys.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10">
            <h2 className="mb-2 text-xl font-semibold text-white">Database Operations</h2>
            <p className="text-sm text-white/70">
              Insert, query, update, and delete records in WorqHat tables.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10">
            <h2 className="mb-2 text-xl font-semibold text-white">Workflows</h2>
            <p className="text-sm text-white/70">
              Trigger and manage automated workflows with JSON, files, or URLs.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10">
            <h2 className="mb-2 text-xl font-semibold text-white">Storage</h2>
            <p className="text-sm text-white/70">
              Upload, manage, and retrieve files from WorqHat storage.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10">
            <h2 className="mb-2 text-xl font-semibold text-white">Best Practices</h2>
            <p className="text-sm text-white/70">
              Learn recommended patterns and optimization techniques.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

