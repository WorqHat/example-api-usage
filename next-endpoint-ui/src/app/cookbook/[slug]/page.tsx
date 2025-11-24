import PageLayout from "@/components/PageLayout";
import CookbookLayout from "@/components/CookbookLayout";
import { getCookbookContent, getAllCookbookItems, getAvatarPathForAuthor } from "@/lib/cookbook";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import MDXCodeBlock from "@/components/MDXCodeBlock";
import type { Metadata } from "next";

type CookbookPageProps = {
  params: Promise<{ slug: string }>;
};

const DEFAULT_ICON = "https://assets.worqhat.com/logos/worqhat-icon.png";
const DEFAULT_OG_IMAGE = "https://assets.worqhat.com/logos/worqhat-logo-dark.png";
const DEFAULT_DESCRIPTION =
  "Explore WorqHat cookbook recipes showcasing advanced workflows, SDK patterns, and production-ready automations.";
const SITE_NAME = "WorqHat Cookbook";

function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const components = {
  code: MDXCodeBlock,
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    // MDXRemote wraps code blocks in pre tags, but our MDXCodeBlock handles everything
    // So we just pass through the children
    if (children && typeof children === 'object' && 'props' in children) {
      return <>{children}</>;
    }
    // Fallback for plain pre tags
    return (
      <pre className="mb-4 overflow-x-auto rounded-lg bg-black/90 border border-white/10 p-4 text-white/80" {...props}>
        {children}
      </pre>
    );
  },
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = typeof children === "string" ? generateId(children) : "";
    return (
      <h1
        id={id}
        className="mb-6 scroll-mt-6 text-4xl font-bold text-white hidden"
        {...props}
      >
        {children}
      </h1>
    );
  },
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = typeof children === "string" ? generateId(children) : "";
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
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-4 leading-7 text-white/80" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-[#1A4289] no-underline hover:underline"
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
};

function extractDescription(markdown: string, fallback: string = DEFAULT_DESCRIPTION) {
  const stripped = markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[#>*_~\-]+/g, "")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

  if (!stripped) return fallback;
  return stripped.length > 160 ? `${stripped.slice(0, 157)}...` : stripped;
}

export async function generateMetadata({ params }: CookbookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = getCookbookContent(slug);

  if (!result) {
    return {
      title: `${SITE_NAME}`,
      description: DEFAULT_DESCRIPTION,
      icons: {
        icon: DEFAULT_ICON,
        shortcut: DEFAULT_ICON,
        apple: DEFAULT_ICON,
      },
      openGraph: {
        title: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        images: [DEFAULT_OG_IMAGE],
      },
      twitter: {
        card: "summary_large_image",
        title: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        images: [DEFAULT_OG_IMAGE],
      },
    };
  }

  const { content, data } = result;
  const title = data.title ? `${data.title} | ${SITE_NAME}` : SITE_NAME;
  const description = data.description || extractDescription(content);
  const ogImage = data.ogImage || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    icons: {
      icon: DEFAULT_ICON,
      shortcut: DEFAULT_ICON,
      apple: DEFAULT_ICON,
    },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: data.date || undefined,
      images: [ogImage],
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export async function generateStaticParams() {
  const items = getAllCookbookItems();
  return items.map((item) => ({
    slug: item.id,
  }));
}

export default async function CookbookSlugPage({ params }: CookbookPageProps) {
  const { slug } = await params;
  const result = getCookbookContent(slug);

  if (!result) {
    notFound();
  }

  const { content, data } = result;
  
  // Map authors with avatar paths
  const authors = (data.authors || []).map((author) => ({
    name: author.name,
    username: author.username,
    avatar: getAvatarPathForAuthor(author.username),
  }));

  // Extract title from first h1 in content if not in frontmatter
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const itemTitle = data.title || (titleMatch ? titleMatch[1] : slug);

  // Get all cookbook items for the sidebar
  const allItems = getAllCookbookItems();

  return (
    <PageLayout>
      <CookbookLayout
        content={content}
        title={itemTitle}
        date={data.date || ""}
        tags={data.tags || []}
        authors={authors}
        cookbookItems={allItems}
        videoUrl={data.videoUrl}
        videoPoster={data.videoPoster}
        videoDescription={data.videoDescription}
      >
        <MDXRemote source={content} components={components} />
      </CookbookLayout>
    </PageLayout>
  );
}

