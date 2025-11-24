"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import DocsTOC from "@/components/DocsTOC";
import CopyPageButton from "@/components/CopyPageButton";
import AvatarImage from "@/components/AvatarImage";
import type { Author, CookbookItem } from "@/lib/cookbook-client";

type CookbookLayoutProps = {
  children: React.ReactNode;
  content?: string;
  title?: string;
  date?: string;
  tags?: string[];
  authors?: Author[];
  cookbookItems: CookbookItem[];
};

const tagColors: Record<string, string> = {
  REASONING: "bg-yellow-400 text-black",
  RESPONSES: "bg-lime-400 text-black",
  FUNCTIONS: "bg-purple-500 text-white",
};

export default function CookbookLayout({
  children,
  content = "",
  title,
  date,
  tags = [],
  authors = [],
  cookbookItems,
}: CookbookLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen text-white">
      <aside className="sticky top-16 h-[calc(100vh-4rem)] w-full overflow-y-auto border-r border-white/10 bg-black/50 p-6 lg:max-w-[280px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="mb-6 text-xs font-semibold uppercase tracking-wider text-white/60">
          Cookbook
        </div>
        <nav className="space-y-1">
          {cookbookItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white/80"
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-8 text-white [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="mx-auto max-w-4xl">
          {title && (
            <div className="mb-8">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="mb-4 text-4xl font-bold text-white">{title}</h1>
                  <div className="mb-4 flex items-center gap-4 text-sm text-white/60">
                    {date && <span>{date}</span>}
                    {authors.length > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {authors.map((author, i) => (
                            <div
                              key={i}
                              className="relative h-6 w-6 rounded-full border-2 border-black overflow-hidden"
                            >
                              <AvatarImage
                                src={author.avatar}
                                alt={author.name}
                                username={author.username}
                                width={24}
                                height={24}
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                        <span className="text-white/60">
                          {authors[0]?.name}
                        </span>
                      </div>
                    )}
                  </div>
                  {tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className={`rounded px-2 py-1 text-xs font-semibold ${
                            tagColors[tag] || "bg-gray-700 text-white"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {content && (
                  <CopyPageButton content={content} title={title} />
                )}
              </div>
            </div>
          )}

          {title && (
            <section className="mb-10 grid gap-6 rounded-3xl border border-white/10 bg-black/50 p-6 md:grid-cols-5">
              <div className="md:col-span-3">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                  Ready-made WorqHat template
                </p>
                <h2 className="mt-4 text-2xl font-semibold text-white">
                  Launch “{title}” as a workflow
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Duplicate this recipe inside WorqHat to get the outlined triggers, nodes, and delivery
                  logic preconfigured. Update credentials, recipients, and copy, then ship it to production.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-white/60">
                  <li>• All workflow nodes referenced in this guide</li>
                  <li>• Structured JSON outputs for dashboards and mailers</li>
                  <li>• Inline documentation for faster handoffs</li>
                </ul>
              </div>
              <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-black/40 p-5 md:col-span-2">
                <div>
                  <p className="text-sm text-white/60">Get started checklist</p>
                  <ol className="mt-3 space-y-2 text-sm text-white/70">
                    <li>1. Duplicate the workflow template.</li>
                    <li>2. Connect your datasource and credentials.</li>
                    <li>3. Customize content and recipients.</li>
                  </ol>
                </div>
                <Link
                  href="https://worqhat.com"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[#FDCEB0] px-4 py-3 text-sm font-semibold text-[#050A30] transition hover:bg-[#ffdcb6]"
                >
                  Launch this template
                </Link>
              </div>
            </section>
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

