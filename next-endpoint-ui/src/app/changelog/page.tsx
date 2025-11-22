import PageLayout from "@/components/PageLayout";

export default function ChangelogPage() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#050A30] via-black to-[#050A30]">
        <div className="mx-auto max-w-4xl px-8 py-16">
          <div className="mb-12">
            <h1 className="mb-4 text-5xl font-bold text-white">Changelog</h1>
            <p className="text-lg text-white/60">
              All the latest updates, improvements, and fixes to WorqHat.
            </p>
          </div>

          <div className="space-y-8">
            {/* Sample changelog entry - can be replaced with dynamic content */}
            <div className="rounded-lg border border-white/10 bg-black/40 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">Version 1.0.0</h2>
                <span className="text-sm text-white/60">January 1, 2024</span>
              </div>
              <div className="space-y-3 text-white/80">
                <div>
                  <h3 className="mb-2 font-semibold text-white">Added</h3>
                  <ul className="ml-4 list-disc space-y-1">
                    <li>Initial release of WorqHat API</li>
                    <li>Documentation and API reference</li>
                    <li>Cookbook with examples</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

