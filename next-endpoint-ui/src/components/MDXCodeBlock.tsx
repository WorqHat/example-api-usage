"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type MDXCodeBlockProps = {
  className?: string;
  children?: string | React.ReactNode;
  [key: string]: unknown;
};

export default function MDXCodeBlock({
  className,
  children,
  ...props
}: MDXCodeBlockProps) {
  // Extract language from className (format: "language-javascript" or "language-js")
  const match = /language-(\w+)/.exec(className || "");
  const codeString = String(children || "").replace(/\n$/, "");

  // If it's a code block with a language specified, use syntax highlighting
  if (match) {
    const language = match[1];
    return (
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        className="rounded-lg !mt-4 !mb-4 !bg-black/90 !border !border-white/10"
        customStyle={{
          padding: "1rem",
          borderRadius: "0.5rem",
          marginTop: "1rem",
          marginBottom: "1rem",
        }}
        {...props}
      >
        {codeString}
      </SyntaxHighlighter>
    );
  }

  // Inline code (no language specified)
  return (
    <code
      className="rounded bg-black/40 px-1 py-0.5 text-[#FDCEB0] font-mono text-sm"
      {...props}
    >
      {children}
    </code>
  );
}

