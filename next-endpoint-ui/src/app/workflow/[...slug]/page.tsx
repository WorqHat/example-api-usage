import PageLayout from "@/components/PageLayout";
import WorkflowLayout from "@/components/WorkflowLayout";
import { getWorkflowContent, getWorkflowSections, getWorkflowById } from "@/lib/workflow";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import MDXCodeBlock from "@/components/MDXCodeBlock";
import { createSlugger } from "@/lib/slugger";

type WorkflowPageProps = {
  params: Promise<{ slug: string[] }>;
};

function createMDXComponents(generateId: (text: string) => string) {
  return {
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
}

export async function generateStaticParams() {
  const sections = getWorkflowSections();
  return sections.map((item) => ({
    slug: item.id.split("/"),
  }));
}

export default async function WorkflowSlugPage({ params }: WorkflowPageProps) {
  const { slug } = await params;
  const workflowId = slug.join("/");

  const sections = getWorkflowSections();
  const workflow = getWorkflowById(workflowId);
  const content = getWorkflowContent(workflowId);

  if (!workflow || !content) {
    notFound();
  }

  const titleMatch = content.match(/^#\s+(.+)$/m);
  const itemTitle = titleMatch ? titleMatch[1] : workflow.title;

  const slugger = createSlugger();
  const baseComponents = createMDXComponents(slugger);

  const customComponents = {
    ...baseComponents,
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
      const id = typeof children === "string" ? slugger(children) : "";
      const isFirstH1 =
        typeof children === "string" && children === itemTitle;

      if (isFirstH1) {
        return null;
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
      <WorkflowLayout
        content={content}
        title={itemTitle}
        segment={workflow.segment}
        sections={sections}
      >
        <MDXRemote source={content} components={customComponents} />
      </WorkflowLayout>
    </PageLayout>
  );
}

