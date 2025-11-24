import PageLayout from "@/components/PageLayout";
import DocsLayout from "@/components/DocsLayout";
import { getDocContent, getDocById, docSections } from "@/lib/docs";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import MDXCodeBlock from "@/components/MDXCodeBlock";

type DocsPageProps = {
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
        className="mb-6 scroll-mt-6 text-4xl font-bold text-white"
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
  return docSections.map((doc) => ({
    slug: doc.id,
  }));
}

export default async function DocsSlugPage({ params }: DocsPageProps) {
  const { slug } = await params;
  const doc = getDocById(slug);
  const content = getDocContent(slug);

  if (!doc || !content) {
    notFound();
  }

  // Extract title from first h1 in content
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const docTitle = titleMatch ? titleMatch[1] : doc.title;

  // Create components that hide the first h1 if it matches the title
  const customComponents = {
    ...components,
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
      const id = typeof children === "string" ? generateId(children) : "";
      const isFirstH1 = typeof children === "string" && children === docTitle;
      
      if (isFirstH1) {
        return null; // Hide the first h1 since it's shown in the header
      }
      
      return (
        <h1
          id={id}
          className="mb-6 scroll-mt-6 text-4xl font-bold text-white"
          {...props}
        >
          {children}
        </h1>
      );
    },
  };

  return (
    <PageLayout>
      <DocsLayout
        content={content}
        title={docTitle}
        segment={doc.segment}
      >
        <MDXRemote source={content} components={customComponents} />
      </DocsLayout>
    </PageLayout>
  );
}

