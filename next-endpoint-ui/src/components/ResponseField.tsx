import React from "react";

type ResponseFieldProps = {
  children: React.ReactNode;
  name: string;
  type: string;
  required?: boolean;
  optional?: boolean;
};

export default function ResponseField({
  children,
  name,
  type,
  required,
  optional,
}: ResponseFieldProps) {
  const isRequired = required !== undefined ? required : !optional;

  return (
    <div className="mb-6 rounded-lg border border-white/10 bg-black/40 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="font-mono text-sm font-semibold text-white">
          {name}
        </span>
        <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-white/80">
          {type}
        </span>
        {isRequired ? (
          <span className="rounded bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
            required
          </span>
        ) : (
          <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs text-blue-400">
            optional
          </span>
        )}
      </div>
      <div className="text-white/80 leading-7">{children}</div>
    </div>
  );
}


