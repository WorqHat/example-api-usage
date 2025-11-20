"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { docSections } from "@/lib/docs";

type DocsLayoutProps = {
  children: React.ReactNode;
};

export default function DocsLayout({ children }: DocsLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-black text-white">
      <aside className="w-full space-y-4 rounded-3xl border border-black/10 bg-white p-5 shadow-2xl shadow-black/20 lg:max-w-xs">
        <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-black/50">
          <span>Documentation</span>
        </div>
        <nav className="space-y-3">
          {docSections.map((section) => {
            const isActive = pathname === section.href;
            return (
              <Link
                key={section.id}
                href={section.href}
                className={`block rounded-2xl border px-4 py-3 text-left transition ${
                  isActive
                    ? "border-[#050A30] bg-[#050A30] text-white shadow-lg shadow-[#050A30]/30"
                    : "border-black/5 bg-white text-[#050A30] hover:border-[#1A4289]/40 hover:bg-[#f7f8fb]"
                }`}
              >
                <p
                  className={`text-sm font-semibold ${
                    isActive ? "text-white" : "text-[#050A30]"
                  }`}
                >
                  {section.title}
                </p>
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-black via-[#050A30] to-black p-8 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="prose prose-invert max-w-none prose-headings:text-white prose-h1:text-4xl prose-h1:font-bold prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4 prose-p:text-white/80 prose-p:leading-7 prose-a:text-[#1A4289] prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:text-[#FDCEB0] prose-code:bg-black/40 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-black/90 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg prose-pre:p-4">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

