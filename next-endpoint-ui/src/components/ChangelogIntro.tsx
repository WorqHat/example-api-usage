"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen, Rss } from "lucide-react";

function ArrowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M7.28033 3.21967C6.98744 2.92678 6.51256 2.92678 6.21967 3.21967C5.92678 3.51256 5.92678 3.98744 6.21967 4.28033L7.28033 3.21967ZM11 8L11.5303 8.53033C11.8232 8.23744 11.8232 7.76256 11.5303 7.46967L11 8ZM6.21967 11.7197C5.92678 12.0126 5.92678 12.4874 6.21967 12.7803C6.51256 13.0732 6.98744 13.0732 7.28033 12.7803L6.21967 11.7197ZM6.21967 4.28033L10.4697 8.53033L11.5303 7.46967L7.28033 3.21967L6.21967 4.28033ZM10.4697 7.46967L6.21967 11.7197L7.28033 12.7803L11.5303 8.53033L10.4697 7.46967Z" />
    </svg>
  );
}

export function ChangelogIntro() {
  return (
    <>
      <Image
        src="https://assets.worqhat.com/logos/worqhat-logo-dark.png"
        alt="WorqHat"
        width={220}
        height={0}
        style={{ height: "auto" }}
        className="h-auto"
      />
      <h1 className="mt-4 text-4xl font-light leading-tight text-white">
        <span className="text-sky-300">Your AI Sidekick</span>
        <br />
      </h1>

      <p className="my-8 text-lg leading-6 text-gray-300">
        Build applications that are private, secure, and easy to use with ZERO
        dev-time.
      </p>

      <p className="mt-4 text-sm leading-6 text-gray-300">
        You can focus on running your business, let us handle the rest.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-x-1 gap-y-3 sm:gap-x-2 lg:justify-start">
        <Link
          href="https://worqhat.com"
          className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white transition-colors hover:bg-white/10"
        >
          Try Now
          <ArrowIcon className="h-4 w-4" />
        </Link>
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white transition-colors hover:bg-white/10"
        >
          <BookOpen className="h-4 w-4" />
          API Docs
        </Link>
        <Link
          href="https://blog.worqhat.com/"
          className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white transition-colors hover:bg-white/10"
        >
          <Rss className="h-4 w-4" />
          Blog
        </Link>
      </div>
    </>
  );
}

export function ChangelogIntroFooter() {
  return (
    <p className="inline-flex items-center gap-x-2 text-[0.8125rem] leading-6 text-gray-500">
      Brought to you by{" "}
      <Link
        href="https://x.com/worqhat"
        className="group inline-flex items-center gap-x-1 rounded-md px-2 py-1 transition-colors hover:bg-gray-800/90"
      >
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          fill="currentColor"
          className="h-4 w-4 text-gray-500 group-hover:text-blue-400"
        >
          <path d="M5.526 13.502c5.032 0 7.784-4.168 7.784-7.783 0-.119 0-.237-.008-.353a5.566 5.566 0 0 0 1.364-1.418 5.46 5.46 0 0 1-1.571.431c.571-.342.998-.88 1.203-1.513a5.483 5.483 0 0 1-1.737.664 2.738 2.738 0 0 0-4.662 2.495 7.767 7.767 0 0 1-5.638-2.858 2.737 2.737 0 0 0 .847 3.651 2.715 2.715 0 0 1-1.242-.341v.035a2.737 2.737 0 0 0 2.195 2.681 2.73 2.73 0 0 1-1.235.047 2.739 2.739 0 0 0 2.556 1.9 5.49 5.49 0 0 1-4.049 1.133A7.744 7.744 0 0 0 5.526 13.5" />
        </svg>
        <span className="group-hover:text-white">WorqHat</span>
      </Link>
    </p>
  );
}

