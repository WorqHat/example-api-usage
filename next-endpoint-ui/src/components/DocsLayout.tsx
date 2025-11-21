"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { docSections } from "@/lib/docs-client";
import DocsTOC from "@/components/DocsTOC";
import CopyPageButton from "@/components/CopyPageButton";

type DocsLayoutProps = {
  children: React.ReactNode;
  content?: string;
  title?: string;
  segment?: string;
};

export default function DocsLayout({
  children,
  content = "",
  title,
  segment,
}: DocsLayoutProps) {
  const pathname = usePathname();

  // Group docs by segment
  const groupedDocs = docSections.reduce((acc, doc) => {
    const seg = doc.segment || "Other";
    if (!acc[seg]) {
      acc[seg] = [];
    }
    acc[seg].push(doc);
    return acc;
  }, {} as Record<string, typeof docSections>);

  return (
    <div className="flex min-h-screen text-white">
      <aside className="sticky top-16 h-[calc(100vh-4rem)] w-full overflow-y-auto border-r border-white/10 bg-black/50 p-6 lg:max-w-[280px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <nav className="space-y-6">
          {Object.entries(groupedDocs).map(([sectionName, docs]) => (
            <div key={sectionName}>
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
                {sectionName}
              </div>
              <div className="space-y-1">
                {docs.map((doc) => {
                  const isActive = pathname === doc.href;
                  return (
                    <Link
                      key={doc.id}
                      href={doc.href}
                      className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:bg-white/5 hover:text-white/80"
                      }`}
                    >
                      {doc.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-8 text-white [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="mx-auto max-w-4xl">
          {(segment || title) && (
            <div className="mb-8">
              {segment && (
                <div className="mb-2 text-sm text-white/60">{segment}</div>
              )}
              {title && (
                <div className="mb-4 flex items-start justify-between gap-4">
                  <h1 className="text-4xl font-bold text-white">{title}</h1>
                  {content && (
                    <CopyPageButton content={content} title={title} />
                  )}
                </div>
              )}
            </div>
          )}
          <div className="prose prose-invert max-w-none prose-headings:text-white prose-h1:text-4xl prose-h1:font-bold prose-h1:scroll-mt-6 prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4 prose-h2:scroll-mt-6 prose-h3:scroll-mt-6 prose-p:text-white/80 prose-p:leading-7 prose-a:text-[#1A4289] prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:text-[#FDCEB0] prose-code:bg-black/40 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-black/90 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg prose-pre:p-4">
            {children}
          </div>
        </div>
      </main>
      <DocsTOC content={content} />
    </div>
  );
}

