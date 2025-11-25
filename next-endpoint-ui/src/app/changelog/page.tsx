import React from "react";

import ChangelogLayout, { Article, ChangelogImage } from "@/components/ChangelogLayout";
import { getChangelogContent, parseChangelogArticles } from "@/lib/changelog";
import { MDXRemote } from "next-mdx-remote/rsc";
import MDXCodeBlock from "@/components/MDXCodeBlock";
import { SparkleIcon } from "@/components/SparkleIcon";
import { Badge } from "@/components/Badge";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const mdxComponents = {
  code: MDXCodeBlock,
  img: ChangelogImage,
  Image: ChangelogImage,
  SparkleIcon,
  Badge,
  ExternalLink,
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    // Extract date from h2 if present
    const text = typeof children === "string" ? children : "";
    const dateMatch = text.match(/\{\{ date:\s*['"](.+?)['"]\s*\}\}/);
    const title = dateMatch ? text.replace(/\{\{ date:\s*['"](.+?)['"]\s*\}\}/, "").trim() : text;
    const date = dateMatch ? dateMatch[1] : "";
    const id = generateId(title);

    if (date) {
      // This will be handled by the Article component
      return null;
    }

    return (
      <h2
        id={id}
        className="mb-4 mt-8 scroll-mt-6 text-2xl font-semibold text-white"
        {...props}
      >
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = typeof children === "string" ? generateId(children) : "";
    return (
      <h3
        id={id}
        className="mb-3 mt-6 scroll-mt-6 text-xl font-semibold text-white"
        {...props}
      >
        {children}
      </h3>
    );
  },
  p: ({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
    const childArray = React.Children.toArray(children);
    const hasParagraphChild = childArray.some(
      (child) => React.isValidElement(child) && child.type === "p"
    );

    if (hasParagraphChild) {
      return (
        <>
          {childArray}
        </>
      );
    }

    const finalClassName = className || "mb-4 leading-7 text-white/80";
    return (
      <p className={finalClassName} {...props}>
        {children}
      </p>
    );
  },
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-sky-400 no-underline hover:underline"
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-4 ml-6 list-disc text-white/80" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mb-4 ml-6 list-decimal text-white/80" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="mb-2" {...props} />
  ),
  div: (props: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...props} />
  ),
};

export default async function ChangelogPage() {
  const content = getChangelogContent();
  
  if (!content) {
    return (
      <ChangelogLayout>
        <div className="text-white">No changelog content available.</div>
      </ChangelogLayout>
    );
  }

  const articles = parseChangelogArticles(content);

  return (
    <ChangelogLayout>
      {articles.map((article) => {
        // Remove the h2 with date from content since Article component will handle it
        const contentWithoutH2 = article.content.replace(
          /^##\s+.+?\{\{ date:\s*['"].+?['"]\s*\}\}/m,
          ""
        );

        return (
          <Article
            key={article.id}
            id={article.id}
            title={article.title}
            date={article.date}
          >
            <MDXRemote source={contentWithoutH2} components={mdxComponents} />
          </Article>
        );
      })}
    </ChangelogLayout>
  );
}
