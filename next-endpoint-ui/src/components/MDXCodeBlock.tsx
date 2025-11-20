"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type MDXCodeBlockProps = {
  className?: string;
  children?: string;
  [key: string]: unknown;
};

export default function MDXCodeBlock({
  className,
  children,
  ...props
}: MDXCodeBlockProps) {
  const match = /language-(\w+)/.exec(className || "");
  const codeString = String(children || "").replace(/\n$/, "");

  if (match) {
    return (
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        className="rounded-lg !mt-4 !mb-4"
        {...props}
      >
        {codeString}
      </SyntaxHighlighter>
    );
  }

  return (
    <code
      className="rounded bg-black/40 px-1 py-0.5 text-[#FDCEB0]"
      {...props}
    >
      {children}
    </code>
  );
}

