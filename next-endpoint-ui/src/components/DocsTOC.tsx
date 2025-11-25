"use client";

import { useEffect, useState } from "react";

import { createSlugger } from "@/lib/slugger";

type TOCItem = {
  id: string;
  text: string;
  level: number;
};

type DocsTOCProps = {
  content: string;
};

function extractTOCItems(content: string): TOCItem[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const items: TOCItem[] = [];
  let match;
  const slugger = createSlugger();

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = slugger(text);

    items.push({ id, text, level });
  }

  return items;
}

export default function DocsTOC({ content }: DocsTOCProps) {
  const tocItems = extractTOCItems(content);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -66%",
        threshold: 0,
      }
    );

    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => {
      tocItems.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [tocItems]);

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <aside className="hidden xl:block w-64 flex-shrink-0 border-l border-white/10 bg-black/50 p-6">
      <div className="sticky top-24">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
            On this page
          </div>
          <button className="text-white/40 hover:text-white/60">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="4" width="12" height="1.5" rx="0.75" fill="currentColor" />
              <rect x="2" y="7.25" width="12" height="1.5" rx="0.75" fill="currentColor" />
              <rect x="2" y="10.5" width="12" height="1.5" rx="0.75" fill="currentColor" />
            </svg>
          </button>
        </div>
        <nav className="space-y-1">
          {tocItems.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(item.id);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                    setActiveId(item.id);
                  }
                }}
                className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
                  item.level === 1
                    ? "font-medium"
                    : item.level === 2
                      ? "pl-6"
                      : "pl-9 text-xs"
                } ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white/80"
                }`}
              >
                {item.text}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

