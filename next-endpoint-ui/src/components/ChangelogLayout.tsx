"use client";

import { useId } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import { ChangelogIntro, ChangelogIntroFooter } from "./ChangelogIntro";
import { StarField } from "./StarField";
import { FormattedDate } from "./FormattedDate";

function Timeline() {
  const id = useId();

  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden lg:right-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-[32rem] lg:overflow-visible">
      <svg
        className="absolute left-[max(0px,calc(50%-18.125rem))] top-0 h-full w-1.5 lg:left-full lg:ml-1 xl:left-auto xl:right-1 xl:ml-0"
        aria-hidden="true"
      >
        <defs>
          <pattern id={id} width="6" height="8" patternUnits="userSpaceOnUse">
            <path
              d="M0 0H6M0 8H6"
              className="stroke-sky-900/10 dark:stroke-white/10 xl:stroke-white/10"
              fill="none"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}

function Glow() {
  const id = useId();

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-gray-950 lg:right-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-[32rem]">
      <svg
        className="absolute -bottom-48 left-[-40%] h-[80rem] w-[180%] lg:-right-40 lg:bottom-auto lg:left-auto lg:top-[-40%] lg:h-[180%] lg:w-[80rem]"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`${id}-desktop`} cx="100%">
            <stop offset="0%" stopColor="rgba(56, 189, 248, 0.3)" />
            <stop offset="53.95%" stopColor="rgba(0, 71, 255, 0.09)" />
            <stop offset="100%" stopColor="rgba(10, 14, 23, 0)" />
          </radialGradient>
          <radialGradient id={`${id}-mobile`} cy="100%">
            <stop offset="0%" stopColor="rgba(56, 189, 248, 0.3)" />
            <stop offset="53.95%" stopColor="rgba(0, 71, 255, 0.09)" />
            <stop offset="100%" stopColor="rgba(10, 14, 23, 0)" />
          </radialGradient>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#${id}-desktop)`}
          className="hidden lg:block"
        />
        <rect
          width="100%"
          height="100%"
          fill={`url(#${id}-mobile)`}
          className="lg:hidden"
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 right-0 h-px bg-white mix-blend-overlay lg:left-auto lg:top-0 lg:h-auto lg:w-px" />
    </div>
  );
}

function FixedSidebar({ main, footer }: { main: React.ReactNode; footer: React.ReactNode }) {
  return (
    <div className="relative flex-none overflow-hidden lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex lg:px-0">
      <Glow />
      <div className="relative flex w-full lg:pointer-events-auto lg:mr-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-[32rem] lg:overflow-y-auto lg:overflow-x-hidden lg:pl-[max(4rem,calc(50%-38rem))]">
        <div className="mx-auto max-w-lg lg:mx-0 lg:flex lg:w-96 lg:max-w-none lg:flex-col lg:before:flex-1 lg:before:pt-6">
          <div className="pb-16 pt-20 sm:pb-20 sm:pt-32 lg:py-20">
            {/* Background image container */}
            <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#050A30] via-black to-[#050A30]" />
              <div className="absolute inset-0 bg-black/70" />
            </div>
            <div className="relative px-6">
              <StarField />
              {main}
            </div>
          </div>
          <div className="flex flex-1 items-end justify-center pb-4 lg:justify-start lg:pb-6">
            <div className="relative z-50">{footer}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

type ChangelogLayoutProps = {
  children: React.ReactNode;
};

export default function ChangelogLayout({ children }: ChangelogLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col text-white">
      <SiteHeader />
      <div className="relative flex-auto pt-16">
        <FixedSidebar main={<ChangelogIntro />} footer={<ChangelogIntroFooter />} />
        <div className="flex gap-1"></div>
        <div className="relative flex-auto">
          <Timeline />
          <main className="space-y-20 py-20 sm:space-y-32 sm:py-32">{children}</main>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

function ContentWrapper({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:flex lg:px-8">
      <div className="lg:ml-96 lg:flex lg:w-full lg:justify-end lg:pl-32">
        <div
          className={`mx-auto max-w-lg lg:mx-0 lg:w-0 lg:max-w-xl lg:flex-auto ${className || ""}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function ArticleHeader({ id, date }: { id: string; date: string }) {
  return (
    <header className="relative mb-10 xl:mb-0">
      <div className="pointer-events-none absolute left-[max(-0.5rem,calc(50%-18.625rem))] top-0 z-50 flex h-4 items-center justify-end gap-x-2 lg:left-0 lg:right-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-[32rem] xl:h-8">
        <Link href={`#${id}`} className="inline-flex">
          <FormattedDate
            date={date}
            className="hidden xl:pointer-events-auto xl:block xl:text-[0.6875rem] xl:leading-4 xl:font-medium xl:text-white/50"
          />
        </Link>
        <div className="h-[0.0625rem] w-3.5 bg-gray-400 lg:-mr-3.5 xl:mr-0 xl:bg-gray-300" />
      </div>
      <ContentWrapper>
        <div className="flex">
          <Link href={`#${id}`} className="inline-flex">
            <FormattedDate
              date={date}
              className="text-[0.6875rem] leading-4 font-medium text-gray-500 dark:text-white/50 xl:hidden"
            />
          </Link>
        </div>
      </ContentWrapper>
    </header>
  );
}

export function Article({
  id,
  title,
  date,
  children,
}: {
  id: string;
  title: string;
  date: string;
  children: React.ReactNode;
}) {
  return (
    <article id={id} className="scroll-mt-16">
      <ArticleHeader id={id} date={date} />
      <ContentWrapper className="typography">
        <h2 className="mb-4 text-3xl font-semibold text-white">{title}</h2>
        {children}
      </ContentWrapper>
    </article>
  );
}

export function ChangelogImage(props: React.ComponentProps<typeof Image>) {
  const { alt = "", sizes = "(min-width: 1280px) 36rem, (min-width: 1024px) 45vw, (min-width: 640px) 32rem, 95vw", ...restProps } = props;
  return (
    <div className="relative mt-8 overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-900 [&+*]:mt-8">
      <Image
        alt={alt}
        sizes={sizes}
        {...restProps}
      />
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10 dark:ring-white/10" />
    </div>
  );
}

