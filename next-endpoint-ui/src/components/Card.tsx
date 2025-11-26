"use client";

import Link from "next/link";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";

type CardProps = {
  title: string;
  icon?: string;
  href?: string;
  children: React.ReactNode;
};

export default function Card({ title, icon, href, children }: CardProps) {
  const Content = (
    <div className="group relative rounded-lg border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {href && (
          <ArrowTopRightIcon className="h-5 w-5 text-white/40 transition-colors group-hover:text-white" />
        )}
      </div>
      <div className="mt-2 text-sm text-white/60">{children}</div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block my-4 no-underline">
        {Content}
      </Link>
    );
  }

  return <div className="my-4">{Content}</div>;
}
