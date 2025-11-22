"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LOGO_URL = "https://assets.worqhat.com/logos/worqhat-logo-dark.png";

const navTabs = [
  { label: "Docs", href: "/docs" },
  { label: "API reference", href: "/api-reference" },
  { label: "Cookbook", href: "/cookbook" },
  { label: "Changelog", href: "/changelog" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black px-6 py-4 text-white">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Image
            src={LOGO_URL}
            alt="WorqHat"
            width={120}
            height={60}
            priority
            className="h-12 w-auto"
          />
        </div>

        <nav className="flex items-center gap-1">
          {navTabs.map((tab) => {
            const isActive =
              pathname === tab.href || (pathname === "/" && tab.href === "/api-reference");
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-white/60 hover:text-white/80"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20">
            Log in
          </button>
          <button className="rounded-lg bg-white px-4 py-2 text-sm text-black transition-colors hover:bg-white/90">
            Sign up
          </button>
        </div>
      </div>
    </header>
  );
}

