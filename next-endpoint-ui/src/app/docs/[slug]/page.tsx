import PageLayout from "@/components/PageLayout";
import DocsLayout from "@/components/DocsLayout";
import { getDocContent, getDocById, docSections } from "@/lib/docs";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import MDXCodeBlock from "@/components/MDXCodeBlock";

type DocsPageProps = {
  params: Promise<{ slug: string }>;
};

const components = {
  code: MDXCodeBlock,
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mb-6 text-4xl font-bold text-white" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mb-4 mt-8 text-2xl font-semibold text-white" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mb-3 mt-6 text-xl font-semibold text-white" {...props} />
  ),
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

  return (
    <PageLayout>
      <DocsLayout>
        <MDXRemote source={content} components={components} />
      </DocsLayout>
    </PageLayout>
  );
}

