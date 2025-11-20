"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { docSections } from "@/lib/docs-client";
import DocsTOC from "@/components/DocsTOC";

type DocsLayoutProps = {
  children: React.ReactNode;
  content?: string;
};

export default function DocsLayout({ children, content = "" }: DocsLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-black text-white">
      <aside className="w-full border-r border-white/10 bg-black/50 p-6 lg:max-w-[280px]">
        <div className="mb-6 text-xs font-semibold uppercase tracking-wider text-white/60">
          Documentation
        </div>
        <nav className="space-y-1">
          {docSections.map((section) => {
            const isActive = pathname === section.href;
            return (
              <Link
                key={section.id}
                href={section.href}
                className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white/80"
                }`}
              >
                {section.title}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto bg-black p-8 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="prose prose-invert max-w-none prose-headings:text-white prose-h1:text-4xl prose-h1:font-bold prose-h1:scroll-mt-6 prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4 prose-h2:scroll-mt-6 prose-h3:scroll-mt-6 prose-p:text-white/80 prose-p:leading-7 prose-a:text-[#1A4289] prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:text-[#FDCEB0] prose-code:bg-black/40 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-black/90 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg prose-pre:p-4">
            {children}
          </div>
        </div>
      </main>
      <DocsTOC content={content} />
    </div>
  );
}

