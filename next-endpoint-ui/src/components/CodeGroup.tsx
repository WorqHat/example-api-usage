"use client";

type CodeGroupProps = {
  children: React.ReactNode;
};

export default function CodeGroup({ children }: CodeGroupProps) {
  return (
    <div className="my-4 grid gap-4 rounded-lg border border-white/10 bg-black/50 p-4">
      {children}
    </div>
  );
}
