import PageLayout from "@/components/PageLayout";
import CookbookLayout from "@/components/CookbookLayout";
import { getCookbookContent, getAllCookbookItems, getAvatarPathForAuthor } from "@/lib/cookbook";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import MDXCodeBlock from "@/components/MDXCodeBlock";

type CookbookPageProps = {
  params: Promise<{ slug: string }>;
};

function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const components = {
  code: MDXCodeBlock,
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
      >
        <MDXRemote source={content} components={components} />
      </CookbookLayout>
    </PageLayout>
  );
}

